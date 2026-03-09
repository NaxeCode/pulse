using Ground.Api.Config;
using Ground.Api.Data;
using Ground.Api.Endpoints;
using Ground.Api.Middleware;
using Ground.Api.Services;
using Npgsql;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();

builder.Logging.ClearProviders();
builder.Logging.AddJsonConsole();

var appOptions = new AppOptions
{
    PostgresConnectionString = NormalizePostgresConnectionString(
        builder.Configuration["POSTGRES_CONNECTION_STRING"]
            ?? "Host=postgres;Port=5432;Database=ground;Username=ground_user;Password=ground_pass"
    ),
    RedisConnectionString = builder.Configuration["REDIS_CONNECTION_STRING"] ?? string.Empty,
    AnalysisQueueEnabled = !bool.TryParse(builder.Configuration["ANALYSIS_QUEUE_ENABLED"], out var queueEnabled)
        || queueEnabled,
    QueueName = builder.Configuration["ANALYSIS_QUEUE_NAME"] ?? "analysis_jobs",
    AllowedOrigin = builder.Configuration["ALLOWED_ORIGIN"] ?? "http://localhost:3000",
    JwtIssuer = builder.Configuration["JWT_ISSUER"] ?? "ground",
    JwtAudience = builder.Configuration["JWT_AUDIENCE"] ?? "ground-clients",
    JwtSigningKey = builder.Configuration["JWT_SIGNING_KEY"] ?? "change-this-in-production"
};

builder.Services.AddSingleton(appOptions);
builder.Services.Configure<AppOptions>(opts =>
{
    opts.PostgresConnectionString = appOptions.PostgresConnectionString;
    opts.RedisConnectionString = appOptions.RedisConnectionString;
    opts.AnalysisQueueEnabled = appOptions.AnalysisQueueEnabled;
    opts.QueueName = appOptions.QueueName;
    opts.AllowedOrigin = appOptions.AllowedOrigin;
    opts.JwtIssuer = appOptions.JwtIssuer;
    opts.JwtAudience = appOptions.JwtAudience;
    opts.JwtSigningKey = appOptions.JwtSigningKey;
});

builder.Services.AddSingleton(_ =>
{
    var dataSourceBuilder = new NpgsqlDataSourceBuilder(appOptions.PostgresConnectionString);
    return dataSourceBuilder.Build();
});

builder.Services.AddScoped<CandleRepository>();
builder.Services.AddSingleton<PlaceholderPlatformService>();

