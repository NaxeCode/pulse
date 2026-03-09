import { getAnalysisWorkspace } from "@ground/sdk";
import { SectionCard } from "@/components/SectionCard";
import { StatusPill } from "@/components/StatusPill";

export const dynamic = "force-dynamic";

export default async function AnalysisPage() {
  const workspace = await getAnalysisWorkspace();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {workspace.modelStatus.map((item) => (
          <div
            key={item.label}
            className="rounded-[28px] border border-stone-300/70 bg-white/85 p-5 shadow-sm"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-stone-400">
              {item.label}
            </p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-lg font-semibold text-stone-950">{item.value}</p>
              <StatusPill tone={item.tone}>{item.tone}</StatusPill>
            </div>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard title="Queued jobs" eyebrow="Pipeline">
          <div className="space-y-3">
            {workspace.queuedJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-[24px] border border-stone-200 bg-white/80 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-stone-950">
                      {job.symbol} · {job.analysisType}
                    </p>
                    <p className="mt-1 text-sm text-stone-600">
                      {job.submittedAt} · owner {job.owner}
                    </p>
                  </div>
                  <StatusPill
                    tone={
                      job.status === "running"
                        ? "warning"
                        : job.status === "completed"
                          ? "positive"
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

        <SectionCard title="Completed runs" eyebrow="Output">
          <div className="space-y-3">
            {workspace.completedRuns.map((run) => (
              <div
                key={`${run.symbol}-${run.updatedAt}`}
                className="rounded-[24px] border border-stone-200 bg-white/80 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-stone-950">
                      {run.symbol} · {run.setup}
                    </p>
                    <p className="mt-1 text-sm text-stone-600">
                      {run.timeframe} · conviction {run.conviction}
                    </p>
                  </div>
                  <p className="text-sm text-stone-500">{run.updatedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <SectionCard title="Analysis templates" eyebrow="Reusable workflows">
          <div className="grid gap-4 lg:grid-cols-2">
            {workspace.templates.map((template) => (
              <div
                key={template.id}
                className="rounded-[24px] border border-stone-200 bg-white/80 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-stone-950">{template.name}</p>
                  <StatusPill
                    tone={
                      template.status === "ready"
                        ? "positive"
                        : template.status === "draft"
                          ? "warning"
                          : "neutral"
                    }
                  >
                    {template.status}
                  </StatusPill>
                </div>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  {template.description}
                </p>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-stone-400">
                  Owner · {template.owner}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Research notes" eyebrow="Context">
          <div className="space-y-3">
            {workspace.notes.map((note) => (
              <div
                key={note}
                className="rounded-[24px] border border-stone-200 bg-gradient-to-br from-white to-stone-50 p-4 text-sm leading-6 text-stone-700"
              >
                {note}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
