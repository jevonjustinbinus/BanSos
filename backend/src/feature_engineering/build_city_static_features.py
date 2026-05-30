import pandas as pd


BNPB_PATH = "datasource/processed/bnpb_city_features.csv"
JAKARTA_PATH = "datasource/processed/jakartasatu_city_features.csv"
OUTPUT_PATH = "datasource/processed/city_static_features.csv"


def main():
    bnpb = pd.read_csv(BNPB_PATH)
    jakarta = pd.read_csv(JAKARTA_PATH)

    df = jakarta.merge(
        bnpb,
        on="city",
        how="left"
    )

    fill_cols = [
        "historical_flood_count",
        "avg_severity_score",
        "max_severity_score",
        "total_houses_flooded",
        "total_public_facilities_damaged",
        "flood_frequency_score",
        "severity_score_norm",
        "historical_score"
    ]

    for col in fill_cols:
        if col in df.columns:
            df[col] = df[col].fillna(0)

    df["static_risk_score"] = (
        0.6 * df["baseline_score"] +
        0.4 * df["historical_score"]
    )

    df.to_csv(OUTPUT_PATH, index=False)

    print("=== CITY STATIC FEATURES ===")
    print(df)
    print(df.shape)


if __name__ == "__main__":
    main()