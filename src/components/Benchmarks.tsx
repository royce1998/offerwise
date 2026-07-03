import { useState } from "react";
import { BENCHMARKS, benchTotal } from "../data/benchmarks";
import { fmtUSD } from "../lib/calc";
import { Card } from "./ui";
import { BarChart3, ChevronDown } from "lucide-react";

export function Benchmarks({ userTotals }: { userTotals: number[] }) {
  const [open, setOpen] = useState(false);
  const maxUser = userTotals.length ? Math.max(...userTotals) : 0;

  // Find highest benchmark total to scale bars
  const globalMax = Math.max(
    ...BENCHMARKS.flatMap((c) => c.levels.map(benchTotal)),
    maxUser
  );

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300">
            <BarChart3 size={18} />
          </span>
          <span>
            <span className="block text-sm font-bold text-white">
              Market benchmarks
            </span>
            <span className="block text-xs text-slate-400">
              How competitive is your offer? Total comp by company &amp; level.
            </span>
          </span>
        </span>
        <ChevronDown
          size={18}
          className={"text-slate-400 transition " + (open ? "rotate-180" : "")}
        />
      </button>

      {open && (
        <div className="max-h-[520px] overflow-y-auto border-t border-ink-600/50 px-5 py-4 no-scrollbar">
          {maxUser > 0 && (
            <div className="mb-4 rounded-lg border border-brand-500/30 bg-brand-500/10 px-3 py-2 text-xs text-brand-200">
              Your best offer averages{" "}
              <span className="font-mono font-semibold">
                {fmtUSD(maxUser)}
              </span>{" "}
              / yr in total comp — compare below.
            </div>
          )}
          <div className="space-y-5">
            {BENCHMARKS.map((c) => (
              <div key={c.company}>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-white">
                    {c.company}
                  </span>
                  <span className="text-[11px] text-slate-500">{c.ladder}</span>
                </div>
                <div className="space-y-1.5">
                  {c.levels.map((l) => {
                    const total = benchTotal(l);
                    const pct = (total / globalMax) * 100;
                    const beatsUser = maxUser > 0 && total > maxUser;
                    return (
                      <div key={l.level} className="flex items-center gap-2">
                        <span className="w-14 shrink-0 text-right text-[11px] text-slate-400">
                          {l.level}
                        </span>
                        <div className="relative h-6 flex-1 overflow-hidden rounded bg-ink-900/70">
                          <div
                            className="h-full rounded"
                            style={{
                              width: `${pct}%`,
                              background: beatsUser
                                ? "linear-gradient(90deg,#f59e0b,#f59e0baa)"
                                : "linear-gradient(90deg,#18b866,#0c9552)",
                              opacity: 0.85,
                            }}
                          />
                          <span className="absolute inset-y-0 left-2 flex items-center text-[11px] font-medium text-white/90">
                            {l.title}
                          </span>
                          <span className="absolute inset-y-0 right-2 flex items-center font-mono text-[11px] text-white">
                            {fmtUSD(total, true)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {maxUser > 0 && (
            <div className="mt-4 flex items-center gap-4 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-4 rounded bg-brand-500" /> below your offer
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-4 rounded bg-amber-500" /> above your offer
              </span>
            </div>
          )}
          <p className="mt-4 text-[11px] leading-relaxed text-slate-600">
            Benchmarks are approximate community-sourced medians for US-based
            software engineers and are for guidance only.
          </p>
        </div>
      )}
    </Card>
  );
}
