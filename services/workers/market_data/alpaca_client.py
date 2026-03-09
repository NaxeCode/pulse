from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import requests


@dataclass(frozen=True)
class AlpacaClient:
    base_url: str
    api_key: str
    secret_key: str

    @property
    def _headers(self) -> dict[str, str]:
        return {
            "APCA-API-KEY-ID": self.api_key,
            "APCA-API-SECRET-KEY": self.secret_key,
        }

    def is_configured(self) -> bool:
        return bool(self.api_key and self.secret_key)

    def fetch_historical_candles(self, symbol: str, timeframe: str = "1Day", limit: int = 100) -> list[dict[str, Any]]:
        if not self.is_configured():
            return []

        endpoint = f"{self.base_url}/stocks/{symbol}/bars"
        params = {"timeframe": timeframe, "limit": limit}

        response = requests.get(endpoint, params=params, headers=self._headers, timeout=20)
        response.raise_for_status()
        payload = response.json()

        bars = payload.get("bars", [])
        return [
            {
                "timestamp": bar["t"],
                "open": bar["o"],
                "high": bar["h"],
                "low": bar["l"],
                "close": bar["c"],
                "volume": bar["v"],
            }
            for bar in bars
        ]

    def fetch_latest_quote(self, symbol: str) -> dict[str, Any]:
        if not self.is_configured():
            return {}

        endpoint = f"{self.base_url}/stocks/{symbol}/quotes/latest"
        response = requests.get(endpoint, headers=self._headers, timeout=20)
        response.raise_for_status()
        payload = response.json()
        return payload.get("quote", {})
