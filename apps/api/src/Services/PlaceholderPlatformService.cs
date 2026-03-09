using Ground.Api.Models;

namespace Ground.Api.Services;

public sealed class PlaceholderPlatformService
{
    public DashboardOverviewDto GetDashboardOverview()
    {
        return new DashboardOverviewDto(
            "Prototype operating view for idea generation and execution prep.",
            "Everything below is placeholder-backed so the UI can model the end-state product surface now.",
            [
                new("Coverage Universe", "148 names", "+12 this week", "positive"),
                new("Queued Analyses", "6 active", "2 running now", "neutral"),
                new("Risk Budget", "63% used", "-4% vs yesterday", "positive"),
                new("Alert Noise", "14 active", "3 need review", "warning")
            ],
            [
                new("US Session", "Open", "positive"),
                new("Pipeline", "Healthy", "positive"),
                new("Broker Sync", "Paper only", "warning"),
                new("Model Freshness", "< 15 min", "positive")
            ],
            [
                new("AAPL", "Apple Inc.", "$195.92", "+1.8%", "60.1M", "Earnings drift holding trend", "positive"),
                new("MSFT", "Microsoft Corp.", "$417.44", "+0.6%", "24.2M", "Cloud leadership breakout setup", "positive"),
                new("NVDA", "NVIDIA Corp.", "$882.15", "-0.9%", "42.8M", "Crowded long, watch reaction", "negative"),
                new("TSLA", "Tesla Inc.", "$182.37", "-2.3%", "91.4M", "High volatility event window", "negative")
            ],
            [
                new("job-101", "AAPL", "basic", "running", "2 min ago", "system"),
                new("job-102", "MSFT", "basic", "queued", "5 min ago", "research"),
                new("job-103", "NVDA", "basic", "completed", "9 min ago", "research")
            ],
            [
                new("AAPL", "Trend continuation", "High", "1D / 1W", "3 min ago"),
                new("MSFT", "Pullback buy candidate", "Medium", "4H / 1D", "8 min ago"),
                new("NVDA", "Position sizing caution", "High", "1D", "14 min ago")
            ],
            [
                new("alert-1", "Gap threshold breached", "TSLA", "Move > 2% intraday", "high", "Slack", "triggered"),
                new("alert-2", "Liquidity drop", "AAPL", "Volume below regime floor", "medium", "Email", "active"),
                new("alert-3", "Conviction downgrade", "NVDA", "Model score below 60", "medium", "In-app", "active")
            ],
            [
                new("evt-1", "Risk band tightened", "Portfolio net exposure moved from 0.48 to 0.41.", "5 min ago", "risk"),
                new("evt-2", "Paper trading sync", "Broker placeholder connection refreshed successfully.", "11 min ago", "system"),
                new("evt-3", "Research note added", "AAPL thesis updated with event-driven note.", "18 min ago", "analysis")
            ]);
    }

    public PortfolioOverviewDto GetPortfolioOverview()
    {
        return new PortfolioOverviewDto(
            "$1.42M",
            "$318K",
            "+$12.4K",
            "118%",
            "42%",
            [
                new("Large Cap Growth", "44%"),
                new("Index Hedges", "18%"),
                new("Cash", "22%"),
                new("Event Book", "16%")
            ],
            [
                new("AAPL", "Apple Inc.", "12.4%", "$176K", "+$14.2K", "Core compounder with stable revisions", "low"),
                new("MSFT", "Microsoft Corp.", "11.2%", "$159K", "+$8.7K", "Quality long anchored by AI infra demand", "low"),
                new("NVDA", "NVIDIA Corp.", "7.5%", "$106K", "-$4.3K", "Tactical size only due to crowding", "high"),
                new("SPY", "SPDR S&P 500 ETF", "18.0%", "$256K", "+$2.1K", "Index sleeve and liquidity reserve", "medium")
            ],
            [
                new("Max single-name", "15%", "positive"),
                new("Daily VAR", "Within limit", "positive"),
                new("Event concentration", "Needs review", "warning")
            ]);
    }

    public AnalysisWorkspaceDto GetAnalysisWorkspace()
    {
        return new AnalysisWorkspaceDto(
            [
                new("Signal Model", "Ready", "positive"),
                new("Feature Store", "Stale by 8 min", "warning"),
                new("Ranking Pipeline", "Healthy", "positive"),
                new("Research Queue", "Backlogged", "warning")
            ],
            [
                new("job-104", "AMZN", "basic", "queued", "1 min ago", "research"),
                new("job-105", "META", "basic", "running", "4 min ago", "research"),
                new("job-106", "QQQ", "basic", "queued", "7 min ago", "system")
            ],
            [
                new("META", "Momentum rebuild", "Medium", "4H", "6 min ago"),
                new("QQQ", "Index trend check", "Low", "1D", "13 min ago"),
                new("AMZN", "Post-event digestion", "Medium", "1D", "21 min ago")
            ],
            [
                new("tmpl-1", "Trend continuation", "Default swing-trend template for liquid large caps.", "Research", "ready"),
                new("tmpl-2", "Event reaction", "Short-horizon checklist around earnings or macro catalysts.", "Risk", "ready"),
                new("tmpl-3", "Mean reversion", "Counter-trend template under review.", "Research", "draft")
            ],
            [
                "Model outputs are placeholders until ranking logic is wired to real factors.",
                "Queue orchestration is real; job metadata and model commentary are mocked.",
                "Research notes panel exists to anchor the final analyst workflow."
            ]);
    }

