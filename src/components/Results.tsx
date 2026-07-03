import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import type { OfferResult, Settings } from "../types";
import { fmtUSD } from "../lib/calc";
import { getLocation } from "../data/locations";
import { Card } from "./ui";
import { Trophy, TrendingUp, Info } from "lucide-react";

const COMPONENTS = [
  { key: "base", label: "Base", color: "#3b82f6" },
  { key: "bonus", label: "Bonus", color: "#8b5cf6" },
  { key: "signOn", label: "Sign-on", color: "#ec4899" },
  { key: "equity", label: "Equity", color: "#18b866" },
  { key: "benefits", label: "Benefits", color: "#f59e0b" },
] as const;

function TooltipBox({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((a: number, p: any) => a + (p.value || 0), 0);
  return (
    <div className="rounded-lg border border-ink-600 bg-ink-900/95 px-3 py-2 text-xs shadow-xl">
      <div className="mb-1 font-semibold text-white">{label}</div>
      {payload
        .filter((p: any) => p.value > 0)
        .map((p: any) => (
          <div key={p.name} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.fill }} />
              {p.name}
            </span>
            <span className="font-mono text-slate-200">{fmtUSD(p.value)}</span>
          </div>
        ))}
      <div className="mt-1 flex justify-between gap-4 border-t border-ink-600 pt-1 font-semibold text-white">
        <span>Total</span>
        <span className="font-mono">{fmtUSD(total)}</span>
      </div>
    </div>
  );
}

export function Results({
  results,
  settings,
}: {
  results: OfferResult[];
  settings: Settings;
}) {
  if (results.length === 0) return null;

  const metric = settings.adjustCOL
    ? "colAdjustedNet"
    : settings.adjustTax
    ? "totalNet"
    : "totalGross";

  const best = results.reduce((a, b) =>
    (b[metric] as number) > (a[metric] as number) ? b : a
  );
  const bestVal = best[metric] as number;

  // Bar chart: total comp breakdown per offer (averaged per year across horizon)
  const barData = results.map((r) => {
    const avg = (k: string) =>
      r.years.reduce((a, y) => a + (y as any)[k], 0) / settings.years;
    return {
      name: r.offer.company,
      base: avg("base"),
      bonus: avg("bonus"),
      signOn: avg("signOn"),
      equity: avg("equity"),
      benefits: avg("benefits"),
    };
  });

  // Line chart: cumulative gross over years
  const lineData = Array.from({ length: settings.years }, (_, i) => {
    const row: any = { name: `Yr ${i + 1}` };
    results.forEach((r) => {
      const cum = r.years.slice(0, i + 1).reduce((a, y) => a + y.gross, 0);
      row[r.offer.company] = Math.round(cum);
    });
    return row;
  });

  const metricLabel = settings.adjustCOL
    ? "COL-adjusted take-home"
    : settings.adjustTax
    ? "Take-home (after-tax)"
    : "Total compensation";

  return (
    <div className="space-y-4">
      {/* Winner banner */}
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
              <Trophy size={22} />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-400">
                Best on {metricLabel} · {settings.years} yr
              </div>
              <div className="text-xl font-extrabold text-white">
                {best.offer.company}{" "}
                <span className="font-mono text-brand-300">{fmtUSD(bestVal)}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {results
              .filter((r) => r !== best)
              .map((r) => {
                const diff = bestVal - (r[metric] as number);
                const pct = ((diff / bestVal) * 100).toFixed(1);
                return (
                  <div
                    key={r.offer.id}
                    className="rounded-lg border border-ink-600 bg-ink-900/60 px-3 py-1.5 text-xs"
                  >
                    <span className="text-slate-400">{r.offer.company} </span>
                    <span className="font-mono text-amber-300">−{fmtUSD(diff, true)}</span>
                    <span className="text-slate-500"> ({pct}%)</span>
                  </div>
                );
              })}
          </div>
        </div>
      </Card>

      {/* Comparison table */}
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-ink-600/60 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 font-medium">Metric</th>
              {results.map((r) => (
                <th key={r.offer.id} className="px-4 py-3 font-semibold text-white">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.offer.color }} />
                    {r.offer.company}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-600/40">
            <Row label={`Total comp (${settings.years}yr)`} results={results} pick={(r) => r.totalGross} />
            <Row label="Avg / year" results={results} pick={(r) => r.avgAnnualGross} />
            {settings.adjustTax && (
              <Row label={`Take-home (${settings.years}yr)`} results={results} pick={(r) => r.totalNet} />
            )}
            {settings.adjustTax && (
              <Row
                label="Effective tax rate"
                results={results}
                pick={(r) => r.effectiveTaxRate}
                fmt={(v) => (v * 100).toFixed(1) + "%"}
                lowerBetter
              />
            )}
            {settings.adjustCOL && (
              <Row
                label="COL-adjusted take-home"
                results={results}
                pick={(r) => r.colAdjustedNet}
                highlight
              />
            )}
            <Row
              label="Cost-of-living index"
              results={results}
              pick={(r) => getLocation(r.offer.locationId).col}
              fmt={(v) => String(v)}
              lowerBetter
              neutral
            />
          </tbody>
        </table>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Breakdown bar */}
        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <Info size={15} className="text-brand-300" />
            Avg annual comp breakdown
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData} margin={{ top: 6, right: 6, left: 6, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2b355040" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => fmtUSD(v, true)} tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
              <Tooltip content={<TooltipBox />} cursor={{ fill: "#ffffff08" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
              {COMPONENTS.map((c) => (
                <Bar key={c.key} dataKey={c.key} name={c.label} stackId="a" fill={c.color} radius={c.key === "benefits" ? [4, 4, 0, 0] : undefined} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Cumulative line */}
        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <TrendingUp size={15} className="text-brand-300" />
            Cumulative total comp
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={lineData} margin={{ top: 6, right: 6, left: 6, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2b355040" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => fmtUSD(v, true)} tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
              <Tooltip content={<TooltipBox />} cursor={{ stroke: "#ffffff20" }} />
              {results.map((r) => (
                <Line
                  key={r.offer.id}
                  type="monotone"
                  dataKey={r.offer.company}
                  stroke={r.offer.color}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function Row({
  label,
  results,
  pick,
  fmt = (v: number) => fmtUSD(v),
  lowerBetter = false,
  highlight = false,
  neutral = false,
}: {
  label: string;
  results: OfferResult[];
  pick: (r: OfferResult) => number;
  fmt?: (v: number) => string;
  lowerBetter?: boolean;
  highlight?: boolean;
  neutral?: boolean;
}) {
  const vals = results.map(pick);
  const bestVal = lowerBetter ? Math.min(...vals) : Math.max(...vals);
  return (
    <tr className={highlight ? "bg-brand-500/5" : ""}>
      <td className="px-4 py-2.5 text-slate-400">{label}</td>
      {results.map((r, i) => {
        const v = vals[i];
        const isBest = !neutral && v === bestVal && results.length > 1;
        return (
          <td key={r.offer.id} className="px-4 py-2.5">
            <span
              className={
                "font-mono " +
                (isBest ? "font-bold text-brand-300" : "text-slate-200")
              }
            >
              {fmt(v)}
              {isBest && <span className="ml-1 text-[10px]">▲</span>}
            </span>
          </td>
        );
      })}
    </tr>
  );
}
