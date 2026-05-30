import requests
import pandas as pd


def fetch_bmkg_forecast(adm4_code):
    url = f"https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4={adm4_code}"
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    return response.json()


def extract_forecasts(data):
    rows = []

    def recurse(obj):
        if isinstance(obj, dict):
            if "local_datetime" in obj:
                rows.append({
                    "local_datetime": obj.get("local_datetime"),
                    "temperature": obj.get("t"),
                    "humidity": obj.get("hu"),
                    "weather_desc": obj.get("weather_desc"),
                    "weather_desc_en": obj.get("weather_desc_en"),
                    "wind_speed": obj.get("ws"),
                    "cloud_cover": obj.get("tcc"),
                })

            for value in obj.values():
                recurse(value)

        elif isinstance(obj, list):
            for item in obj:
                recurse(item)

    recurse(data)
    return pd.DataFrame(rows)


def weather_to_rain_score(desc):
    desc = str(desc).lower()

    if "thunder" in desc or "storm" in desc or "hujan petir" in desc:
        return 1.0
    elif "heavy rain" in desc or "hujan lebat" in desc:
        return 0.9
    elif "moderate rain" in desc or "hujan sedang" in desc:
        return 0.7
    elif "light rain" in desc or "hujan ringan" in desc:
        return 0.5
    elif "rain" in desc or "hujan" in desc:
        return 0.6
    elif "cloud" in desc or "berawan" in desc:
        return 0.25
    else:
        return 0.0


def humidity_to_score(humidity):
    if pd.isna(humidity):
        return 0.0

    if humidity >= 90:
        return 0.8
    elif humidity >= 80:
        return 0.6
    elif humidity >= 70:
        return 0.4
    else:
        return 0.2


def cloud_to_score(cloud_cover):
    if pd.isna(cloud_cover):
        return 0.0

    return min(float(cloud_cover) / 100, 1.0)


def calculate_weather_score(df):
    df["local_datetime"] = pd.to_datetime(df["local_datetime"], errors="coerce")

    numeric_cols = ["temperature", "humidity", "wind_speed", "cloud_cover"]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    df = df.sort_values("local_datetime").reset_index(drop=True)

    # pakai English kalau ada, fallback ke Indo
    df["weather_text"] = df["weather_desc_en"].fillna(df["weather_desc"])

    df["rain_score"] = df["weather_text"].apply(weather_to_rain_score)
    df["humidity_score"] = df["humidity"].apply(humidity_to_score)
    df["cloud_score"] = df["cloud_cover"].apply(cloud_to_score)

    total_slots = len(df)
    rainy_slots = (df["rain_score"] >= 0.5).sum()

    duration_score = rainy_slots / total_slots if total_slots > 0 else 0

    rain_intensity_score = df["rain_score"].max()
    avg_humidity_score = df["humidity_score"].mean()
    avg_cloud_score = df["cloud_score"].mean()

    weather_score = (
        0.50 * rain_intensity_score +
        0.30 * duration_score +
        0.15 * avg_humidity_score +
        0.05 * avg_cloud_score
    )

    weather_score = min(max(weather_score, 0), 1)

    return {
        "weather_score": weather_score,
        "rain_intensity_score": rain_intensity_score,
        "duration_score": duration_score,
        "avg_humidity_score": avg_humidity_score,
        "avg_cloud_score": avg_cloud_score,
        "rainy_slots": int(rainy_slots),
        "total_slots": int(total_slots),
        "forecast_start": str(df["local_datetime"].min()),
        "forecast_end": str(df["local_datetime"].max()),
    }


def get_weather_score(adm4_code):
    raw_data = fetch_bmkg_forecast(adm4_code)
    df = extract_forecasts(raw_data)

    if df.empty:
        raise ValueError("BMKG forecast data is empty.")

    result = calculate_weather_score(df)
    return result


if __name__ == "__main__":
    # contoh: Kemayoran
    adm4_code = "31.71.03.1001"

    result = get_weather_score(adm4_code)

    print("=== BMKG WEATHER SCORE ===")
    for key, value in result.items():
        print(f"{key}: {value}")