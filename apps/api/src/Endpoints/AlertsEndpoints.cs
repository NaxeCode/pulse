using Ground.Api.Services;

namespace Ground.Api.Endpoints;

public static class AlertsEndpoints
{
    public static RouteGroupBuilder MapAlertsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1").WithTags("Alerts");

        group.MapGet("/alerts", (PlaceholderPlatformService platform) =>
            Results.Ok(platform.GetAlertsOverview()));

        return group;
    }
}
