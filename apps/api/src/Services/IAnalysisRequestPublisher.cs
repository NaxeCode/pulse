using Ground.Api.Models;

namespace Ground.Api.Services;

public interface IAnalysisRequestPublisher
{
    Task<bool> EnqueueAsync(string queueName, RunAnalysisRequest request, CancellationToken cancellationToken = default);
}
