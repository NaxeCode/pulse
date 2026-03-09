CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE IF NOT EXISTS market_candles (
    symbol TEXT NOT NULL,
    ts TIMESTAMPTZ NOT NULL,
    open NUMERIC(18,6) NOT NULL,
    high NUMERIC(18,6) NOT NULL,
    low NUMERIC(18,6) NOT NULL,
    close NUMERIC(18,6) NOT NULL,
    volume BIGINT NOT NULL,
    PRIMARY KEY (symbol, ts)
);

SELECT create_hypertable('market_candles', 'ts', if_not_exists => TRUE);

CREATE TABLE IF NOT EXISTS analysis_results (
    id BIGSERIAL PRIMARY KEY,
    symbol TEXT NOT NULL,
    analysis_type TEXT NOT NULL,
    computed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    rsi NUMERIC(10,4),
    sma_20 NUMERIC(18,6),
    sma_50 NUMERIC(18,6)
);

INSERT INTO market_candles (symbol, ts, open, high, low, close, volume)
VALUES
('AAPL', now() - interval '3 day', 192.1, 194.0, 191.2, 193.6, 58120000),
('AAPL', now() - interval '2 day', 193.6, 195.2, 192.9, 194.8, 54210000),
('AAPL', now() - interval '1 day', 194.8, 196.4, 193.7, 195.9, 60143000),
('MSFT', now() - interval '3 day', 410.5, 414.2, 409.7, 412.8, 22100000),
('MSFT', now() - interval '2 day', 412.8, 416.1, 411.3, 415.2, 19870000),
('MSFT', now() - interval '1 day', 415.2, 418.5, 414.1, 417.9, 24590000)
ON CONFLICT DO NOTHING;
