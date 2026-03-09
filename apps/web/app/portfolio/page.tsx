import { getPortfolioOverview } from "@ground/sdk";
import { SectionCard } from "@/components/SectionCard";
import { StatusPill } from "@/components/StatusPill";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const portfolio = await getPortfolioOverview();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          ["Account value", portfolio.accountValue],
          ["Buying power", portfolio.buyingPower],
          ["Daily PnL", portfolio.dailyPnl],
          ["Gross exposure", portfolio.grossExposure],
          ["Net exposure", portfolio.netExposure]
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-[28px] border border-stone-300/70 bg-white/85 p-5 shadow-sm"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-stone-400">
              {label}
            </p>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-stone-950">
              {value}
            </p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Holdings" eyebrow="Book">
          <div className="space-y-3">
            {portfolio.holdings.map((holding) => (
              <div
                key={holding.symbol}
                className="grid gap-3 rounded-[24px] border border-stone-200 bg-white/80 p-4 md:grid-cols-[0.8fr_0.8fr_0.8fr_0.8fr_1.4fr_auto]"
              >
                <div>
                  <p className="text-lg font-semibold tracking-tight text-stone-950">
                    {holding.symbol}
                  </p>
                  <p className="text-sm text-stone-600">{holding.name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                    Weight
                  </p>
                  <p className="mt-2 text-sm font-medium text-stone-900">
                    {holding.weight}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                    Exposure
                  </p>
                  <p className="mt-2 text-sm font-medium text-stone-900">
                    {holding.exposure}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                    PnL
                  </p>
                  <p className="mt-2 text-sm font-medium text-stone-900">
                    {holding.pnl}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                    Thesis
                  </p>
                  <p className="mt-2 text-sm leading-6 text-stone-700">
                    {holding.thesis}
                  </p>
                </div>
                <div className="flex items-start justify-end">
                  <StatusPill
                    tone={
                      holding.risk === "high"
                        ? "negative"
                        : holding.risk === "medium"
                          ? "warning"
                          : "positive"
                    }
                  >
                    {holding.risk} risk
                  </StatusPill>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Allocation" eyebrow="Mix">
            <div className="space-y-3">
              {portfolio.allocation.map((slice) => (
                <div key={slice.label}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-stone-700">{slice.label}</span>
                    <span className="font-medium text-stone-950">
                      {slice.value}
                    </span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-stone-200">
                    <div
                      className="h-3 rounded-full bg-stone-950"
                      style={{ width: slice.value }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Guardrails" eyebrow="Risk">
            <div className="space-y-3">
              {portfolio.guardrails.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white/80 p-4"
                >
                  <div>
                    <p className="font-medium text-stone-950">{item.label}</p>
                    <p className="mt-1 text-sm text-stone-600">{item.value}</p>
                  </div>
                  <StatusPill tone={item.tone}>{item.tone}</StatusPill>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
