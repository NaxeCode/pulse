using Ground.Api.Models;

namespace Ground.Api.Services;

public static class SymbolCatalog
{
    private static readonly IReadOnlyList<SymbolDto> Symbols =
    [
        new("AAPL", "Apple Inc.", "Technology Hardware", "bullish"),
        new("MSFT", "Microsoft Corp.", "Software", "bullish"),
        new("NVDA", "NVIDIA Corp.", "Semiconductors", "neutral"),
        new("TSLA", "Tesla Inc.", "Automotive", "bearish"),
        new("SPY", "SPDR S&P 500 ETF", "Index", "neutral")
    ];

    public static IReadOnlyList<SymbolDto> GetAll() => Symbols;
}
