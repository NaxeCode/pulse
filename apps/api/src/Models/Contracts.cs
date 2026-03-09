namespace Ground.Api.Models;

public sealed record SymbolDto(
    string Ticker,
    string Name,
    string? Sector = null,
    string? Trend = null);

public sealed record CandleDto(
    string Symbol,
    DateTimeOffset Timestamp,
    decimal Open,
    decimal High,
    decimal Low,
    decimal Close,
    long Volume);

public sealed record RunAnalysisRequest(string Symbol, string AnalysisType = "basic");

public sealed record RunAnalysisResponse(string Status, string Queue);

public sealed record KeyMetricDto(string Label, string Value, string Delta, string Tone);

public sealed record StatusItemDto(string Label, string Value, string Tone);

public sealed record QueueJobDto(
    string Id,
    string Symbol,
    string AnalysisType,
    string Status,
    string SubmittedAt,
    string Owner);

public sealed record AnalysisRunSummaryDto(
    string Symbol,
    string Setup,
    string Conviction,
    string Timeframe,
    string UpdatedAt);

public sealed record AlertItemDto(
    string Id,
    string Title,
    string Symbol,
    string Condition,
    string Severity,
    string Channel,
    string Status);

public sealed record ActivityItemDto(
    string Id,
    string Title,
    string Detail,
    string Timestamp,
    string Category);

public sealed record WatchlistItemDto(
    string Ticker,
    string Name,
    string Price,
    string Move,
    string VolumeLabel,
    string Signal,
    string Tone);

public sealed record DashboardOverviewDto(
    string Headline,
    string Subheadline,
    IReadOnlyList<KeyMetricDto> Metrics,
    IReadOnlyList<StatusItemDto> MarketStatus,
    IReadOnlyList<WatchlistItemDto> Watchlist,
    IReadOnlyList<QueueJobDto> Queue,
    IReadOnlyList<AnalysisRunSummaryDto> RecentAnalyses,
    IReadOnlyList<AlertItemDto> Alerts,
    IReadOnlyList<ActivityItemDto> Activity);

public sealed record PortfolioHoldingDto(
    string Symbol,
    string Name,
    string Weight,
    string Exposure,
    string Pnl,
    string Thesis,
    string Risk);

public sealed record AllocationSliceDto(string Label, string Value);

public sealed record PortfolioOverviewDto(
    string AccountValue,
    string BuyingPower,
    string DailyPnl,
    string GrossExposure,
    string NetExposure,
    IReadOnlyList<AllocationSliceDto> Allocation,
    IReadOnlyList<PortfolioHoldingDto> Holdings,
    IReadOnlyList<StatusItemDto> Guardrails);

public sealed record AnalysisTemplateDto(
    string Id,
    string Name,
    string Description,
    string Owner,
    string Status);

public sealed record AnalysisWorkspaceDto(
    IReadOnlyList<StatusItemDto> ModelStatus,
    IReadOnlyList<QueueJobDto> QueuedJobs,
    IReadOnlyList<AnalysisRunSummaryDto> CompletedRuns,
    IReadOnlyList<AnalysisTemplateDto> Templates,
    IReadOnlyList<string> Notes);

public sealed record AlertChannelDto(string Label, string Destination, string Status);

public sealed record AlertsOverviewDto(
    IReadOnlyList<AlertItemDto> Rules,
    IReadOnlyList<ActivityItemDto> RecentTriggers,
    IReadOnlyList<AlertChannelDto> Channels);

public sealed record SettingsSectionDto(string Title, string Description, string State);

public sealed record SettingsOverviewDto(
    IReadOnlyList<SettingsSectionDto> Workspace,
    IReadOnlyList<SettingsSectionDto> Integrations,
    IReadOnlyList<SettingsSectionDto> Security);

public sealed record InsightCardDto(string Title, string Value, string Detail, string Tone);

public sealed record ThesisBlockDto(string Title, string Body);

public sealed record SymbolWorkspaceDto(
    string Symbol,
    string CompanyName,
    string Sector,
    string Price,
    string Move,
    string Trend,
    IReadOnlyList<InsightCardDto> Insights,
    IReadOnlyList<ThesisBlockDto> Thesis,
    IReadOnlyList<string> ExecutionChecklist,
    IReadOnlyList<StatusItemDto> RelatedSignals);
