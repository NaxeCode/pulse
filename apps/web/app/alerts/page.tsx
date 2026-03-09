import { getAlertsOverview } from "@ground/sdk";
import { SectionCard } from "@/components/SectionCard";
import { StatusPill } from "@/components/StatusPill";

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const overview = await getAlertsOverview();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title="Active rules" eyebrow="Definitions">
          <div className="space-y-3">
            {overview.rules.map((rule) => (
              <div
                key={rule.id}
                className="rounded-[24px] border border-stone-200 bg-white/80 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-stone-950">
                      {rule.title} · {rule.symbol}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-stone-600">
                      {rule.condition}
                    </p>
                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-stone-400">
                      {rule.channel}
                    </p>
                  </div>
                  <StatusPill
                    tone={
                      rule.severity === "high"
                        ? "negative"
                        : rule.severity === "medium"
                          ? "warning"
                          : "neutral"
                    }
                  >
                    {rule.status}
                  </StatusPill>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Delivery channels" eyebrow="Routing">
          <div className="space-y-3">
            {overview.channels.map((channel) => (
              <div
                key={channel.label}
                className="flex items-center justify-between gap-3 rounded-[24px] border border-stone-200 bg-white/80 p-4"
              >
                <div>
                  <p className="font-medium text-stone-950">{channel.label}</p>
                  <p className="mt-1 text-sm text-stone-600">
                    {channel.destination}
                  </p>
                </div>
                <StatusPill
                  tone={channel.status === "connected" ? "positive" : "warning"}
                >
                  {channel.status}
                </StatusPill>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Recent triggers" eyebrow="Escalations">
        <div className="grid gap-4 md:grid-cols-2">
          {overview.recentTriggers.map((trigger) => (
            <div
              key={trigger.id}
              className="rounded-[24px] border border-stone-200 bg-white/80 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-stone-950">{trigger.title}</p>
                <p className="text-sm text-stone-500">{trigger.timestamp}</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                {trigger.detail}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
