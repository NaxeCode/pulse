import type { Candle } from "@ground/shared-types";

type CandlesSparklineProps = {
  candles: Candle[];
};

export function CandlesSparkline({ candles }: CandlesSparklineProps) {
  const closes = candles.map((candle) => candle.close);
  const max = Math.max(...closes, 1);
  const min = Math.min(...closes, 0);
  const range = max - min || 1;

  return (
    <div className="flex h-52 items-end gap-2 rounded-[24px] border border-stone-200 bg-stone-950 p-5">
      {candles.slice(-18).map((candle) => {
        const height = 18 + ((candle.close - min) / range) * 130;
        const positive = candle.close >= candle.open;

        return (
          <div key={candle.timestamp} className="flex flex-1 flex-col items-center">
            <div
              className={`w-full rounded-t-full ${
                positive ? "bg-emerald-400" : "bg-amber-300"
              }`}
              style={{ height }}
            />
          </div>
        );
      })}
    </div>
  );
}