    public AlertsOverviewDto GetAlertsOverview()
    {
        return new AlertsOverviewDto(
            [
                new("alert-10", "Breakout confirmation", "MSFT", "Close above 420 with volume confirmation", "medium", "Slack", "active"),
                new("alert-11", "Risk unwind", "NVDA", "Close below 870", "high", "PagerDuty", "active"),
                new("alert-12", "Index hedge refresh", "SPY", "Volatility regime shift", "medium", "Email", "muted")
            ],
            [
                new("trigger-1", "TSLA alert triggered", "Gap threshold fired and routed to Slack.", "9 min ago", "system"),
                new("trigger-2", "NVDA warning escalated", "Escalation path sent to the risk channel.", "27 min ago", "risk")
            ],
            [
                new("Slack", "#ground-alerts", "connected"),
                new("Email", "ops@ground.local", "connected"),
                new("PagerDuty", "risk-primary", "pending")
            ]);
    }

    public SettingsOverviewDto GetSettingsOverview()
    {
        return new SettingsOverviewDto(
            [
                new("Workspace mode", "Controls default layout, watchlist density, and research context.", "Prototype"),
                new("Default analysis template", "Used when analysts launch ad hoc runs from the UI.", "Trend continuation"),
                new("Risk review cadence", "Defines when daily limits must be acknowledged.", "08:30 ET")
            ],
            [
                new("Alpaca Market Data", "Primary upstream market data adapter.", "Configured"),
                new("Paper Trading", "Execution layer still placeholder-backed in the UI.", "Planned"),
                new("Notifications", "Slack and email channels for alerts and ops summaries.", "Partially configured")
            ],
            [
                new("JWT middleware", "Current auth is non-blocking placeholder middleware.", "Prototype"),
                new("Role model", "Analyst, PM, and ops roles will be modeled later.", "Planned"),
                new("Audit trail", "Activity feed exists, durable audit storage does not.", "In progress")
            ]);
    }

    public SymbolWorkspaceDto GetSymbolWorkspace(string symbol)
    {
        var normalized = symbol.ToUpperInvariant();

        return new SymbolWorkspaceDto(
            normalized,
            normalized switch
            {
                "AAPL" => "Apple Inc.",
                "MSFT" => "Microsoft Corp.",
                "NVDA" => "NVIDIA Corp.",
                "TSLA" => "Tesla Inc.",
                _ => $"{normalized} Holdings"
            },
            normalized switch
            {
                "AAPL" => "Technology Hardware",
                "MSFT" => "Software",
                "NVDA" => "Semiconductors",
                "TSLA" => "Automotive",
                _ => "Multi-sector"
            },
            normalized switch
            {
                "AAPL" => "$195.92",
                "MSFT" => "$417.44",
                "NVDA" => "$882.15",
                "TSLA" => "$182.37",
                _ => "$101.00"
            },
            normalized switch
            {
                "AAPL" => "+1.8%",
                "MSFT" => "+0.6%",
                "NVDA" => "-0.9%",
                "TSLA" => "-2.3%",
                _ => "+0.2%"
            },
            normalized switch
            {
                "AAPL" => "Constructive above 20D trend",
                "MSFT" => "Leadership trend intact",
                "NVDA" => "Momentum cooling after extension",
                "TSLA" => "Volatile and event-sensitive",
                _ => "Neutral until refreshed"
            },
            [
                new("Composite score", "78 / 100", "Placeholder factor score for the final ranking engine.", "positive"),
                new("Position quality", "Medium risk", "Useful for execution sizing and guardrail checks.", "neutral"),
                new("Event pressure", "Elevated", "Model will eventually merge catalyst and options context.", "negative")
            ],
            [
                new("Base case", "Trend remains intact while revision pressure and liquidity stay supportive."),
                new("What changes the view", "Break of key support, weakening breadth, or a lower-conviction post-event setup."),
                new("Execution note", "Use staged entries and avoid full-size commitment before confirmation.")
            ],
            [
                "Confirm catalyst path",
                "Check liquidity regime",
                "Review portfolio overlap",
                "Verify risk limit capacity"
            ],
            [
                new("Related basket", "Large-cap momentum", "positive"),
                new("Cross-asset signal", "Rates sensitivity elevated", "warning"),
                new("Alert state", "One active trigger", "neutral")
            ]);
    }
}
