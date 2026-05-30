from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from uuid import uuid4

from fastapi import FastAPI, File, HTTPException, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from src.database.supabase_client import get_supabase
from src.risk_engine.fusion_engine import predict_flood_risk

REPORT_MEDIA_BUCKET = "report-media"

app = FastAPI(
    title="BANSOS Flood Risk API",
    description="API for location-based flood risk decision-support system.",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────────────────────
# Pydantic Models
# ─────────────────────────────────────────────────────────────

class ReportCreate(BaseModel):
    title: str = Field(..., min_length=3)
    description: str = Field(..., min_length=3)
    category: str = "BANJIR"
    severity: str = "SEDANG"
    latitude: float
    longitude: float
    location_name: Optional[str] = None
    user_id: Optional[str] = None
    reporter_name: Optional[str] = "Anonymous User"
    tags: List[str] = []


class ReportStatusUpdate(BaseModel):
    status: str
    reason: Optional[str] = None
    admin_notes: Optional[str] = None
    admin_id: Optional[str] = None


class BroadcastCreate(BaseModel):
    title: str
    message: str
    severity: str = "warning"
    target_location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    radius_m: Optional[int] = 3000
    admin_id: Optional[str] = None


class SavedLocationCreate(BaseModel):
    user_id: str
    name: str = Field(..., min_length=1)
    address: str = Field(..., min_length=1)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    status: str = "clear"
    radius: int = Field(3, ge=1, le=50)


class SavedLocationUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    status: Optional[str] = None
    radius: Optional[int] = Field(None, ge=1, le=50)


class RiskSnapshotCreate(BaseModel):
    latitude: float
    longitude: float
    kelurahan: Optional[str] = None
    kecamatan: Optional[str] = None
    kota_administrasi: Optional[str] = None
    final_score: Optional[float] = None
    probability_percent: Optional[float] = None
    risk_level: Optional[str] = None
    trend: Optional[str] = None
    weather_score: Optional[float] = None
    water_score: Optional[float] = None
    baseline_score: Optional[float] = None
    historical_score: Optional[float] = None
    data_freshness_warning: Optional[str] = None


# ─────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────

def _db_error(exc: Exception) -> HTTPException:
    return HTTPException(status_code=500, detail=str(exc))


def _normalize_status(status: str) -> str:
    allowed = {"pending", "approved", "rejected", "duplicate", "need_review", "resolved"}
    value = status.strip().lower()
    if value not in allowed:
        raise HTTPException(status_code=400, detail=f"Invalid status '{status}'. Allowed: {sorted(allowed)}")
    return value


def _normalize_severity(severity: str) -> str:
    mapping = {
        "low": "RENDAH",
        "medium": "SEDANG",
        "critical": "KRITIS",
        "rendah": "RENDAH",
        "sedang": "SEDANG",
        "kritis": "KRITIS",
        "high": "KRITIS",
    }
    return mapping.get(severity.strip().lower(), severity.strip().upper())


def _public_media_url(path: str) -> str:
    supabase = get_supabase()
    return supabase.storage.from_(REPORT_MEDIA_BUCKET).get_public_url(path)


# ─────────────────────────────────────────────────────────────
# Core API
# ─────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "BANSOS Flood Risk API is running."}


@app.get("/risk")
def get_risk(lat: float = Query(...), lng: float = Query(...)):
    result = predict_flood_risk(lat=lat, lng=lng)
    return result


# ─────────────────────────────────────────────────────────────
# Reports: user submits reports, admin verifies reports
# ─────────────────────────────────────────────────────────────

@app.post("/reports")
def create_report(report: ReportCreate):
    supabase = get_supabase()
    payload = {
        "user_id": report.user_id,
        "reporter_name": report.reporter_name or "Anonymous User",
        "title": report.title,
        "description": report.description,
        "category": report.category.strip().upper(),
        "severity": _normalize_severity(report.severity),
        "latitude": report.latitude,
        "longitude": report.longitude,
        "location_name": report.location_name,
        "status": "pending",
        "confidence_score": 0,
        "tags": report.tags,
    }

    try:
        result = supabase.table("reports").insert(payload).execute()
        return {"success": True, "data": result.data[0] if result.data else None}
    except Exception as exc:
        raise _db_error(exc)


@app.get("/reports")
def get_reports(
    status: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
):
    supabase = get_supabase()

    try:
        query = (
            supabase
            .table("reports")
            .select("*, report_media(*)")
            .order("created_at", desc=True)
            .limit(limit)
        )
        if status:
            query = query.eq("status", status.strip().lower())

        result = query.execute()
        return {"success": True, "data": result.data}
    except Exception as exc:
        raise _db_error(exc)


@app.get("/reports/{report_id}")
def get_report_detail(report_id: str):
    supabase = get_supabase()
    try:
        result = (
            supabase
            .table("reports")
            .select("*, report_media(*), report_verifications(*)")
            .eq("id", report_id)
            .single()
            .execute()
        )
        return {"success": True, "data": result.data}
    except Exception as exc:
        raise _db_error(exc)


def _calc_approval_confidence(report_data: Dict[str, Any]) -> int:
    """
    Confidence on admin approval is based on report content quality.
    Max 90 — reaching 100 would require additional community confirmations.
      +50  base (admin verified)
      +10  per photo, max 3 photos  → up to +30
      +10  if description >= 50 chars
    """
    media = report_data.get("report_media") or []
    photo_count = sum(1 for m in media if m.get("media_type") != "video")
    desc_length = len(report_data.get("description") or "")

    score = 50 + min(photo_count * 10, 30) + (10 if desc_length >= 50 else 0)
    return min(score, 90)


@app.patch("/reports/{report_id}/status")
def update_report_status(report_id: str, update: ReportStatusUpdate):
    supabase = get_supabase()
    normalized_status = _normalize_status(update.status)

    try:
        report_patch: Dict[str, Any] = {
            "status": normalized_status,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
        if normalized_status == "approved":
            report_row = (
                supabase
                .table("reports")
                .select("description, report_media(*)")
                .eq("id", report_id)
                .single()
                .execute()
            )
            report_patch["confidence_score"] = _calc_approval_confidence(report_row.data or {})
        elif normalized_status == "rejected":
            report_patch["confidence_score"] = 0

        report_result = (
            supabase
            .table("reports")
            .update(report_patch)
            .eq("id", report_id)
            .execute()
        )

        # Store verification/audit note. This is useful for academic/demo proof.
        if normalized_status in {"approved", "rejected", "duplicate", "need_review"}:
            supabase.table("report_verifications").insert({
                "report_id": report_id,
                "admin_id": update.admin_id,
                "decision": normalized_status,
                "reason": update.reason,
                "admin_notes": update.admin_notes,
            }).execute()

        return {"success": True, "data": report_result.data}
    except Exception as exc:
        raise _db_error(exc)


@app.post("/reports/{report_id}/confirm")
def confirm_report(report_id: str):
    """
    Community field confirmation. Each confirmation adds +5 confidence, capped at 100.
    Combining admin approval (max 90) with 2 community confirmations reaches 100.
    """
    supabase = get_supabase()
    try:
        row = (
            supabase
            .table("reports")
            .select("confidence_score")
            .eq("id", report_id)
            .single()
            .execute()
        )
        current = (row.data or {}).get("confidence_score") or 0
        new_score = min(current + 5, 100)

        result = (
            supabase
            .table("reports")
            .update({
                "confidence_score": new_score,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            })
            .eq("id", report_id)
            .execute()
        )
        return {"success": True, "data": result.data[0] if result.data else None}
    except Exception as exc:
        raise _db_error(exc)


_IMAGE_EXTENSIONS = {"jpg", "jpeg", "png", "gif", "webp", "heic", "heif", "bmp", "tiff", "tif"}
_VIDEO_EXTENSIONS = {"mp4", "mov", "avi", "mkv", "webm", "3gp", "m4v"}

def _is_allowed_media(content_type: str | None, filename: str | None) -> bool:
    if content_type and content_type.startswith(("image/", "video/")):
        return True
    ext = (filename or "").rsplit(".", 1)[-1].lower()
    return ext in _IMAGE_EXTENSIONS or ext in _VIDEO_EXTENSIONS


@app.post("/reports/{report_id}/media")
async def upload_report_media(report_id: str, file: UploadFile = File(...)):
    supabase = get_supabase()

    if not _is_allowed_media(file.content_type, file.filename):
        raise HTTPException(status_code=400, detail="Only image/video uploads are allowed.")

    extension = (file.filename or "media").split(".")[-1]
    storage_path = f"reports/{report_id}/{uuid4()}.{extension}"
    file_bytes = await file.read()

    try:
        supabase.storage.from_(REPORT_MEDIA_BUCKET).upload(
            storage_path,
            file_bytes,
            file_options={"content-type": file.content_type, "upsert": "false"},
        )
        public_url = _public_media_url(storage_path)

        media_result = supabase.table("report_media").insert({
            "report_id": report_id,
            "media_url": public_url,
            "media_type": "video" if file.content_type.startswith("video/") else "image",
            "storage_path": storage_path,
        }).execute()

        return {"success": True, "data": media_result.data[0] if media_result.data else None}
    except Exception as exc:
        raise _db_error(exc)


# ─────────────────────────────────────────────────────────────
# Saved Locations
# ─────────────────────────────────────────────────────────────

@app.get("/saved-locations")
def get_saved_locations(user_id: str = Query(...)):
    supabase = get_supabase()
    try:
        result = (
            supabase
            .table("saved_locations")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=False)
            .execute()
        )
        return {"success": True, "data": result.data}
    except Exception as exc:
        raise _db_error(exc)


@app.post("/saved-locations")
def create_saved_location(location: SavedLocationCreate):
    supabase = get_supabase()
    try:
        result = supabase.rpc("create_saved_location", {
            "p_user_id": location.user_id,
            "p_name": location.name,
            "p_address": location.address,
            "p_latitude": location.latitude,
            "p_longitude": location.longitude,
            "p_status": location.status,
            "p_radius": location.radius,
        }).execute()
        data = result.data[0] if result.data else None
        return {"success": True, "data": data}
    except Exception as exc:
        raise _db_error(exc)


@app.patch("/saved-locations/{location_id}")
def update_saved_location(location_id: str, update: SavedLocationUpdate):
    supabase = get_supabase()
    try:
        patch = {k: v for k, v in update.model_dump().items() if v is not None}
        patch["updated_at"] = datetime.now(timezone.utc).isoformat()
        result = (
            supabase
            .table("saved_locations")
            .update(patch)
            .eq("id", location_id)
            .execute()
        )
        return {"success": True, "data": result.data[0] if result.data else None}
    except Exception as exc:
        raise _db_error(exc)


@app.delete("/saved-locations/{location_id}")
def delete_saved_location(location_id: str):
    supabase = get_supabase()
    try:
        supabase.table("saved_locations").delete().eq("id", location_id).execute()
        return {"success": True, "data": None}
    except Exception as exc:
        raise _db_error(exc)


# ─────────────────────────────────────────────────────────────
# Broadcast alerts
# ─────────────────────────────────────────────────────────────

@app.post("/broadcasts")
def create_broadcast(alert: BroadcastCreate):
    supabase = get_supabase()
    payload = alert.model_dump()

    try:
        result = supabase.table("broadcast_alerts").insert(payload).execute()
        return {"success": True, "data": result.data[0] if result.data else None}
    except Exception as exc:
        raise _db_error(exc)


@app.get("/broadcasts")
def get_broadcasts(limit: int = Query(30, ge=1, le=100)):
    supabase = get_supabase()
    try:
        result = (
            supabase
            .table("broadcast_alerts")
            .select("*")
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        return {"success": True, "data": result.data}
    except Exception as exc:
        raise _db_error(exc)


# ─────────────────────────────────────────────────────────────
# Risk snapshots, optional for historical analytics
# ─────────────────────────────────────────────────────────────

@app.post("/risk-snapshots")
def create_risk_snapshot(snapshot: RiskSnapshotCreate):
    supabase = get_supabase()
    try:
        result = supabase.table("risk_snapshots").insert(snapshot.model_dump()).execute()
        return {"success": True, "data": result.data[0] if result.data else None}
    except Exception as exc:
        raise _db_error(exc)


@app.get("/admin/overview")
def admin_overview():
    """Small dashboard summary for the Admin Portal Overview tab."""
    supabase = get_supabase()
    try:
        pending = supabase.table("reports").select("id", count="exact").eq("status", "pending").execute()
        approved = supabase.table("reports").select("id", count="exact").eq("status", "approved").execute()
        rejected = supabase.table("reports").select("id", count="exact").eq("status", "rejected").execute()
        broadcasts = supabase.table("broadcast_alerts").select("id", count="exact").execute()

        return {
            "success": True,
            "data": {
                "pending_reports": pending.count or 0,
                "approved_reports": approved.count or 0,
                "rejected_reports": rejected.count or 0,
                "broadcast_alerts": broadcasts.count or 0,
            },
        }
    except Exception as exc:
        raise _db_error(exc)
