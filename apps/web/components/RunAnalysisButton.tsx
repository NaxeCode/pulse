"use client";

import { runAnalysis } from "@ground/sdk";
import { startTransition, useState } from "react";

type Props = {
  symbol: string;
};

export function RunAnalysisButton({ symbol }: Props) {
  const [status, setStatus] = useState<string>("idle");

  async function handleClick() {
    startTransition(() => setStatus("running"));
    try {
      const response = await runAnalysis(symbol);
      setStatus(`queued in ${response.queue}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setStatus(`error: ${message}`);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleClick}
        className="rounded-full border border-stone-950 bg-stone-950 px-4 py-2 text-sm font-medium text-stone-50 transition hover:-translate-y-0.5 hover:bg-stone-800"
      >
        Run Analysis
      </button>
      <span className="text-xs uppercase tracking-[0.2em] text-stone-500">
        {status}
      </span>
    </div>
  );
}
