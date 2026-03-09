using Ground.Api.Services;

namespace Ground.Api.Endpoints;

public static class SymbolEndpoints
{
    public static RouteGroupBuilder MapSymbolEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1").WithTags("Symbols");

        group.MapGet("/symbols", () => Results.Ok(SymbolCatalog.GetAll()));

        group.MapGet("/symbols/{symbol}/workspace", (string symbol, PlaceholderPlatformService platform) =>
            Results.Ok(platform.GetSymbolWorkspace(symbol)));

        return group;
    }
}
