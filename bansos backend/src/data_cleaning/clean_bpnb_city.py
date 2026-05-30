import pandas as pd


RAW_PATH = "datasource/raw/DatasetBNPB.xlsx"
CLEAN_PATH = "datasource/clean/bnpb_clean.csv"
CITY_FEATURE_PATH = "datasource/processed/bnpb_city_features.csv"


def normalize_city_name(city: str) -> str:
    city = str(city).upper().strip()

    mapping = {
        "KOTA JAKARTA BARAT": "JAKARTA BARAT",
        "KOTA JAKARTA PUSAT": "JAKARTA PUSAT",
        "KOTA JAKARTA SELATAN": "JAKARTA SELATAN",
        "KOTA JAKARTA TIMUR": "JAKARTA TIMUR",
        "KOTA JAKARTA UTARA": "JAKARTA UTARA",
        "KAB. KEPULAUAN SERIBU": "KEPULAUAN SERIBU",
        "KABUPATEN KEPULAUAN SERIBU": "KEPULAUAN SERIBU",
    }

    return mapping.get(city, city)


def clean_bnpb():
    df = pd.read_excel(RAW_PATH)

    drop_cols = [
        "No.",
        "Kode Identitas Bencana",
        "Kronologi & Dokumentasi"
    ]

    df = df.drop(columns=[col for col in drop_cols if col in df.columns])

    numeric_cols = [
        "Meninggal",
        "Hilang",
        "Terluka",
        "Rumah Rusak",
        "Rumah Terendam",
        "Fasum Rusak"
    ]

    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

    df["Tanggal Kejadian"] = pd.to_datetime(df["Tanggal Kejadian"], errors="coerce")

    df["Kejadian"] = df["Kejadian"].astype(str).str.upper().str.strip()
    df["Lokasi"] = df["Lokasi"].fillna("UNKNOWN").astype(str).str.upper().str.strip()
    df["Kabupaten"] = df["Kabupaten"].astype(str).str.upper().str.strip()
    df["Provinsi"] = df["Provinsi"].astype(str).str.upper().str.strip()
    df["Penyebab"] = df["Penyebab"].fillna("UNKNOWN").astype(str).str.upper().str.strip()

    df["city"] = df["Kabupaten"].apply(normalize_city_name)

    df = df.drop_duplicates()

    df["severity_score"] = (
        df["Meninggal"] * 10 +
        df["Hilang"] * 8 +
        df["Terluka"] * 5 +
        df["Rumah Rusak"] * 2 +
        df["Rumah Terendam"] * 1 +
        df["Fasum Rusak"] * 3
    )

    df["year"] = df["Tanggal Kejadian"].dt.year
    df["month"] = df["Tanggal Kejadian"].dt.month

    df.to_csv(CLEAN_PATH, index=False)

    return df


def build_city_features(df):
    city_features = (
        df.groupby("city")
        .agg(
            historical_flood_count=("Kejadian", "count"),
            avg_severity_score=("severity_score", "mean"),
            max_severity_score=("severity_score", "max"),
            total_houses_flooded=("Rumah Terendam", "sum"),
            total_public_facilities_damaged=("Fasum Rusak", "sum"),
            last_flood_date=("Tanggal Kejadian", "max"),
        )
        .reset_index()
    )

    max_count = city_features["historical_flood_count"].max()
    max_avg_severity = city_features["avg_severity_score"].max()

    city_features["flood_frequency_score"] = (
        city_features["historical_flood_count"] / max_count
        if max_count != 0 else 0
    )

    city_features["severity_score_norm"] = (
        city_features["avg_severity_score"] / max_avg_severity
        if max_avg_severity != 0 else 0
    )

    city_features["historical_score"] = (
        0.6 * city_features["flood_frequency_score"] +
        0.4 * city_features["severity_score_norm"]
    )

    city_features.to_csv(CITY_FEATURE_PATH, index=False)

    return city_features


def main():
    df = clean_bnpb()
    city_features = build_city_features(df)

    print("=== BNPB CLEANED ===")
    print(df.head())
    print(df.shape)

    print("\n=== CITY FEATURES ===")
    print(city_features)
    print(city_features.shape)


if __name__ == "__main__":
    main()