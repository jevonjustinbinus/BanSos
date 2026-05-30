import pandas as pd


RAW_PATH = "datasource/raw/jakartasatu_resiko_banjir.csv"
CLEAN_PATH = "datasource/clean/jakartasatu_clean.csv"
CITY_FEATURE_PATH = "datasource/processed/jakartasatu_city_features.csv"


def normalize_city_name(city: str) -> str:
    city = str(city).upper().strip()

    city = city.replace("KOTA ADM. ", "")
    city = city.replace("KOTA ADMINISTRASI ", "")

    return city


def risk_to_score(risk_class: str) -> float:
    risk_class = str(risk_class).upper().strip()

    mapping = {
        "RINGAN": 0.3,
        "SEDANG": 0.6,
        "BERAT": 0.9,
    }

    return mapping.get(risk_class, 0.0)


def clean_jakartasatu():
    df = pd.read_csv(RAW_PATH)

    df = df.rename(columns={
        "WADMKD": "kelurahan",
        "WADMKC": "kecamatan",
        "WADMKK": "kota_administrasi",
        "KDEPUM": "kode_kelurahan",
        "KDCPUM": "kode_kecamatan",
        "KDPKAB": "kode_kota",
        "KELAS": "risk_class",
        "SHAPE.AREA": "shape_area",
        "SHAPE.LEN": "shape_len"
    })

    text_cols = [
        "kelurahan",
        "kecamatan",
        "kota_administrasi",
        "risk_class"
    ]

    for col in text_cols:
        df[col] = df[col].astype(str).str.upper().str.strip()

    df["city"] = df["kota_administrasi"].apply(normalize_city_name)
    df["baseline_score"] = df["risk_class"].apply(risk_to_score)

    df.to_csv(CLEAN_PATH, index=False)

    return df


def build_city_features(df):
    city_features = (
        df.groupby("city")
        .agg(
            avg_baseline_score=("baseline_score", "mean"),
            max_baseline_score=("baseline_score", "max"),
            total_polygon_area=("shape_area", "sum"),
            polygon_count=("risk_class", "count"),
        )
        .reset_index()
    )

    city_features = city_features.rename(columns={
        "avg_baseline_score": "baseline_score"
    })

    city_features.to_csv(CITY_FEATURE_PATH, index=False)

    return city_features


def main():
    df = clean_jakartasatu()
    city_features = build_city_features(df)

    print("=== JAKARTASATU CLEANED ===")
    print(df.head())
    print(df.shape)

    print("\n=== CITY BASELINE FEATURES ===")
    print(city_features)
    print(city_features.shape)


if __name__ == "__main__":
    main()