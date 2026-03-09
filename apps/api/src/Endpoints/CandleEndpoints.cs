using Ground.Api.Data;

namespace Ground.Api.Endpoints;

public static class CandleEndpoints
{
    public static RouteGroupBuilder MapCandleEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1").WithTags("Candles");

        group.MapGet("/candles/{symbol}", async (
            string symbol,
            CandleRepository repository,
            CancellationToken cancellationToken) =>
        {
            var candles = await repository.GetLatestCandlesAsync(symbol, cancellationToken: cancellationToken);
            return Results.Ok(candles);
        });

        return group;
    }
}
