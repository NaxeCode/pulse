import os
from dataclasses import dataclass


@dataclass(frozen=True)
class WorkerConfig:
    postgres_host: str = os.getenv("POSTGRES_HOST", "postgres")
    postgres_port: int = int(os.getenv("POSTGRES_PORT", "5432"))
    postgres_db: str = os.getenv("POSTGRES_DB", "ground")
    postgres_user: str = os.getenv("POSTGRES_USER", "ground_user")
    postgres_password: str = os.getenv("POSTGRES_PASSWORD", "ground_pass")

    redis_host: str = os.getenv("REDIS_HOST", "redis")
    redis_port: int = int(os.getenv("REDIS_PORT", "6379"))
    queue_name: str = os.getenv("ANALYSIS_QUEUE_NAME", "analysis_jobs")

    alpaca_api_key: str = os.getenv("ALPACA_API_KEY", "")
    alpaca_secret_key: str = os.getenv("ALPACA_SECRET_KEY", "")
    alpaca_base_url: str = os.getenv("ALPACA_BASE_URL", "https://data.alpaca.markets/v2")
