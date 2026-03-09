using Ground.Api.Services;

namespace Ground.Api.Endpoints;

public static class SettingsEndpoints
{
    public static RouteGroupBuilder MapSettingsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1").WithTags("Settings");

        group.MapGet("/settings", (PlaceholderPlatformService platform) =>
            Results.Ok(platform.GetSettingsOverview()));

        return group;
    }
}
