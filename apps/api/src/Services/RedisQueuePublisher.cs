using System.Text.Json;
using Ground.Api.Models;
using StackExchange.Redis;

namespace Ground.Api.Services;

public sealed class RedisQueuePublisher
{
    private readonly IConnectionMultiplexer _redis;
    private readonly ILogger<RedisQueuePublisher> _logger;

    public RedisQueuePublisher(IConnectionMultiplexer redis, ILogger<RedisQueuePublisher> logger)
    {
        _redis = redis;
        _logger = logger;
    }

    public async Task EnqueueAsync(string queueName, RunAnalysisRequest request)
    {
        var payload = JsonSerializer.Serialize(new
        {
            symbol = request.Symbol.ToUpperInvariant(),
            analysisType = request.AnalysisType
        });

        await _redis.GetDatabase().ListLeftPushAsync(queueName, payload);
        _logger.LogInformation("Queued analysis request for {Symbol} on {Queue}", request.Symbol, queueName);
    }
}
