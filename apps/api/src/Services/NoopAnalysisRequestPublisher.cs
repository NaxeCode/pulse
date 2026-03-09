using Ground.Api.Models;

namespace Ground.Api.Services;

public sealed class NoopAnalysisRequestPublisher : IAnalysisRequestPublisher
{
    private readonly ILogger<NoopAnalysisRequestPublisher> _logger;

    public NoopAnalysisRequestPublisher(ILogger<NoopAnalysisRequestPublisher> logger)
    {
        _logger = logger;
    }

    public Task<bool> EnqueueAsync(string queueName, RunAnalysisRequest request, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation(
            "Analysis queue disabled; accepted request for {Symbol} without publishing to {Queue}",
            request.Symbol,
            queueName
        );
        return Task.FromResult(false);
    }
}
