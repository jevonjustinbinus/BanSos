import requests
import pandas as pd
import xml.etree.ElementTree as ET
from math import radians, sin, cos, sqrt, atan2


XML_URL = "https://poskobanjir.dsdadki.web.id/xmldata.xml"

# Data tinggi muka air biasanya tidak selalu update per menit.
# 24 jam lebih aman untuk aplikasi decision-support,
# supaya tidak false warning ketika beberapa pos air update lebih lambat.
DEFAULT_MAX_AGE_HOURS = 24


def haversine_distance_km(lat1, lon1, lat2, lon2):
    r = 6371

    lat1, lon1, lat2, lon2 = map(
        radians,
        [lat1, lon1, lat2, lon2]
    )

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        sin(dlat / 2) ** 2
        + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    )

    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return r * c


def fetch_xml_data():
    response = requests.get(
        XML_URL,
        timeout=30,
        headers={
            "User-Agent": "BanSos-App/1.0",
            "Accept": "application/xml,text/xml,*/*",
        },
    )
    response.raise_for_status()
    return response.text


def parse_water_stations(xml_text):
    root = ET.fromstring(xml_text)

    rows = []

    for item in root.findall(".//SP_GET_LAST_STATUS_PINTU_AIR"):
        row = {}

        for child in item:
            row[child.tag] = child.text

        rows.append(row)

    df = pd.DataFrame(rows)

    if df.empty:
        raise ValueError("No water station data found in XML.")

    return df


def parse_jakarta_datetime(series):
    """
    Parse tanggal dari API Posko Banjir DKI.

    Kenapa tidak pakai pd.to_datetime biasa?
    Karena format Indonesia sering DD/MM/YYYY atau DD-MM-YYYY.
    Tanpa dayfirst=True, pandas bisa salah baca tanggal.
    """
    parsed = pd.to_datetime(
        series,
        errors="coerce",
        dayfirst=True,
    )

    return parsed


def clean_water_station_df(df):
    rename_map = {
        "ID_PINTU_AIR": "station_id",
        "KODE_STASIUN": "station_code",
        "NAMA_PINTU_AIR": "station_name",
        "LOKASI": "location",
        "LATITUDE": "latitude",
        "LONGITUDE": "longitude",
        "TINGGI_AIR": "water_level",
        "TINGGI_AIR_SEBELUMNYA": "previous_water_level",
        "STATUS_SIAGA": "alert_status",
        "TANGGAL": "timestamp",
        "LAST_UPDATED_DATE": "last_updated",
    }

    df = df.rename(columns=rename_map)

    numeric_cols = [
        "latitude",
        "longitude",
        "water_level",
        "previous_water_level",
    ]

    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    text_cols = [
        "station_id",
        "station_code",
        "station_name",
        "location",
        "alert_status",
    ]

    for col in text_cols:
        if col in df.columns:
            df[col] = df[col].fillna("UNKNOWN").astype(str).str.upper().str.strip()

    if "timestamp" in df.columns:
        df["timestamp"] = parse_jakarta_datetime(df["timestamp"])

    if "last_updated" in df.columns:
        df["last_updated"] = parse_jakarta_datetime(df["last_updated"])

    df = df.dropna(subset=["latitude", "longitude"])

    return df


def alert_status_to_score(status):
    status = str(status).upper().strip()

    if "SIAGA 1" in status or "BAHAYA" in status:
        return 1.0
    elif "SIAGA 2" in status:
        return 0.8
    elif "SIAGA 3" in status or "WASPADA" in status:
        return 0.6
    elif "NORMAL" in status or "AMAN" in status:
        return 0.2
    else:
        return 0.0


def calculate_water_level_trend(row):
    current = row.get("water_level", None)
    previous = row.get("previous_water_level", None)

    if pd.isna(current) or pd.isna(previous):
        return "UNKNOWN"

    diff = float(current) - float(previous)

    if diff > 0:
        return "RISING"
    elif diff < 0:
        return "DECREASING"
    else:
        return "STABLE"


def calculate_water_score(row):
    alert_score = alert_status_to_score(row.get("alert_status"))
    trend = calculate_water_level_trend(row)

    if trend == "RISING":
        trend_score = 0.2
    elif trend == "STABLE":
        trend_score = 0.1
    elif trend == "DECREASING":
        trend_score = 0.0
    else:
        trend_score = 0.0

    water_score = min(alert_score + trend_score, 1.0)

    return float(water_score)


