import { useState, useRef, useEffect, useCallback } from "react";
import { ThemedTileLayer } from "../components/ThemedTileLayer";
import { useNavigate } from "react-router";
import {
  MapContainer,
  CircleMarker,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import {
  ArrowLeft,
  Plus,
  Minus,
  Search,
  ChevronUp,
  ChevronDown,
  Bell,
  Settings,
  X,
  AlertTriangle,
  CheckCircle,
  Info,
  SlidersHorizontal,
  MapPin,
  Loader2,
} from "lucide-react";
import { mapRiskPoints } from "../data/reports";
import imgFloodedStreet from "../../imports/BanSosImmersiveMapDashboard-1-1/eceb2ccdba1950d9889fd09510cc1f0d660cdce5.png";
import "../utils/leaflet-fix";
import {
  fetchFloodRisk,
  fetchReports,
  riskLevelToLabel,
  riskLevelColor,
  trendToLabel,
  type FloodRiskResponse,
  type CommunityReport,
} from "../services/api";
import { getCurrentUserLocation } from "../services/location";
import { ThemeToggle } from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import {
  resolvePrimaryLocation,
  DEFAULT_LAT,
  DEFAULT_LNG,
} from "../services/primaryLocation";
const NEARBY_REPORT_RADIUS_KM = 5;

const riskPointColors: Record<string, string> = {
  high: "#ef4444",
  moderate: "#fb923c",
  safe: "#22c55e",
};

type MapNotification = {
  id: string;
  type: "critical" | "warning" | "info" | "success";
  title: string;
  desc: string;
  time: string;
  read: boolean;
};

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

function isValidCoordinate(lat?: number | null, lng?: number | null) {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng)
  );
}

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const earthRadiusKm = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

function formatTimeAgo(createdAt?: string) {
  if (!createdAt) return "-";

  const createdTime = new Date(createdAt).getTime();

  if (Number.isNaN(createdTime)) return "-";

  const diffMinutes = Math.max(
    0,
    Math.floor((Date.now() - createdTime) / 60000),
  );

  if (diffMinutes < 1) return "baru saja";
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) return `${diffHours} jam lalu`;

  const diffDays = Math.floor(diffHours / 24);

  return `${diffDays} hari lalu`;
}

function notificationTypeFromSeverity(
  severity?: string,
): MapNotification["type"] {
  const value = String(severity ?? "").toLowerCase();

  if (value === "critical" || value === "kritis" || value === "high")
    return "critical";
  if (value === "warning" || value === "sedang" || value === "medium")
    return "warning";
  if (value === "resolved" || value === "rendah" || value === "low")
    return "success";

  return "info";
}

function getSeverityRiskLevel(severity?: string): "HIGH" | "MEDIUM" | "LOW" {
  const value = String(severity ?? "").toUpperCase();

  if (value === "KRITIS" || value === "CRITICAL" || value === "HIGH")
    return "HIGH";
  if (value === "SEDANG" || value === "WARNING" || value === "MEDIUM")
    return "MEDIUM";

  return "LOW";
}

function getFirstReportImage(report: CommunityReport) {
  const anyReport = report as any;

  const media =
    anyReport.report_media ??
    anyReport.media ??
    anyReport.reportMedia ??
    anyReport.attachments ??
    [];

  if (!Array.isArray(media) || media.length === 0) {
    return null;
  }

  const image = media.find((item: any) => {
    const type = String(
      item.media_type ?? item.type ?? item.mime_type ?? "",
    ).toLowerCase();
    return type.includes("image") || type === "photo";
  });

  const selected = image ?? media[0];

  return (
    selected?.media_url ??
    selected?.url ??
    selected?.file_url ??
    selected?.public_url ??
    selected?.path ??
    null
  );
}

function formatDisplayName(raw: string): string {
  const parts = raw.split(", ");
  return parts.slice(0, 3).join(", ");
}

function NotifIcon({ type }: { type: string }) {
  if (type === "critical")
    return <AlertTriangle size={13} className="text-red-400" />;
  if (type === "warning")
    return <AlertTriangle size={13} className="text-orange-400" />;
  if (type === "success")
    return <CheckCircle size={13} className="text-green-400" />;
  return <Info size={13} className="text-blue-400" />;
}

