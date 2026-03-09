using Ground.Api.Services;

namespace Ground.Api.Endpoints;

public static class PortfolioEndpoints
{
    public static RouteGroupBuilder MapPortfolioEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1").WithTags("Portfolio");

        group.MapGet("/portfolio", (PlaceholderPlatformService platform) =>
            Results.Ok(platform.GetPortfolioOverview()));

        return group;
    }
}
