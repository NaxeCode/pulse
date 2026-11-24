using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Ground.Api.Config;
using Ground.Api.Endpoints;
using Ground.Api.Models;
using Ground.Api.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace Ground.Api.Tests;

public class AnalysisQueueTests
{
    private const string Queue = "test-analysis";
    private const string Route = "/api/v1/analysis/run";

    [Fact]
    public async Task BlankSymbolReturnsBadRequestBeforePublishing()
    {
        var publisher = new RecordingPublisher();
        await using var app = await StartApiAsync(publisher);
        using var client = app.GetTestClient();

        using var response = await client.PostAsJsonAsync(Route, new RunAnalysisRequest("  "));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("symbol is required", body.GetProperty("error").GetString());
        Assert.Empty(publisher.Calls);
    }

    [Fact]
    public async Task DisabledQueueReturnsUnavailable()
    {
        var disabled = new NoopAnalysisRequestPublisher(NullLogger<NoopAnalysisRequestPublisher>.Instance);
        await using var app = await StartApiAsync(disabled);
        using var client = app.GetTestClient();

        using var response = await client.PostAsJsonAsync(Route, new RunAnalysisRequest("AAPL"));

        Assert.Equal(HttpStatusCode.ServiceUnavailable, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("analysis queue is unavailable", body.GetProperty("error").GetString());
    }

    [Fact]
    public async Task ConfirmedPublishReturnsConfiguredQueueWithoutLocation()
    {
        var publisher = new RecordingPublisher();
        await using var app = await StartApiAsync(publisher);
        using var client = app.GetTestClient();
        var request = new RunAnalysisRequest("aapl", "extended");

        using var response = await client.PostAsJsonAsync(Route, request);

        Assert.Equal(HttpStatusCode.Accepted, response.StatusCode);
        Assert.Null(response.Headers.Location);
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("queued", body.GetProperty("status").GetString());
        Assert.Equal(Queue, body.GetProperty("queue").GetString());
        Assert.Equal((Queue, request), Assert.Single(publisher.Calls));
    }

    private static async Task<WebApplication> StartApiAsync(IAnalysisRequestPublisher publisher)
    {
        var builder = WebApplication.CreateBuilder();
        builder.WebHost.UseTestServer();
        builder.Services.AddSingleton(publisher);
        builder.Services.AddSingleton<PlaceholderPlatformService>();
        builder.Services.Configure<AppOptions>(options => options.QueueName = Queue);
        var app = builder.Build();
        app.MapAnalysisEndpoints();
        await app.StartAsync();
        return app;
    }

    private sealed class RecordingPublisher : IAnalysisRequestPublisher
    {
        public List<(string Queue, RunAnalysisRequest Request)> Calls { get; } = [];

        public Task<bool> EnqueueAsync(string queueName, RunAnalysisRequest request, CancellationToken cancellationToken)
        {
            Calls.Add((queueName, request));
            return Task.FromResult(true);
        }
    }
}