export function MapPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const mapRef = useRef<LeafletMap | null>(null);

  const mapBackground = theme === "light" ? "#eef2f7" : "#10131a";
  const activeReportColor = theme === "light" ? "#2563eb" : "#adc6ff";

  const [showRiskZones, setShowRiskZones] = useState(true);
  const [showActiveReports, setShowActiveReports] = useState(true);
  const [showReliefCenters, setShowReliefCenters] = useState(false);
  const [mapControlOpen, setMapControlOpen] = useState(true);
  const [showNearby, setShowNearby] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [clickRiskData, setClickRiskData] = useState<FloodRiskResponse | null>(
    null,
  );
  const [clickRiskLoading, setClickRiskLoading] = useState(false);
  const [clickRiskError, setClickRiskError] = useState<string | null>(null);
  const [clickCoords, setClickCoords] = useState<[number, number] | null>(null);

  const [apiReports, setApiReports] = useState<CommunityReport[]>([]);
  const [userCoords, setUserCoords] = useState({
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
  });
  const userLocationPoint: [number, number] = [userCoords.lat, userCoords.lng];
  const [usingUserLocation, setUsingUserLocation] = useState(false);
  const [showUserLocationLabel, setShowUserLocationLabel] = useState(true);

  // Cached primary-location coords so the 60-second interval
  // doesn't call the Supabase API on every reload.
  const primaryCoordsRef = useRef<{ lat: number; lng: number } | null>(null);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifList, setNotifList] = useState<MapNotification[]>([]);
  const [dismissedWarningId, setDismissedWarningId] = useState<string | null>(
    null,
  );
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifList.filter((n) => !n.read).length;

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchPin, setSearchPin] = useState<{
    coords: [number, number];
    label: string;
  } | null>(null);
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);
  const [showDropMobile, setShowDropMobile] = useState(false);
  const [showDropDesktop, setShowDropDesktop] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    // Debounce 600 ms — mencegah spam klik memborosi API quota
    if (clickDebounceRef.current) clearTimeout(clickDebounceRef.current);

    setClickCoords([lat, lng]);
    setClickRiskLoading(true);
    setClickRiskError(null);
    setClickRiskData(null);

    clickDebounceRef.current = setTimeout(async () => {
      try {
        const data = await fetchFloodRisk(lat, lng);
        setClickRiskData(data);
      } catch (err: any) {
        setClickRiskError(err.message || "Risk query failed");
      } finally {
        setClickRiskLoading(false);
      }
    }, 600);
  }, []);

  const clearClickRisk = () => {
    setClickRiskData(null);
    setClickRiskError(null);
    setClickCoords(null);
  };

  useEffect(() => {
    const loadMapData = async () => {
      // Resolve once: sessionStorage → saved locations → Jakarta defaults
      if (!primaryCoordsRef.current) {
        const resolved = await resolvePrimaryLocation();
        primaryCoordsRef.current = { lat: resolved.lat, lng: resolved.lng };
      }

      // GPS takes priority when available; primary address is the fallback
      let center = primaryCoordsRef.current;

      try {
        const location = await getCurrentUserLocation();

        center = {
          lat: location.latitude,
          lng: location.longitude,
        };

        // Cache the GPS coords so the interval uses them too
        primaryCoordsRef.current = center;
        setUsingUserLocation(true);
      } catch {
        setUsingUserLocation(false);
        // center stays as primary address — not hardcoded Kemang
      }

      setUserCoords(center);

      try {
        const [reportsResult, riskResult] = await Promise.allSettled([
          fetchReports(),
          fetchFloodRisk(center.lat, center.lng),
        ]);

        const reports =
          reportsResult.status === "fulfilled"
            ? (reportsResult.value.data ?? [])
            : [];

        setApiReports(reports);

        const nearbyReports = reports
          .filter((report) =>
            isValidCoordinate(report.latitude, report.longitude),
          )
          .map((report) => ({
            ...report,
            distance_km: distanceKm(
              center.lat,
              center.lng,
              report.latitude,
              report.longitude,
            ),
          }))
          .filter((report) => report.distance_km <= NEARBY_REPORT_RADIUS_KM)
          .sort((a, b) => a.distance_km - b.distance_km);

        const generatedNotifications: MapNotification[] = [];

        if (
          riskResult.status === "fulfilled" &&
          riskResult.value.risk.risk_level === "HIGH"
        ) {
          generatedNotifications.push({
            id: "risk-high",
            type: "critical",
            title: "Risiko Banjir Tinggi Terdeteksi",
            desc: `Potensi banjir di area ${riskResult.value.location.kelurahan}, ${riskResult.value.location.kota_administrasi}. Probabilitas ${riskResult.value.risk.probability_percent.toFixed(1)}%.`,
            time: "sekarang",
            read: false,
          });
        }

        nearbyReports.slice(0, 6).forEach((report) => {
          generatedNotifications.push({
            id: `report-${report.id}`,
            type: notificationTypeFromSeverity(report.severity),
            title: `Laporan Baru: ${report.title}`,
            desc: `${report.location_name ?? report.category ?? "Lokasi laporan"} • ${report.distance_km.toFixed(
              2,
            )} km dari ${usingUserLocation ? "lokasi Anda" : "pusat Jakarta"}`,
            time: formatTimeAgo(report.created_at),
            read: false,
          });
        });

        setNotifList(generatedNotifications);
      } catch (err) {
        console.error("Failed to load map data:", err);
      }
    };

    loadMapData();

    // Refresh setiap 10 menit — cukup untuk data risiko/laporan,
    // dan tidak memborosi limit 60 req/menit dari external API.
    const interval = window.setInterval(loadMapData, 10 * 60 * 1000);

    return () => window.clearInterval(interval);
  }, [usingUserLocation]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();

  const activeReportPoints = apiReports
    .filter((report) => isValidCoordinate(report.latitude, report.longitude))
    .map((report) => ({
      id: report.id,
      coordinates: [report.latitude, report.longitude] as [number, number],
      level:
        report.severity === "KRITIS"
          ? "high"
          : report.severity === "SEDANG"
            ? "moderate"
            : "safe",
      title: report.title,
    }));

  const reliefCenters = [
    {
      id: "rc1",
      coordinates: [-6.1744, 106.8294] as [number, number],
      name: "Pusat Bantuan Jakarta Pusat",
    },
    {
      id: "rc2",
      coordinates: [-6.2615, 106.7909] as [number, number],
      name: "Pusat Bantuan Jakarta Selatan",
    },
  ];

  const nearbyReports = apiReports
    .filter((report) => isValidCoordinate(report.latitude, report.longitude))
    .map((report) => ({
      ...report,
      distance_km: distanceKm(
        userCoords.lat,
        userCoords.lng,
        report.latitude,
        report.longitude,
      ),
    }))
    .filter((report) => report.distance_km <= NEARBY_REPORT_RADIUS_KM)
    .sort((a, b) => a.distance_km - b.distance_km);

  const criticalNotification = notifList.find(
    (notification) => notification.type === "critical",
  );

  const activeWarningNotification =
    criticalNotification && criticalNotification.id !== dismissedWarningId
      ? criticalNotification
      : null;

  const fetchSuggestions = useCallback((value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setSuggestions([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          `${value} Jakarta`,
        )}&format=json&limit=7&countrycodes=id&accept-language=id`;

        const res = await fetch(url, {
          headers: {
            "User-Agent": "BanSos-App/1.0",
          },
        });

        const data: NominatimResult[] = await res.json();
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    }, 420);
  }, []);

  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
    fetchSuggestions(value);
  };

  const handleSelectSuggestion = (result: NominatimResult) => {
    const coords: [number, number] = [
      parseFloat(result.lat),
      parseFloat(result.lon),
    ];
    const label = formatDisplayName(result.display_name);

    setSearchQuery(label);
    setSearchPin({ coords, label });
    setFlyTarget(coords);
    setSuggestions([]);
    setShowDropMobile(false);
    setShowDropDesktop(false);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setSearchPin(null);
    setFlyTarget(null);
    setShowDropMobile(false);
    setShowDropDesktop(false);
  };

  const sharedInputClassBase =
    "w-full bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-full pl-9 pr-8 text-[var(--text-main)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] backdrop-blur-sm transition-colors";

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[var(--bg-main)] text-[var(--text-main)]">
      {activeWarningNotification && (
        <div className="absolute top-0 left-0 right-0 z-[1000] bg-[#b3261e] flex items-center justify-center gap-2 py-2 px-10">
          <span className="text-[#ffb4ab] text-sm">⚠</span>

          <span className="text-white text-sm font-medium text-center truncate">
            {activeWarningNotification.title}
          </span>

          <button
            type="button"
            onClick={() => {
              setDismissedWarningId(activeWarningNotification.id);

              setNotifList((prev) =>
                prev.map((item) =>
                  item.id === activeWarningNotification.id
                    ? { ...item, read: true }
                    : item,
                ),
              );
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/80 hover:bg-white/15 hover:text-white transition-colors"
            aria-label="Tutup peringatan"
            title="Tutup peringatan"
          >
            <X size={15} />
          </button>
        </div>
      )}

      <div
        className={`map-topbar absolute ${
          activeWarningNotification ? "top-[36px]" : "top-0"
        } left-0 right-0 z-[1001] flex items-center justify-between px-4 lg:px-8 py-2 bg-[var(--bg-card)]/90 border-b border-[var(--border-soft)] backdrop-blur-md shadow-sm`}
      >
        <button
          onClick={() => navigate("/dashboard")}
          className="text-[var(--accent)] text-xl font-black tracking-tighter hover:opacity-80 transition-opacity"
        >
          BanSos
        </button>

        <div className="flex items-center gap-1">
          <ThemeToggle />

          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications((value) => !value)}
              className="relative p-2 rounded-full text-[var(--text-muted)] hover:bg-[var(--accent-soft)] transition-colors"
            >
              <Bell size={18} />

              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="fixed top-[84px] left-2 right-2 sm:left-auto sm:right-2 sm:w-[340px] bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-xl shadow-2xl overflow-hidden z-[1002]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-soft)]">
                  <div className="flex items-center gap-2">
                    <Bell size={13} className="text-[var(--accent)]" />
                    <span className="text-[var(--text-main)] text-sm font-semibold">
                      Notifikasi
                    </span>

                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={() =>
                          setNotifList((prev) =>
                            prev.map((item) => ({ ...item, read: true })),
                          )
                        }
                        className="text-[var(--accent)] text-xs hover:underline"
                      >
                        Tandai dibaca
                      </button>
                    )}

                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                <div className="max-h-[360px] overflow-y-auto divide-y divide-[var(--border-soft)]">
                  {notifList.length === 0 && (
                    <div className="p-4 text-[var(--text-muted)] text-sm text-center">
                      Belum ada notifikasi dari laporan sekitar lokasi Anda.
                    </div>
                  )}

                  {notifList.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-[var(--accent-soft)] ${
                        !notification.read ? "bg-[var(--accent-soft)]" : ""
                      }`}
                      onClick={() =>
                        setNotifList((prev) =>
                          prev.map((item) =>
                            item.id === notification.id
                              ? { ...item, read: true }
                              : item,
                          ),
                        )
                      }
                    >
                      <div
                        className={`mt-0.5 shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                          notification.type === "critical"
                            ? "bg-red-500/15"
                            : notification.type === "warning"
                              ? "bg-orange-400/15"
                              : notification.type === "success"
                                ? "bg-green-500/15"
                                : "bg-blue-400/15"
                        }`}
                      >
                        <NotifIcon type={notification.type} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-xs font-semibold leading-tight ${
                              !notification.read
                                ? "text-[var(--text-main)]"
                                : "text-[var(--text-soft)]"
                            }`}
                          >
                            {notification.title}
                          </p>

                          {!notification.read && (
                            <div
                              className={`w-2 h-2 rounded-full shrink-0 mt-0.5 ${
                                notification.type === "critical"
                                  ? "bg-red-500"
                                  : notification.type === "warning"
                                    ? "bg-orange-400"
                                    : "bg-blue-400"
                              }`}
                            />
                          )}
                        </div>

                        <p className="text-[var(--text-muted)] text-xs mt-0.5 line-clamp-2">
                          {notification.desc}
                        </p>

                        <p className="text-[var(--text-muted)] text-[10px] mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-4 py-2.5 border-t border-[var(--border-soft)] flex justify-center">
                  <button className="text-[var(--accent)] text-xs hover:underline">
                    Lihat semua notifikasi
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate("/dashboard/settings")}
            className="p-2 rounded-full text-[var(--text-muted)] hover:bg-[var(--accent-soft)] transition-colors"
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      <div
        className={`absolute ${
          activeWarningNotification ? "top-[96px]" : "top-[60px]"
        } left-4 right-4 z-[999] md:hidden flex flex-col gap-2`}
      >
        <div className="relative z-10 flex items-center gap-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-full text-[var(--text-main)] text-sm backdrop-blur-sm hover:bg-[var(--accent-soft)] transition-colors shrink-0"
          >
            <ArrowLeft size={14} />
            Back
          </button>

          <SearchBox
            inputClass={`${sharedInputClassBase} py-2`}
            dropdownClass="absolute top-full mt-1.5 left-0 right-0 bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-xl overflow-hidden backdrop-blur-sm shadow-xl z-20 max-h-[240px] overflow-y-auto"
            query={searchQuery}
            suggestions={suggestions}
            loading={searchLoading}
            showDrop={showDropMobile}
            onInput={handleSearchInput}
            onSelect={handleSelectSuggestion}
            onClear={handleClearSearch}
            onFocus={() => setShowDropMobile(true)}
            onBlur={() => setTimeout(() => setShowDropMobile(false), 150)}
          />

          <div className="relative shrink-0">
            <button
              onClick={() => setShowNearby(!showNearby)}
              className="px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-full text-[var(--text-main)] text-sm backdrop-blur-sm hover:bg-[var(--accent-soft)] transition-colors"
            >
              Reports
            </button>

            {showNearby && (
              <div className="absolute top-10 right-0 w-[270px] bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-soft)]">
                  <span className="text-[var(--text-main)] text-sm font-semibold">
                    Nearby Reports
                  </span>

                  <button
                    onClick={() => navigate("/dashboard/reports")}
                    className="text-[var(--accent)] text-xs hover:underline"
                  >
                    All
                  </button>
                </div>

                {nearbyReports.length === 0 && (
                  <div className="p-3 text-[var(--text-muted)] text-xs text-center">
                    Tidak ada laporan dalam radius {NEARBY_REPORT_RADIUS_KM} km.
                  </div>
                )}

                {nearbyReports.slice(0, 2).map((report) => (
                  <NearbyReportItem
                    key={report.id}
                    report={report}
                    onClick={() => navigate(`/dashboard/reports/${report.id}`)}
                    usingUserLocation={usingUserLocation}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative self-start">
          <button
            onClick={() => setShowMobileFilters((value) => !value)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium backdrop-blur-sm border transition-colors ${
              showMobileFilters
                ? "bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--accent)]"
                : "bg-[var(--bg-card)] border-[var(--border-soft)] text-[var(--text-main)]"
            }`}
          >
            <SlidersHorizontal size={13} />
            Filters
          </button>

          {showMobileFilters && (
            <MapLayerPanel
              showRiskZones={showRiskZones}
              setShowRiskZones={setShowRiskZones}
              showActiveReports={showActiveReports}
              setShowActiveReports={setShowActiveReports}
              showReliefCenters={showReliefCenters}
              setShowReliefCenters={setShowReliefCenters}
              onClose={() => setShowMobileFilters(false)}
              mobile
            />
          )}
        </div>
      </div>

      <div
        className={`absolute ${
          activeWarningNotification ? "top-[96px]" : "top-[60px]"
        } left-8 z-[999] hidden md:block`}
      >
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-full text-[var(--text-main)] text-sm backdrop-blur-sm hover:bg-[var(--accent-soft)] transition-colors"
        >
          <ArrowLeft size={14} />
          Back
        </button>
      </div>

      <div
        className={`absolute ${
          activeWarningNotification ? "top-[148px]" : "top-[112px]"
        } left-8 z-[1002] w-[270px] hidden md:block`}
      >
        <SearchBox
          inputClass={`${sharedInputClassBase} py-2.5`}
          dropdownClass="absolute top-full mt-1.5 left-0 right-0 bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-xl overflow-hidden backdrop-blur-sm shadow-xl z-20 max-h-[280px] overflow-y-auto"
          query={searchQuery}
          suggestions={suggestions}
          loading={searchLoading}
          showDrop={showDropDesktop}
          onInput={handleSearchInput}
          onSelect={handleSelectSuggestion}
          onClear={handleClearSearch}
          onFocus={() => setShowDropDesktop(true)}
          onBlur={() => setTimeout(() => setShowDropDesktop(false), 150)}
        />

        {searchPin && (
          <div className="mt-2 flex items-center gap-2 bg-[var(--accent-soft)] border border-[var(--border-soft)] rounded-full px-3 py-1.5">
            <MapPin size={11} className="text-[var(--accent)] shrink-0" />
            <span className="text-[var(--accent)] text-xs flex-1 truncate">
              {searchPin.label}
            </span>
            <button
              onClick={handleClearSearch}
              className="text-[var(--accent)] hover:opacity-80 transition-colors"
            >
              <X size={11} />
            </button>
          </div>
        )}
      </div>

      <div
        className={`absolute ${
          activeWarningNotification ? "top-[200px]" : "top-[164px]"
        } left-8 z-[999] w-[270px] hidden md:block`}
        style={{ marginTop: searchPin ? "32px" : "0" }}
      >
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-xl overflow-hidden backdrop-blur-sm">
          <button
            className="w-full flex items-center justify-between px-4 py-3 text-[var(--text-main)]"
            onClick={() => setMapControlOpen(!mapControlOpen)}
          >
            <span className="font-semibold text-sm">Map Control</span>
            {mapControlOpen ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
          </button>

          {mapControlOpen && (
            <div className="border-t border-[var(--border-soft)] px-4 py-3 space-y-3">
              <MapLayerToggle
                label="Risk Zones"
                value={showRiskZones}
                setter={setShowRiskZones}
              />
              <MapLayerToggle
                label="Active Reports"
                value={showActiveReports}
                setter={setShowActiveReports}
              />
              <MapLayerToggle
                label="Relief Centers"
                value={showReliefCenters}
                setter={setShowReliefCenters}
              />
            </div>
          )}
        </div>
      </div>

      <div
        className={`absolute ${
          activeWarningNotification ? "top-[96px]" : "top-[60px]"
        } right-4 lg:right-8 z-[999] w-[280px] lg:w-[310px] hidden md:block`}
      >
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-xl overflow-hidden backdrop-blur-sm shadow-xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-soft)]">
            <span className="text-[var(--text-main)] text-sm font-semibold">
              Nearby Reports
            </span>

            <button
              onClick={() => navigate("/dashboard/reports")}
              className="text-[var(--accent)] text-xs hover:underline"
            >
              View All
            </button>
          </div>

          <div className="divide-y divide-[var(--border-soft)]">
            {nearbyReports.length === 0 && (
              <div className="p-4 text-[var(--text-muted)] text-xs text-center">
                Tidak ada laporan dalam radius {NEARBY_REPORT_RADIUS_KM} km dari{" "}
                {usingUserLocation ? "lokasi GPS Anda" : "alamat utama Anda"}.
              </div>
            )}

            {nearbyReports.slice(0, 3).map((report) => (
              <NearbyReportItem
                key={report.id}
                report={report}
                onClick={() => navigate(`/dashboard/reports/${report.id}`)}
                usingUserLocation={usingUserLocation}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-4 lg:left-8 z-[999] flex flex-col gap-2 lg:gap-3 items-start">
        <div className="flex flex-col gap-1">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 lg:w-9 lg:h-9 flex items-center justify-center bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-lg text-[var(--text-main)] hover:bg-[var(--accent-soft)] transition-colors backdrop-blur-sm"
          >
            <Plus size={14} />
          </button>

          <button
            onClick={handleZoomOut}
            className="w-8 h-8 lg:w-9 lg:h-9 flex items-center justify-center bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-lg text-[var(--text-main)] hover:bg-[var(--accent-soft)] transition-colors backdrop-blur-sm"
          >
            <Minus size={14} />
          </button>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-xl px-3 lg:px-4 py-2 lg:py-3 backdrop-blur-sm shadow-xl">
          <p className="text-[var(--text-main)] text-xs font-semibold mb-1.5">
            Risk Levels
          </p>

          <div className="space-y-1">
            {[
              ["#ef4444", "High Risk"],
              ["#fb923c", "Moderate"],
              ["#22c55e", "Safe"],
            ].map(([color, label]) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[var(--text-main)] text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-4 lg:right-8 z-[999]">
        <button
          onClick={() => navigate("/dashboard/reports/create")}
          className="flex items-center gap-2 px-4 lg:px-5 py-2.5 lg:py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--text-inverse)] font-semibold text-sm rounded-full shadow-lg transition-colors"
        >
          <Plus size={15} />
          Report
        </button>
      </div>

      {clickCoords && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[1001] w-[320px] max-w-[calc(100vw-2rem)] bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-xl overflow-hidden backdrop-blur-sm shadow-2xl">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border-soft)]">
            <div className="flex items-center gap-2">
              <MapPin size={12} className="text-[var(--accent)]" />
              <span className="text-[var(--text-main)] text-xs font-semibold">
                Flood Risk Query
              </span>
            </div>

            <button
              onClick={clearClickRisk}
              className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          <div className="px-4 py-3">
            {clickRiskLoading && (
              <div className="flex items-center gap-2 py-2">
                <Loader2
                  size={14}
                  className="text-[var(--accent)] animate-spin"
                />
                <span className="text-[var(--text-muted)] text-xs">
                  Analyzing risk for ({clickCoords[0].toFixed(4)},{" "}
                  {clickCoords[1].toFixed(4)})...
                </span>
              </div>
            )}

            {clickRiskError && (
              <div className="py-2">
                <p className="text-[var(--text-muted)] text-xs">
                  ({clickCoords[0].toFixed(4)}, {clickCoords[1].toFixed(4)})
                </p>

                <p className="text-[var(--danger)] text-xs mt-1">
                  {clickRiskError}
                </p>
              </div>
            )}

            {clickRiskData && (
              <div className="space-y-2">
                <p className="text-[var(--text-muted)] text-[10px]">
                  {clickRiskData.location.kelurahan},{" "}
                  {clickRiskData.location.kecamatan}
                </p>

                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-[10px] text-[var(--text-muted)] uppercase">
                      Risk Level
                    </p>
                    <p
                      className="text-lg font-bold"
                      style={{
                        color: riskLevelColor(clickRiskData.risk.risk_level),
                      }}
                    >
                      {riskLevelToLabel(clickRiskData.risk.risk_level)}
                    </p>
                  </div>

                  <div className="flex-1">
                    <p className="text-[10px] text-[var(--text-muted)] uppercase">
                      Probability
                    </p>
                    <p className="text-lg font-bold text-[var(--text-main)]">
                      {clickRiskData.risk.probability_percent.toFixed(1)}%
                    </p>
                  </div>

                  <div className="flex-1">
                    <p className="text-[10px] text-[var(--text-muted)] uppercase">
                      Trend
                    </p>
                    <p className="text-sm font-semibold text-[var(--accent)]">
                      {trendToLabel(clickRiskData.risk.trend)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="bg-[var(--bg-soft)] rounded-lg px-2.5 py-1.5">
                    <p className="text-[9px] text-[var(--text-muted)] uppercase">
                      Weather
                    </p>
                    <p className="text-xs font-bold text-[var(--text-main)]">
                      {(clickRiskData.components.weather_score * 100).toFixed(
                        0,
                      )}
                      %
                    </p>
                  </div>

                  <div className="bg-[var(--bg-soft)] rounded-lg px-2.5 py-1.5">
                    <p className="text-[9px] text-[var(--text-muted)] uppercase">
                      Water Level
                    </p>
                    <p className="text-xs font-bold text-[var(--text-main)]">
                      {clickRiskData.details.water_station.water_level?.toFixed(
                        0,
                      ) ?? "N/A"}{" "}
                      cm
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <MapContainer
        ref={mapRef}
        center={[userCoords.lat, userCoords.lng]}
        zoom={12}
        zoomControl={false}
        style={{ height: "100vh", width: "100vw", background: mapBackground }}
      >
        <FlyTo target={flyTarget} />
        <UserLocationSync coords={userLocationPoint} />
        <HideUserLocationLabelOnMapMove
          onHide={() => setShowUserLocationLabel(false)}
        />
        <MapClickHandler onMapClick={handleMapClick} />
        <ThemedTileLayer />

        <UserLocationMarker
          coords={userLocationPoint}
          usingUserLocation={usingUserLocation}
          showLabel={showUserLocationLabel}
        />

        {showRiskZones &&
          mapRiskPoints.map((point) => (
            <CircleMarker
              key={point.id}
              center={point.coordinates}
              radius={10}
              pathOptions={{
                color: riskPointColors[point.level],
                fillColor: riskPointColors[point.level],
                fillOpacity: 0.7,
                weight: 2,
              }}
            >
              <Tooltip>
                <span>
                  {point.level === "high"
                    ? "🔴 High Risk"
                    : point.level === "moderate"
                      ? "🟠 Moderate"
                      : "🟢 Safe"}
                </span>
              </Tooltip>
            </CircleMarker>
          ))}

        {showActiveReports &&
          activeReportPoints.map((point) => (
            <CircleMarker
              key={`report-${point.id}`}
              center={point.coordinates}
              radius={5}
              pathOptions={{
                color: activeReportColor,
                fillColor: activeReportColor,
                fillOpacity: 0.5,
                weight: 1.5,
              }}
            >
              <Tooltip>
                <span>{point.title}</span>
              </Tooltip>
            </CircleMarker>
          ))}

        {showReliefCenters &&
          reliefCenters.map((center) => (
            <CircleMarker
              key={center.id}
              center={center.coordinates}
              radius={10}
              pathOptions={{
                color: "#4ade80",
                fillColor: "#4ade80",
                fillOpacity: 0.8,
                weight: 2,
              }}
            >
              <Tooltip>
                <span>{center.name}</span>
              </Tooltip>
            </CircleMarker>
          ))}

        {searchPin && (
          <>
            <CircleMarker
              center={searchPin.coords}
              radius={28}
              pathOptions={{
                color: activeReportColor,
                fillColor: activeReportColor,
                fillOpacity: 0.1,
                weight: 2,
                dashArray: "6 4",
              }}
            />

            <CircleMarker
              center={searchPin.coords}
              radius={14}
              pathOptions={{
                color: activeReportColor,
                fillColor: activeReportColor,
                fillOpacity: 0.2,
                weight: 2,
              }}
            />

            <CircleMarker
              center={searchPin.coords}
              radius={7}
              pathOptions={{
                color: "#ffffff",
                fillColor: activeReportColor,
                fillOpacity: 1,
                weight: 2,
              }}
            >
              <Tooltip permanent direction="top" offset={[0, -12]}>
                <span style={{ fontWeight: 600, color: "#002e6a" }}>
                  {searchPin.label}
                </span>
              </Tooltip>
            </CircleMarker>
          </>
        )}

        {clickCoords && (
          <>
            <CircleMarker
              center={clickCoords}
              radius={20}
              pathOptions={{
                color: clickRiskData
                  ? riskLevelColor(clickRiskData.risk.risk_level)
                  : activeReportColor,
                fillColor: clickRiskData
                  ? riskLevelColor(clickRiskData.risk.risk_level)
                  : activeReportColor,
                fillOpacity: 0.15,
                weight: 2,
                dashArray: "4 4",
              }}
            />

            <CircleMarker
              center={clickCoords}
              radius={6}
              pathOptions={{
                color: "#fff",
                fillColor: clickRiskData
                  ? riskLevelColor(clickRiskData.risk.risk_level)
                  : activeReportColor,
                fillOpacity: 1,
                weight: 2,
              }}
            >
              <Tooltip permanent direction="top" offset={[0, -10]}>
                <span
                  style={{ fontWeight: 600, color: "#002e6a", fontSize: 11 }}
                >
                  {clickRiskLoading
                    ? "⏳ Analyzing..."
                    : clickRiskData
                      ? `${riskLevelToLabel(
                          clickRiskData.risk.risk_level,
                        )} — ${clickRiskData.risk.probability_percent.toFixed(1)}%`
                      : clickRiskError
                        ? "⚠ Error"
                        : "Querying..."}
                </span>
              </Tooltip>
            </CircleMarker>
          </>
        )}
      </MapContainer>
    </div>
  );
}

function UserLocationSync({ coords }: { coords: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (!isValidCoordinate(coords[0], coords[1])) return;

    map.flyTo(coords, Math.max(map.getZoom(), 12), {
      duration: 0.9,
    });
  }, [coords[0], coords[1], map]);

  return null;
}

function HideUserLocationLabelOnMapMove({ onHide }: { onHide: () => void }) {
  useMapEvents({
    dragstart: onHide,
    zoomstart: onHide,
  });

  return null;
}

function UserLocationMarker({
  coords,
  usingUserLocation,
  showLabel,
}: {
  coords: [number, number];
  usingUserLocation: boolean;
  showLabel: boolean;
}) {
  const label = usingUserLocation ? "Lokasi Anda" : "Alamat Utama Anda";
  const subtitle = usingUserLocation ? "GPS aktif" : "Lokasi tersimpan";

  return (
    <>
      <CircleMarker
        center={coords}
        radius={28}
        pathOptions={{
          color: "#2563eb",
          fillColor: "#2563eb",
          fillOpacity: 0.08,
          weight: 2,
          dashArray: "6 5",
        }}
      />

      <CircleMarker
        center={coords}
        radius={14}
        pathOptions={{
          color: "#60a5fa",
          fillColor: "#3b82f6",
          fillOpacity: 0.2,
          weight: 2,
        }}
      />

      <CircleMarker
        center={coords}
        radius={7}
        pathOptions={{
          color: "#ffffff",
          fillColor: "#2563eb",
          fillOpacity: 1,
          weight: 2.5,
        }}
      >
        {showLabel && (
          <Tooltip permanent direction="right" offset={[18, 0]} opacity={1}>
            <span
              style={{
                display: "inline-flex",
                flexDirection: "column",
                gap: 1,
                color: "#0f172a",
                fontWeight: 700,
                lineHeight: 1.15,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontSize: 11 }}>📍 {label}</span>
              <span style={{ fontSize: 9, color: "#475569", fontWeight: 600 }}>
                {subtitle}
              </span>
            </span>
          </Tooltip>
        )}
      </CircleMarker>
    </>
  );
}

type NearbyReportWithDistance = CommunityReport & {
  distance_km?: number;
};

function NearbyReportItem({
  report,
  onClick,
  usingUserLocation,
}: {
  report: NearbyReportWithDistance;
  onClick: () => void;
  usingUserLocation: boolean;
}) {
  const firstImage = getFirstReportImage(report);

  return (
    <div
      className="p-3 flex gap-3 hover:bg-[var(--accent-soft)] transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-[var(--bg-soft)] border border-[var(--border-soft)]">
        <img
          src={firstImage ?? imgFloodedStreet}
          alt={report.title}
          className={`w-full h-full object-cover ${firstImage ? "" : "opacity-70"}`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[var(--text-main)] text-sm font-medium truncate">
          {report.title}
        </p>

        <span
          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase ${
            report.severity === "KRITIS"
              ? "bg-[#93000a] text-[#ffdad6]"
              : report.severity === "RENDAH"
                ? "bg-[#002105] text-[#7dd878]"
                : "bg-[#5c3c00] text-[#ffb786]"
          }`}
        >
          {report.severity}
        </span>

        <p className="text-[var(--text-muted)] text-xs mt-0.5 line-clamp-2">
          {report.location_name ?? report.category ?? "Lokasi tidak tersedia"}
        </p>

        {typeof report.distance_km === "number" && (
          <p className="text-[var(--accent)] text-[10px] mt-0.5">
            {report.distance_km.toFixed(2)} km dari{" "}
            {usingUserLocation ? "lokasi GPS Anda" : "alamat utama Anda"}
          </p>
        )}
      </div>
    </div>
  );
}

function MapLayerToggle({
  label,
  value,
  setter,
}: {
  label: string;
  value: boolean;
  setter: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[var(--text-main)] text-sm">{label}</span>

      <button
        onClick={() => setter(!value)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          value
            ? "bg-[var(--accent)] border-[var(--accent)]"
            : "bg-transparent border-[var(--border-strong)]"
        }`}
      >
        {value && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4l2.5 3L9 1"
              stroke="var(--text-inverse)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

function MapLayerPanel({
  showRiskZones,
  setShowRiskZones,
  showActiveReports,
  setShowActiveReports,
  showReliefCenters,
  setShowReliefCenters,
  onClose,
}: {
  showRiskZones: boolean;
  setShowRiskZones: (value: boolean) => void;
  showActiveReports: boolean;
  setShowActiveReports: (value: boolean) => void;
  showReliefCenters: boolean;
  setShowReliefCenters: (value: boolean) => void;
  onClose: () => void;
  mobile?: boolean;
}) {
  return (
    <div className="absolute top-full mt-2 left-0 w-52 bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-xl overflow-hidden backdrop-blur-sm z-10">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border-soft)]">
        <span className="text-[var(--text-main)] text-sm font-semibold">
          Map Layers
        </span>

        <button
          onClick={onClose}
          className="text-[var(--text-muted)] hover:text-[var(--text-main)]"
        >
          <X size={14} />
        </button>
      </div>

      <div className="px-4 py-3 space-y-3">
        <MapLayerToggle
          label="Risk Zones"
          value={showRiskZones}
          setter={setShowRiskZones}
        />
        <MapLayerToggle
          label="Active Reports"
          value={showActiveReports}
          setter={setShowActiveReports}
        />
        <MapLayerToggle
          label="Relief Centers"
          value={showReliefCenters}
          setter={setShowReliefCenters}
        />
      </div>
    </div>
  );
}

interface FlyToProps {
  target: [number, number] | null;
}

function FlyTo({ target }: FlyToProps) {
  const map = useMap();

  useEffect(() => {
    if (target) {
      map.flyTo(target, 16, { duration: 1.4 });
    }
  }, [target, map]);

  return null;
}

interface MapClickHandlerProps {
  onMapClick: (lat: number, lng: number) => void;
}

function MapClickHandler({ onMapClick }: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

interface SearchBoxProps {
  inputClass: string;
  dropdownClass: string;
  query: string;
  suggestions: NominatimResult[];
  loading: boolean;
  showDrop: boolean;
  onInput: (value: string) => void;
  onSelect: (result: NominatimResult) => void;
  onClear: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

function SearchBox({
  inputClass,
  dropdownClass,
  query,
  suggestions,
  loading,
  showDrop,
  onInput,
  onSelect,
  onClear,
  onFocus,
  onBlur,
}: SearchBoxProps) {
  return (
    <div className="relative w-full">
      <Search
        size={13}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] z-10 pointer-events-none"
      />

      <input
        type="text"
        value={query}
        placeholder="Search area... (e.g. Kayu Putih)"
        onChange={(e) => onInput(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        className={inputClass}
      />

      {loading && (
        <Loader2
          size={13}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] animate-spin"
        />
      )}

      {!loading && query && (
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            onClear();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
        >
          <X size={12} />
        </button>
      )}

      {showDrop &&
        (suggestions.length > 0 || (query.length >= 2 && !loading)) && (
          <div className={dropdownClass}>
            {suggestions.length === 0 && query.length >= 2 && !loading ? (
              <div className="px-4 py-3 text-[var(--text-muted)] text-xs text-center">
                Lokasi tidak ditemukan
              </div>
            ) : (
              suggestions.map((suggestion) => (
                <button
                  key={suggestion.place_id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSelect(suggestion);
                  }}
                  className="w-full flex items-start gap-2.5 px-4 py-2.5 hover:bg-[var(--accent-soft)] transition-colors text-left"
                >
                  <MapPin
                    size={12}
                    className="text-[var(--accent)] shrink-0 mt-0.5"
                  />

                  <span className="text-[var(--text-main)] text-xs leading-snug">
                    {formatDisplayName(suggestion.display_name)}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
    </div>
  );
}
