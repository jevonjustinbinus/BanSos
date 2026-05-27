import requests
import pandas as pd
import xml.etree.ElementTree as ET
from math import radians, sin, cos, sqrt, atan2


XML_URL = "https://poskobanjir.dsdadki.web.id/xmldata.xml"


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
    response = requests.get(XML_URL, timeout=30)
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
        "LAST_UPDATED_DATE": "last_updated"
    }

    df = df.rename(columns=rename_map)

    numeric_cols = [
        "latitude",
        "longitude",
        "water_level",
        "previous_water_level"
    ]

    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    text_cols = [
        "station_id",
        "station_code",
        "station_name",
        "location",
        "alert_status"
    ]

    for col in text_cols:
        if col in df.columns:
            df[col] = df[col].fillna("UNKNOWN").astype(str).str.upper().str.strip()

    if "timestamp" in df.columns:
        df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")

    if "last_updated" in df.columns:
        df["last_updated"] = pd.to_datetime(df["last_updated"], errors="coerce")

    df = df.dropna(subset=["latitude", "longitude"])

    return df


def alert_status_to_score(status):
    status = str(status).upper().strip()

    if "SIAGA 1" in status:
        return 1.0
    elif "SIAGA 2" in status:
        return 0.8
    elif "SIAGA 3" in status:
        return 0.6
    elif "NORMAL" in status:
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


def check_data_freshness(last_updated, max_age_hours=6):
    if pd.isna(last_updated):
        return {
            "is_fresh": False,
            "age_hours": None,
            "warning": "Water station last_updated is missing."
        }

    now = pd.Timestamp.now(tz="Asia/Jakarta")

    if last_updated.tzinfo is None:
        last_updated = last_updated.tz_localize("Asia/Jakarta")
    else:
        last_updated = last_updated.tz_convert("Asia/Jakarta")

    age_hours = (now - last_updated).total_seconds() / 3600

    is_fresh = age_hours <= max_age_hours

    return {
        "is_fresh": bool(is_fresh),
        "age_hours": float(round(age_hours, 2)),
        "warning": None if is_fresh else "Water station data is outdated."
    }


def find_nearest_water_station(user_lat, user_lng, max_age_hours=6):
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
            row["longitude"]
        ),
        axis=1
    )

    nearest = df.sort_values("distance_km").iloc[0]

    raw_water_score = calculate_water_score(nearest)
    freshness = check_data_freshness(
        nearest.get("last_updated"),
        max_age_hours=max_age_hours
    )

    adjusted_water_score = raw_water_score

    if not freshness["is_fresh"]:
        adjusted_water_score = raw_water_score * 0.5

    trend = calculate_water_level_trend(nearest)

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
        "freshness": freshness,
        "timestamp": str(nearest.get("timestamp")),
        "last_updated": str(nearest.get("last_updated"))
    }


if __name__ == "__main__":
    test_lat = -6.200000
    test_lng = 106.816666

    result = find_nearest_water_station(test_lat, test_lng)

    print("=== NEAREST WATER STATION ===")
    for key, value in result.items():
        print(f"{key}: {value}")