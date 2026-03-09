type StatusPillProps = {
  tone: "positive" | "neutral" | "negative" | "warning";
  children: React.ReactNode;
};

const tones: Record<StatusPillProps["tone"], string> = {
  positive: "bg-emerald-100 text-emerald-900 border-emerald-200",
  neutral: "bg-stone-100 text-stone-800 border-stone-200",
  negative: "bg-rose-100 text-rose-900 border-rose-200",
  warning: "bg-amber-100 text-amber-900 border-amber-200"
};

export function StatusPill({ tone, children }: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
