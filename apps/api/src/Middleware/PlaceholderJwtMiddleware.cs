namespace Ground.Api.Middleware;

public sealed class PlaceholderJwtMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<PlaceholderJwtMiddleware> _logger;

    public PlaceholderJwtMiddleware(RequestDelegate next, ILogger<PlaceholderJwtMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var authHeader = context.Request.Headers.Authorization.ToString();

        if (!string.IsNullOrWhiteSpace(authHeader) && authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            context.Items["AuthState"] = "placeholder-valid";
        }
        else
        {
            context.Items["AuthState"] = "placeholder-anonymous";
        }

        _logger.LogDebug("Auth state for {Path}: {AuthState}", context.Request.Path, context.Items["AuthState"]);
        await _next(context);
    }
}
