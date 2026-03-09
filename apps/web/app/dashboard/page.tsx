import Link from "next/link";
import { getDashboardOverview } from "@ground/sdk";
import { SectionCard } from "@/components/SectionCard";
import { StatusPill } from "@/components/StatusPill";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const overview = await getDashboardOverview();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overview.metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-[28px] border border-stone-300/70 bg-stone-950 p-5 text-stone-50 shadow-[0_16px_40px_rgba(28,25,23,0.26)]"
          >
            <p className="text-xs uppercase tracking-[0.28em] text-stone-400">
              {metric.label}
            </p>
            <p className="mt-4 text-3xl font-semibold tracking-tight">
              {metric.value}
            </p>
            <p className="mt-2 text-sm text-stone-400">{metric.delta}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <SectionCard
          title="Market command center"
          eyebrow="Overview"
          action={
            <Link
              href="/analysis"
              className="rounded-full border border-stone-300 px-3 py-2 text-sm text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
            >
              Open analysis
            </Link>
          }
        >
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="max-w-xl text-sm leading-6 text-stone-600">
                {overview.headline}
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {overview.marketStatus.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-stone-200 bg-white/80 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                      {item.label}
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="font-medium text-stone-900">{item.value}</p>
                      <StatusPill tone={item.tone}>{item.tone}</StatusPill>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-stone-200 bg-gradient-to-br from-amber-100 via-white to-sky-100 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                Workspace narrative
              </p>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-stone-950">
                Build confidence before you build size.
              </p>
              <p className="mt-4 text-sm leading-6 text-stone-600">
                The final product should let a PM move from screening, to
                analysis, to alerting, to execution without breaking context.
                This prototype now exposes that full shell.
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Active alerts" eyebrow="Risk">
          <div className="space-y-3">
            {overview.alerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-2xl border border-stone-200 bg-white/80 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-stone-950">{alert.title}</p>
                    <p className="mt-1 text-sm text-stone-600">
                      {alert.symbol} · {alert.condition}
                    </p>
                  </div>
                  <StatusPill
                    tone={
                      alert.severity === "high"
                        ? "negative"
                        : alert.severity === "medium"
                          ? "warning"
                          : "neutral"
                    }
                  >
                    {alert.status}
                  </StatusPill>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Watchlist" eyebrow="Coverage">
          <div className="space-y-3">
            {overview.watchlist.map((item) => (
              <Link
                key={item.ticker}
                href={`/symbol/${item.ticker}`}
                className="grid gap-3 rounded-[24px] border border-stone-200 bg-white/80 p-4 transition hover:-translate-y-0.5 hover:border-stone-950 md:grid-cols-[1.1fr_0.7fr_0.8fr_0.8fr]"
              >
                <div>
                  <p className="text-lg font-semibold tracking-tight text-stone-950">
                    {item.ticker}
                  </p>
                  <p className="text-sm text-stone-600">{item.name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                    Price
                  </p>
                  <p className="mt-2 font-medium text-stone-900">{item.price}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                    Move
                  </p>
                  <p className="mt-2 font-medium text-stone-900">{item.move}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                    Signal
                  </p>
                  <p className="mt-2 text-sm text-stone-700">{item.signal}</p>
                </div>
              </Link>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Queue health" eyebrow="Operations">
          <div className="space-y-3">
            {overview.queue.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl border border-stone-200 bg-white/80 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-stone-950">
                      {job.symbol} · {job.analysisType}
                    </p>
                    <p className="mt-1 text-sm text-stone-600">
                      Submitted {job.submittedAt} by {job.owner}
                    </p>
                  </div>
                  <StatusPill
                    tone={
                      job.status === "completed"
                        ? "positive"
                        : job.status === "running"
                          ? "warning"
                          : "neutral"
                    }
                  >
                    {job.status}
                  </StatusPill>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Recent analyses" eyebrow="Research">
          <div className="space-y-3">
            {overview.recentAnalyses.map((item) => (
              <div
                key={`${item.symbol}-${item.updatedAt}`}
                className="rounded-2xl border border-stone-200 bg-white/80 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-stone-950">
                      {item.symbol} · {item.setup}
                    </p>
                    <p className="mt-1 text-sm text-stone-600">
                      {item.timeframe} · conviction {item.conviction}
                    </p>
                  </div>
                  <p className="text-sm text-stone-500">{item.updatedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Activity stream" eyebrow="Ops log">
          <div className="space-y-3">
            {overview.activity.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-stone-200 bg-white/80 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-stone-950">{item.title}</p>
                  <p className="text-sm text-stone-500">{item.timestamp}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
