using Ground.Api.Config;
using Ground.Api.Models;
using Ground.Api.Services;
using Microsoft.Extensions.Options;

namespace Ground.Api.Endpoints;

public static class AnalysisEndpoints
{
    public static RouteGroupBuilder MapAnalysisEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1/analysis").WithTags("Analysis");

        group.MapGet("", (PlaceholderPlatformService platform) =>
            Results.Ok(platform.GetAnalysisWorkspace()));

        group.MapPost("/run", async (
            RunAnalysisRequest request,
            IAnalysisRequestPublisher queuePublisher,
            IOptions<AppOptions> options,
            CancellationToken cancellationToken) =>
        {
            if (string.IsNullOrWhiteSpace(request.Symbol))
            {
                return Results.BadRequest(new { error = "symbol is required" });
            }

            var queueName = options.Value.QueueName;
            var queued = await queuePublisher.EnqueueAsync(queueName, request, cancellationToken);
            if (!queued)
            {
                return Results.Json(
                    new { error = "analysis queue is unavailable" },
                    statusCode: StatusCodes.Status503ServiceUnavailable);
            }

            return Results.Accepted(value: new RunAnalysisResponse("queued", queueName));
        });

        return group;
    }
}
