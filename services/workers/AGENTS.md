# AGENTS.md (services/workers)

Python worker (`main.py`) that runs a `BRPOP` loop on the Redis list `ANALYSIS_QUEUE_NAME` and computes RSI/SMA with pandas (`analysis/`). It backfills candles from Alpaca (`market_data/alpaca_client.py`) and writes to Postgres (`storage.py`). Config comes from env in `config.py`, and dependencies are in `requirements.txt`.

## Code Review Rules

### Always flag (P0/P1)

- **Worker loop dies.** One bad job must not kill `main()`. Keep the per-iteration `try/except`, log the failure, and back off. Flag exceptions that escape the loop, or `sys.exit` or raise in `process_job` paths that would stop the consumer.
- **Non-idempotent candle writes.** `upsert_candles` must keep `ON CONFLICT (symbol, ts) DO UPDATE`. Flag plain inserts into `market_candles` or a changed conflict target.
- **Untrusted payload use.** The job payload is external input. Flag a `symbol` interpolated into the Alpaca URL (`/stocks/{symbol}/bars`) or into SQL without normalization and validation. Also flag new payload fields used without defaults or type checks. Malformed JSON must be skipped, not retried forever.
- **Unbounded external calls.** Every `requests` call to Alpaca must set a `timeout` (currently 20s) and call `raise_for_status()`. Flag Alpaca keys that get logged.

### Flag when relevant

- Indicator math in `analysis/indicators.py` that changes RSI or SMA window semantics, or that returns NaN instead of `None` to the DB.
- Opening a new DB connection per candle or per row inside loops. Batch with `execute_values`.
- A reliable-queue change (such as `BLMOVE` to a processing list) without an ack/requeue path and duplicate-safe processing.

### Don't flag

- A job lost when the worker crashes mid-run. This is a documented limitation.
- `noqa: BLE001` on the loop's broad `except`. It is intentional.
