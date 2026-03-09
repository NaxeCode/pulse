type SectionCardProps = {
  title: string;
  eyebrow?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function SectionCard({
  title,
  eyebrow,
  action,
  children,
  className = ""
}: SectionCardProps) {
  return (
    <section
      className={`rounded-[28px] border border-stone-300/70 bg-[rgba(255,252,245,0.88)] p-5 shadow-[0_16px_40px_rgba(120,113,108,0.10)] ${className}`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          {eyebrow ? (
            <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
              {eyebrow}
            </p>
          ) : null}
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">
            {title}
          </h3>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
