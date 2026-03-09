using System.Text.Json;
using Ground.Api.Models;
using StackExchange.Redis;

namespace Ground.Api.Services;

public sealed class RedisQueuePublisher : IAnalysisRequestPublisher
{
    private readonly IConnectionMultiplexer _redis;
    private readonly ILogger<RedisQueuePublisher> _logger;

    public RedisQueuePublisher(IConnectionMultiplexer redis, ILogger<RedisQueuePublisher> logger)
    {
        _redis = redis;
        _logger = logger;
    }

    public async Task<bool> EnqueueAsync(string queueName, RunAnalysisRequest request, CancellationToken cancellationToken = default)
    {
        var payload = JsonSerializer.Serialize(new
        {
            symbol = request.Symbol.ToUpperInvariant(),
            analysisType = request.AnalysisType
        });

        await _redis.GetDatabase().ListLeftPushAsync(queueName, payload);
        _logger.LogInformation("Queued analysis request for {Symbol} on {Queue}", request.Symbol, queueName);
        return true;
    }
}
