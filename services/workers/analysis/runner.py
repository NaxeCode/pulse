from typing import Any

import pandas as pd

from analysis.indicators import calculate_rsi, moving_average


def run_basic_analysis(candles: pd.DataFrame) -> dict[str, Any]:
    if candles.empty:
        return {"rsi": None, "sma_20": None, "sma_50": None}

    closes = candles["close"].astype(float)
    candles = candles.copy()
    candles["rsi"] = calculate_rsi(closes)
    candles["sma_20"] = moving_average(closes, 20)
    candles["sma_50"] = moving_average(closes, 50)

    latest = candles.iloc[-1]
    return {
        "rsi": None if pd.isna(latest["rsi"]) else float(latest["rsi"]),
        "sma_20": None if pd.isna(latest["sma_20"]) else float(latest["sma_20"]),
        "sma_50": None if pd.isna(latest["sma_50"]) else float(latest["sma_50"]),
    }
