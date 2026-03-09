import { getSettingsOverview } from "@ground/sdk";
import { SectionCard } from "@/components/SectionCard";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSettingsOverview();

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <SectionCard title="Workspace" eyebrow="Preferences">
        <div className="space-y-3">
          {settings.workspace.map((item) => (
            <div
              key={item.title}
              className="rounded-[24px] border border-stone-200 bg-white/80 p-4"
            >
              <p className="font-medium text-stone-950">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                {item.description}
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-stone-400">
                {item.state}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Integrations" eyebrow="External systems">
        <div className="space-y-3">
          {settings.integrations.map((item) => (
            <div
              key={item.title}
              className="rounded-[24px] border border-stone-200 bg-white/80 p-4"
            >
              <p className="font-medium text-stone-950">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                {item.description}
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-stone-400">
                {item.state}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Security" eyebrow="Controls">
        <div className="space-y-3">
          {settings.security.map((item) => (
            <div
              key={item.title}
              className="rounded-[24px] border border-stone-200 bg-white/80 p-4"
            >
              <p className="font-medium text-stone-950">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                {item.description}
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-stone-400">
                {item.state}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
