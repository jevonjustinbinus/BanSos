import pandas as pd

from src.risk_engine.geospatial_lookup import find_risk_polygon_by_latlng
from src.risk_engine.water_station_engine import find_nearest_water_station
from src.risk_engine.weather_engine import get_weather_score


STATIC_FEATURE_PATH = "datasource/processed/city_static_features.csv"


def normalize_city_name(city: str) -> str:
    city = str(city).upper().strip()
    city = city.replace("KOTA ADM. ", "")
    city = city.replace("KOTA ADMINISTRASI ", "")
    return city


def load_city_static_features():
    return pd.read_csv(STATIC_FEATURE_PATH)


def get_historical_score_by_city(city_name):
    city = normalize_city_name(city_name)
    df = load_city_static_features()

    df["city"] = df["city"].astype(str).str.upper().str.strip()

    matched = df[df["city"] == city]

    if matched.empty:
        return {
            "historical_score": 0.0,
            "static_risk_score": 0.0,
            "message": "City not found in static feature table."
        }

    row = matched.iloc[0]

    return {
        "historical_score": float(row.get("historical_score", 0.0)),
        "static_risk_score": float(row.get("static_risk_score", 0.0))
    }


def score_to_level(score):
    score = float(score)

    if score >= 0.67:
        return "HIGH"
    elif score >= 0.34:
        return "MEDIUM"
    else:
        return "LOW"


def determine_overall_trend(weather_result, water_result):
    weather_score = float(weather_result.get("weather_score", 0))
    water_trend = water_result.get("trend")

    if water_trend == "RISING" and weather_score >= 0.4:
        return "RISING"
    elif water_trend == "DECREASING" and weather_score < 0.4:
        return "DECREASING"
    else:
        return "STABLE"


def calculate_final_risk_score(
    weather_score,
    water_score,
    baseline_score,
    historical_score
):
    final_score = (
        0.35 * float(weather_score) +
        0.30 * float(water_score) +
        0.20 * float(baseline_score) +
        0.15 * float(historical_score)
    )

    return float(min(max(final_score, 0), 1))


def predict_flood_risk(lat, lng):
    geo_result = find_risk_polygon_by_latlng(lat, lng)
    adm4_code = geo_result.get("kode_kelurahan")
    weather_result = get_weather_score(adm4_code)

    if not geo_result.get("found"):
        return {
            "success": False,
            "message": geo_result.get("message")
        }

    city_name = geo_result.get("kota_administrasi")
    static_result = get_historical_score_by_city(city_name)

    weather_result = get_weather_score(adm4_code)
    water_result = find_nearest_water_station(lat, lng)

    final_score = calculate_final_risk_score(
        weather_score=weather_result["weather_score"],
        water_score=water_result["water_score"],
        baseline_score=geo_result["baseline_score"],
        historical_score=static_result["historical_score"]
    )

    return {
        "success": True,
        "location": {
            "lat": float(lat),
            "lng": float(lng),
            "kelurahan": geo_result.get("kelurahan"),
            "kecamatan": geo_result.get("kecamatan"),
            "kota_administrasi": geo_result.get("kota_administrasi"),
            "kode_kelurahan": geo_result.get("kode_kelurahan"),
            "kode_kecamatan": geo_result.get("kode_kecamatan")
        },
        "risk": {
            "final_score": float(round(final_score, 4)),
            "probability_percent": float(round(final_score * 100, 2)),
            "risk_level": score_to_level(final_score),
            "trend": determine_overall_trend(weather_result, water_result)
        },
        "components": {
            "weather_score": float(round(weather_result["weather_score"], 4)),
            "water_score": float(round(water_result["water_score"], 4)),
            "baseline_score": float(round(geo_result["baseline_score"], 4)),
            "historical_score": float(round(static_result["historical_score"], 4))
        },
        "details": {
            "weather": {
                key: (
                    float(value)
                    if isinstance(value, (int, float))
                    else value
                )
                for key, value in weather_result.items()
            },
            "water_station": water_result,
            "static": static_result
        },
        "disclaimer": (
            "This result is a decision-support risk indicator, not an official flood warning. "
            "Users should still follow official information from BMKG, BNPB, and local authorities."
        )
    }


if __name__ == "__main__":
    test_lat = -6.200000
    test_lng = 106.816666

    # sementara pakai ADM4 Kemayoran contoh BMKG

    result = predict_flood_risk(test_lat, test_lng)

    print("=== FINAL FLOOD RISK RESULT ===")
    print(result)