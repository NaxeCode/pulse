namespace Ground.Api.Config;

public sealed class AppOptions
{
    public const string SectionName = "App";

    public string PostgresConnectionString { get; set; } = string.Empty;
    public string RedisConnectionString { get; set; } = string.Empty;
    public string QueueName { get; set; } = "analysis_jobs";
    public string AllowedOrigin { get; set; } = "http://localhost:3000";
    public string JwtIssuer { get; set; } = "ground";
    public string JwtAudience { get; set; } = "ground-clients";
    public string JwtSigningKey { get; set; } = "change-this-in-production";
}
