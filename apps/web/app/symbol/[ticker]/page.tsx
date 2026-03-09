import Link from "next/link";
import { getCandles, getSymbolWorkspace } from "@ground/sdk";
import { CandlesSparkline } from "@/components/CandlesSparkline";
import { RunAnalysisButton } from "@/components/RunAnalysisButton";
import { SectionCard } from "@/components/SectionCard";
import { StatusPill } from "@/components/StatusPill";

type PageProps = {
  params: Promise<{
    ticker: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function SymbolPage({ params }: PageProps) {
  const { ticker: rawTicker } = await params;
  const ticker = rawTicker.toUpperCase();
  const [workspace, candles] = await Promise.all([
    getSymbolWorkspace(ticker),
    getCandles(ticker)
  ]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title={`${workspace.companyName} overview`}
          eyebrow="Live workspace"
          action={<RunAnalysisButton symbol={workspace.symbol} />}
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-[24px] border border-stone-200 bg-stone-950 p-5 text-stone-50">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                Price
              </p>
              <p className="mt-4 text-4xl font-semibold tracking-tight">
                {workspace.price}
              </p>
              <p className="mt-2 text-sm text-stone-400">{workspace.move}</p>
            </div>
            <div className="rounded-[24px] border border-stone-200 bg-white/80 p-5 md:col-span-2">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                Narrative
              </p>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-stone-950">
                {workspace.trend}
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
                This section stands in for the final combination of factor
                signals, analyst notes, event context, and execution guidance.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {workspace.insights.map((insight) => (
              <div
                key={insight.title}
                className="rounded-[24px] border border-stone-200 bg-white/80 p-4"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                  {insight.title}
                </p>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
                  {insight.value}
                </p>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  {insight.detail}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Execution checklist" eyebrow="Trade prep">
          <div className="space-y-3">
            {workspace.executionChecklist.map((item) => (
              <div
                key={item}
                className="rounded-[24px] border border-stone-200 bg-white/80 px-4 py-3 text-sm text-stone-700"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[24px] border border-dashed border-stone-300 bg-stone-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
              Order ticket placeholder
            </p>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              Final UI will include entry plan, sizing, risk brackets, and
              route-to-paper/live controls.
            </p>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard title="Price structure" eyebrow="Market data">
          <CandlesSparkline candles={candles} />
        </SectionCard>

        <SectionCard title="Related signals" eyebrow="Context">
          <div className="space-y-3">
            {workspace.relatedSignals.map((signal) => (
              <div
                key={signal.label}
                className="flex items-center justify-between gap-3 rounded-[24px] border border-stone-200 bg-white/80 p-4"
              >
                <div>
                  <p className="font-medium text-stone-950">{signal.label}</p>
                  <p className="mt-1 text-sm text-stone-600">{signal.value}</p>
                </div>
                <StatusPill tone={signal.tone}>{signal.tone}</StatusPill>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Thesis" eyebrow="Analyst framing">
          <div className="space-y-3">
            {workspace.thesis.map((block) => (
              <div
                key={block.title}
                className="rounded-[24px] border border-stone-200 bg-white/80 p-4"
              >
                <p className="font-medium text-stone-950">{block.title}</p>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  {block.body}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Recent candles"
          eyebrow="Audit trail"
          action={
            <Link
              href="/dashboard"
              className="rounded-full border border-stone-300 px-3 py-2 text-sm text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
            >
              Back to dashboard
            </Link>
          }
        >
          <div className="overflow-hidden rounded-[24px] border border-stone-200 bg-white/90">
            <table className="min-w-full divide-y divide-stone-200 text-sm">
              <thead className="bg-stone-100/90">
                <tr className="text-left text-xs uppercase tracking-[0.2em] text-stone-500">
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3 text-right">Open</th>
                  <th className="px-4 py-3 text-right">High</th>
                  <th className="px-4 py-3 text-right">Low</th>
                  <th className="px-4 py-3 text-right">Close</th>
                  <th className="px-4 py-3 text-right">Volume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {candles.map((candle) => (
                  <tr key={`${candle.symbol}-${candle.timestamp}`}>
                    <td className="px-4 py-3 text-stone-600">
                      {candle.timestamp}
                    </td>
                    <td className="px-4 py-3 text-right text-stone-900">
                      {candle.open.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-stone-900">
                      {candle.high.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-stone-900">
                      {candle.low.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-stone-900">
                      {candle.close.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-stone-900">
                      {candle.volume.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
