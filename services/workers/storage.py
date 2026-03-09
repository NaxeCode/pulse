import logging
from typing import Any

import pandas as pd
import psycopg2
import psycopg2.extras

from config import WorkerConfig

logger = logging.getLogger(__name__)


def get_connection(config: WorkerConfig):
    return psycopg2.connect(
        host=config.postgres_host,
        port=config.postgres_port,
        dbname=config.postgres_db,
        user=config.postgres_user,
        password=config.postgres_password,
    )


def fetch_candles(config: WorkerConfig, symbol: str, limit: int = 250) -> pd.DataFrame:
    query = """
    SELECT symbol, ts, open, high, low, close, volume
    FROM market_candles
    WHERE symbol = %s
    ORDER BY ts DESC
    LIMIT %s
    """

    with get_connection(config) as conn:
        with conn.cursor() as cur:
            cur.execute(query, (symbol.upper(), limit))
            rows = cur.fetchall()

    if not rows:
        return pd.DataFrame(columns=["symbol", "timestamp", "open", "high", "low", "close", "volume"])

    frame = pd.DataFrame(rows, columns=["symbol", "timestamp", "open", "high", "low", "close", "volume"])
    return frame.sort_values("timestamp")


def upsert_candles(config: WorkerConfig, symbol: str, candles: list[dict[str, Any]]) -> None:
    if not candles:
        return

    records = [
        (
            symbol.upper(),
            candle["timestamp"],
            candle["open"],
            candle["high"],
            candle["low"],
            candle["close"],
            candle["volume"],
        )
        for candle in candles
    ]

    statement = """
    INSERT INTO market_candles(symbol, ts, open, high, low, close, volume)
    VALUES %s
    ON CONFLICT(symbol, ts) DO UPDATE
      SET open = EXCLUDED.open,
          high = EXCLUDED.high,
          low = EXCLUDED.low,
          close = EXCLUDED.close,
          volume = EXCLUDED.volume
    """

    with get_connection(config) as conn:
        with conn.cursor() as cur:
            psycopg2.extras.execute_values(cur, statement, records)

    logger.info("Upserted %s candles for %s", len(records), symbol)


def write_analysis_result(config: WorkerConfig, symbol: str, analysis_type: str, metrics: dict[str, float]) -> None:
    statement = """
    INSERT INTO analysis_results(symbol, analysis_type, computed_at, rsi, sma_20, sma_50)
    VALUES (%s, %s, now(), %s, %s, %s)
    """

    with get_connection(config) as conn:
        with conn.cursor() as cur:
            cur.execute(
                statement,
                (
                    symbol.upper(),
                    analysis_type,
                    metrics.get("rsi"),
                    metrics.get("sma_20"),
                    metrics.get("sma_50"),
                ),
            )

    logger.info("Stored analysis result for %s", symbol)
