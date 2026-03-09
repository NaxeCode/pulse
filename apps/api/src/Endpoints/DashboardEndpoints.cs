using Ground.Api.Services;

namespace Ground.Api.Endpoints;

public static class DashboardEndpoints
{
    public static RouteGroupBuilder MapDashboardEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1").WithTags("Dashboard");

        group.MapGet("/dashboard", (PlaceholderPlatformService platform) =>
            Results.Ok(platform.GetDashboardOverview()));

        return group;
    }
}
