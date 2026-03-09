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
    PostgresConnectionString = builder.Configuration["POSTGRES_CONNECTION_STRING"]
        ?? "Host=postgres;Port=5432;Database=ground;Username=ground_user;Password=ground_pass",
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

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.MapSymbolEndpoints();
app.MapDashboardEndpoints();
app.MapPortfolioEndpoints();
app.MapAlertsEndpoints();
app.MapSettingsEndpoints();
app.MapCandleEndpoints();
app.MapAnalysisEndpoints();

app.Run();