def choose_freshness_datetime(row):
    """
    Pakai waktu paling baru antara:
    - timestamp / TANGGAL
    - last_updated / LAST_UPDATED_DATE

    Sebelumnya sistem hanya pakai last_updated.
    Itu bisa bikin false outdated kalau TANGGAL masih update,
    tapi LAST_UPDATED_DATE tidak sinkron.
    """
    timestamp = row.get("timestamp")
    last_updated = row.get("last_updated")

    candidates = []

    if not pd.isna(timestamp):
        candidates.append(timestamp)

    if not pd.isna(last_updated):
        candidates.append(last_updated)

    if not candidates:
        return None

    return max(candidates)


def check_data_freshness(reference_time, max_age_hours=DEFAULT_MAX_AGE_HOURS):
    if reference_time is None or pd.isna(reference_time):
        return {
            "is_fresh": False,
            "age_hours": None,
            "warning": "Water station timestamp is missing.",
        }

    now = pd.Timestamp.now(tz="Asia/Jakarta")

    if reference_time.tzinfo is None:
        reference_time = reference_time.tz_localize("Asia/Jakarta")
    else:
        reference_time = reference_time.tz_convert("Asia/Jakarta")

    age_hours = (now - reference_time).total_seconds() / 3600

    # Kalau server/API memberi timestamp sedikit di masa depan,
    # jangan dianggap error. Anggap fresh.
    if age_hours < 0:
        age_hours = 0

    is_fresh = age_hours <= max_age_hours

    return {
        "is_fresh": bool(is_fresh),
        "age_hours": float(round(age_hours, 2)),
        "warning": None if is_fresh else "Water station data is outdated.",
    }


def find_nearest_water_station(user_lat, user_lng, max_age_hours=DEFAULT_MAX_AGE_HOURS):
    xml_text = fetch_xml_data()
    raw_df = parse_water_stations(xml_text)
    df = clean_water_station_df(raw_df)

    if df.empty:
        raise ValueError("No valid water station with coordinates found.")

    df["distance_km"] = df.apply(
        lambda row: haversine_distance_km(
            user_lat,
            user_lng,
            row["latitude"],
            row["longitude"],
        ),
        axis=1,
    )

    nearest = df.sort_values("distance_km").iloc[0]

    raw_water_score = calculate_water_score(nearest)

    freshness_reference_time = choose_freshness_datetime(nearest)

    freshness = check_data_freshness(
        freshness_reference_time,
        max_age_hours=max_age_hours,
    )

    adjusted_water_score = raw_water_score

    # Jangan potong score terlalu agresif.
    # Kalau data benar-benar stale, cukup turunkan 20%,
    # bukan 50%, supaya risk analysis tidak terlalu bias.
    if not freshness["is_fresh"]:
        adjusted_water_score = raw_water_score * 0.8

    trend = calculate_water_level_trend(nearest)

    timestamp = nearest.get("timestamp")
    last_updated = nearest.get("last_updated")

    return {
        "station_id": str(nearest.get("station_id")),
        "station_name": str(nearest.get("station_name")),
        "location": str(nearest.get("location")),
        "latitude": float(nearest.get("latitude")),
        "longitude": float(nearest.get("longitude")),
        "water_level": float(nearest.get("water_level")) if not pd.isna(nearest.get("water_level")) else None,
        "previous_water_level": float(nearest.get("previous_water_level")) if not pd.isna(nearest.get("previous_water_level")) else None,
        "alert_status": str(nearest.get("alert_status")),
        "trend": trend,
        "distance_km": float(round(nearest.get("distance_km"), 4)),
        "raw_water_score": float(round(raw_water_score, 4)),
        "water_score": float(round(adjusted_water_score, 4)),
        "freshness": {
            **freshness,
            "source": "max(timestamp,last_updated)",
        },
        "timestamp": None if pd.isna(timestamp) else str(timestamp),
        "last_updated": None if pd.isna(last_updated) else str(last_updated),
    }


if __name__ == "__main__":
    test_lat = -6.200000
    test_lng = 106.816666

    result = find_nearest_water_station(test_lat, test_lng)
    print(result)