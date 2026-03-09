"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AppChromeProps = {
  children: React.ReactNode;
};

const navigation = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/analysis", label: "Analysis" },
  { href: "/alerts", label: "Alerts" },
  { href: "/settings", label: "Settings" }
];

const routeMeta: Record<
  string,
  { eyebrow: string; title: string; description: string }
> = {
  "/dashboard": {
    eyebrow: "Operating view",
    title: "Dashboard",
    description:
      "Prototype operating view for idea generation, queue health, and daily decision support."
  },
  "/portfolio": {
    eyebrow: "Capital view",
    title: "Portfolio",
    description:
      "Portfolio construction, exposure management, and risk communication surfaces for the final product shell."
  },
  "/analysis": {
    eyebrow: "Research engine",
    title: "Analysis",
    description:
      "Model health, queued work, reusable templates, and analyst context in one research workspace."
  },
  "/alerts": {
    eyebrow: "Monitoring layer",
    title: "Alerts",
    description:
      "Alert design, trigger review, and delivery routing modeled as a first-class workflow."
  },
  "/settings": {
    eyebrow: "Controls",
    title: "Settings",
    description:
      "Workspace preferences, integrations, and security controls with placeholder-backed state."
  }
};

function getRouteMeta(pathname: string) {
  if (pathname.startsWith("/symbol/")) {
    const ticker = pathname.split("/").pop()?.toUpperCase() ?? "Symbol";

    return {
      eyebrow: "Symbol workspace",
      title: `${ticker} Workspace`,
      description:
        "Decision workspace for analysis context, execution prep, and market data review."
    };
  }

  return (
    routeMeta[pathname] ?? {
      eyebrow: "Ground",
      title: "Research OS",
      description:
        "Production-minded financial analysis workspace with placeholder-backed product surfaces."
    }
  );
}

export function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();
  const meta = getRouteMeta(pathname);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.12),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(2,132,199,0.14),_transparent_32%),linear-gradient(180deg,_#f7f4ec_0%,_#f4efe2_44%,_#efe8d7_100%)] text-stone-900">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-6">
        <aside className="rounded-[28px] border border-stone-300/70 bg-stone-950 px-5 py-6 text-stone-100 shadow-[0_24px_80px_rgba(28,25,23,0.35)]">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.35em] text-stone-400">
              Ground
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Research OS
            </h1>
            <p className="mt-3 text-sm leading-6 text-stone-400">
              Prototype workspace for market intelligence, analysis operations,
              and execution prep.
            </p>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center justify-between overflow-hidden rounded-2xl px-4 py-3 text-sm transition-all duration-300 ${
                    active
                      ? "bg-stone-100 text-stone-950 shadow-[inset_0_0_0_1px_rgba(28,25,23,0.08)]"
                      : "text-stone-300 hover:bg-stone-900 hover:text-stone-100"
                  }`}
                >
                  <span
                    className={`absolute inset-y-2 left-2 w-1 rounded-full bg-amber-400 transition-all duration-300 ${
                      active
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-60"
                    }`}
                  />
                  <span className="relative pl-3">{item.label}</span>
                  <span className="relative text-xs uppercase tracking-[0.2em]">
                    {active ? "Live" : "View"}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-10 rounded-3xl border border-stone-800 bg-stone-900/80 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
              Prototype Status
            </p>
            <p className="mt-3 text-sm leading-6 text-stone-300">
              The app now navigates as a persistent shell. Route content swaps
              and animates while the chrome stays mounted.
            </p>
          </div>
        </aside>

        <div className="space-y-6">
          <header className="rounded-[28px] border border-stone-300/70 bg-[rgba(255,252,245,0.86)] px-6 py-6 shadow-[0_16px_50px_rgba(120,113,108,0.12)] backdrop-blur transition-all duration-300">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="route-fade-in">
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                  {meta.eyebrow}
                </p>
                <h2 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950">
                  {meta.title}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
                  {meta.description}
                </p>
              </div>

              <div className="grid gap-3 rounded-3xl border border-stone-300/70 bg-white/80 p-4 text-sm text-stone-600 shadow-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                    Region
                  </p>
                  <p className="mt-2 font-medium text-stone-900">US Equities</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                    Mode
                  </p>
                  <p className="mt-2 font-medium text-stone-900">
                    Research Prototype
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                    Execution
                  </p>
                  <p className="mt-2 font-medium text-stone-900">Paper Ready</p>
                </div>
              </div>
            </div>
          </header>

          <main key={pathname} className="route-content-enter">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