if (appOptions.AnalysisQueueEnabled && !string.IsNullOrWhiteSpace(appOptions.RedisConnectionString))
{
    builder.Services.AddSingleton<IConnectionMultiplexer>(_ =>
        ConnectionMultiplexer.Connect(appOptions.RedisConnectionString));
    builder.Services.AddScoped<IAnalysisRequestPublisher, RedisQueuePublisher>();
}
else
{
    builder.Services.AddScoped<IAnalysisRequestPublisher, NoopAnalysisRequestPublisher>();
}

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("web", policy =>
    {
        policy
            .WithOrigins(appOptions.AllowedOrigin)
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("web");
app.UseMiddleware<PlaceholderJwtMiddleware>();

if (appOptions.AnalysisQueueEnabled && string.IsNullOrWhiteSpace(appOptions.RedisConnectionString))
{
    app.Logger.LogWarning(
        "ANALYSIS_QUEUE_ENABLED is true but REDIS_CONNECTION_STRING is missing. Running with no-op queue mode."
    );
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

await EnsureDatabaseInitializedAsync(appOptions.PostgresConnectionString, app.Logger);

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.MapSymbolEndpoints();
app.MapDashboardEndpoints();
app.MapPortfolioEndpoints();
app.MapAlertsEndpoints();
app.MapSettingsEndpoints();
app.MapCandleEndpoints();
app.MapAnalysisEndpoints();

app.Run();

static async Task EnsureDatabaseInitializedAsync(string connectionString, ILogger logger)
{
    try
    {
        await using var dataSource = new NpgsqlDataSourceBuilder(connectionString).Build();
        await using var connection = await dataSource.OpenConnectionAsync();

        await ExecuteNonQueryAsync(connection, "CREATE EXTENSION IF NOT EXISTS timescaledb;");

        await ExecuteNonQueryAsync(
            connection,
            """
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
            """
        );

        await ExecuteNonQueryAsync(
            connection,
            "SELECT create_hypertable('market_candles', 'ts', if_not_exists => TRUE);"
        );

        await ExecuteNonQueryAsync(
            connection,
            """
            CREATE TABLE IF NOT EXISTS analysis_results (
                id BIGSERIAL PRIMARY KEY,
                symbol TEXT NOT NULL,
                analysis_type TEXT NOT NULL,
                computed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                rsi NUMERIC(10,4),
                sma_20 NUMERIC(18,6),
                sma_50 NUMERIC(18,6)
            );
            """
        );

        await ExecuteNonQueryAsync(
            connection,
            """
            INSERT INTO market_candles (symbol, ts, open, high, low, close, volume)
            VALUES
            ('AAPL', now() - interval '3 day', 192.1, 194.0, 191.2, 193.6, 58120000),
            ('AAPL', now() - interval '2 day', 193.6, 195.2, 192.9, 194.8, 54210000),
            ('AAPL', now() - interval '1 day', 194.8, 196.4, 193.7, 195.9, 60143000),
            ('MSFT', now() - interval '3 day', 410.5, 414.2, 409.7, 412.8, 22100000),
            ('MSFT', now() - interval '2 day', 412.8, 416.1, 411.3, 415.2, 19870000),
            ('MSFT', now() - interval '1 day', 415.2, 418.5, 414.1, 417.9, 24590000)
            ON CONFLICT DO NOTHING;
            """
        );

        logger.LogInformation("Database schema and seed data initialized.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Database initialization failed. DB-backed endpoints may return errors.");
    }
}

static async Task ExecuteNonQueryAsync(NpgsqlConnection connection, string sql)
{
    await using var command = new NpgsqlCommand(sql, connection);
    await command.ExecuteNonQueryAsync();
}

static string NormalizePostgresConnectionString(string rawValue)
{
    if (string.IsNullOrWhiteSpace(rawValue))
    {
        return rawValue;
    }

    if (rawValue.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase)
        || rawValue.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
    {
        var uri = new Uri(rawValue);
        var userInfoParts = uri.UserInfo.Split(':', 2, StringSplitOptions.TrimEntries);
        var username = Uri.UnescapeDataString(userInfoParts[0]);
        var password = userInfoParts.Length > 1
            ? Uri.UnescapeDataString(userInfoParts[1])
            : string.Empty;
        var database = uri.AbsolutePath.TrimStart('/');

        var builder = new NpgsqlConnectionStringBuilder
        {
            Host = uri.Host,
            Port = uri.IsDefaultPort ? 5432 : uri.Port,
            Username = username,
            Password = password,
            Database = database
        };

        // Preserve SSL settings when present in URL params.
        var sslMode = GetQueryValue(uri.Query, "sslmode");
        if (!string.IsNullOrWhiteSpace(sslMode) && Enum.TryParse<SslMode>(sslMode, true, out var parsedSslMode))
        {
            builder.SslMode = parsedSslMode;
        }

        return builder.ConnectionString;
    }

    return rawValue;
}

static string? GetQueryValue(string query, string key)
{
    if (string.IsNullOrEmpty(query))
    {
        return null;
    }

    var trimmed = query.TrimStart('?');
    foreach (var segment in trimmed.Split('&', StringSplitOptions.RemoveEmptyEntries))
    {
        var parts = segment.Split('=', 2);
        if (parts.Length == 0)
        {
            continue;
        }

        if (!string.Equals(parts[0], key, StringComparison.OrdinalIgnoreCase))
        {
            continue;
        }

        if (parts.Length == 1)
        {
            return string.Empty;
        }

        return Uri.UnescapeDataString(parts[1]);
    }

    return null;
}
