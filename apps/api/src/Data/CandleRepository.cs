using Ground.Api.Models;
using Npgsql;

namespace Ground.Api.Data;

public sealed class CandleRepository
{
    private readonly NpgsqlDataSource _dataSource;
    private readonly ILogger<CandleRepository> _logger;

    public CandleRepository(NpgsqlDataSource dataSource, ILogger<CandleRepository> logger)
    {
        _dataSource = dataSource;
        _logger = logger;
    }

    public async Task<IReadOnlyList<CandleDto>> GetLatestCandlesAsync(string symbol, int limit = 100, CancellationToken cancellationToken = default)
    {
        const string sql = """
            SELECT symbol, ts, open, high, low, close, volume
            FROM market_candles
            WHERE symbol = @symbol
            ORDER BY ts DESC
            LIMIT @limit;
            """;

        await using var connection = await _dataSource.OpenConnectionAsync(cancellationToken);
        await using var command = new NpgsqlCommand(sql, connection)
        {
            Parameters =
            {
                new("symbol", symbol.ToUpperInvariant()),
                new("limit", limit)
            }
        };

        var candles = new List<CandleDto>();
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);

        while (await reader.ReadAsync(cancellationToken))
        {
            candles.Add(new CandleDto(
                reader.GetString(0),
                reader.GetFieldValue<DateTimeOffset>(1),
                reader.GetDecimal(2),
                reader.GetDecimal(3),
                reader.GetDecimal(4),
                reader.GetDecimal(5),
                reader.GetInt64(6)
            ));
        }

        _logger.LogInformation("Retrieved {Count} candles for {Symbol}", candles.Count, symbol);
        return candles;
    }
}
