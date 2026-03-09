import json
import logging
import time

import redis

from analysis.runner import run_basic_analysis
from config import WorkerConfig
from market_data.alpaca_client import AlpacaClient
from storage import fetch_candles, upsert_candles, write_analysis_result

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger("ground-worker")


def process_job(config: WorkerConfig, alpaca: AlpacaClient, payload: str) -> None:
    job = json.loads(payload)
    symbol = job.get("symbol", "").upper()
    analysis_type = job.get("analysisType", "basic")

    if not symbol:
        logger.warning("Skipping job with empty symbol: %s", payload)
        return

    candles = fetch_candles(config, symbol)

    if candles.empty and alpaca.is_configured():
        logger.info("No local candles for %s. Fetching from Alpaca.", symbol)
        incoming = alpaca.fetch_historical_candles(symbol=symbol, limit=150)
        upsert_candles(config, symbol, incoming)
        candles = fetch_candles(config, symbol)

    metrics = run_basic_analysis(candles)
    write_analysis_result(config, symbol, analysis_type, metrics)

    logger.info("Analysis complete for %s with metrics=%s", symbol, metrics)


def main() -> None:
    config = WorkerConfig()
    alpaca = AlpacaClient(
        base_url=config.alpaca_base_url,
        api_key=config.alpaca_api_key,
        secret_key=config.alpaca_secret_key,
    )

    client = redis.Redis(host=config.redis_host, port=config.redis_port, decode_responses=True)
    logger.info("Worker started. Waiting on queue '%s'", config.queue_name)

    while True:
        try:
            message = client.brpop(config.queue_name, timeout=5)
            if message is None:
                continue

            _, payload = message
            process_job(config, alpaca, payload)
        except Exception as exc:  # noqa: BLE001
            logger.exception("Worker loop error: %s", exc)
            time.sleep(2)


if __name__ == "__main__":
    main()
