import { useEffect, useMemo, useState } from "react";
import type { AppState, Offer, Settings } from "./types";
import {
  buildShareUrl,
  defaultState,
  loadLocal,
  makeOffer,
  readStateFromUrl,
  saveLocal,
} from "./lib/state";
import { computeAll, fmtUSD } from "./lib/calc";
import { OfferCard } from "./components/OfferCard";
import { Results } from "./components/Results";
import { Benchmarks } from "./components/Benchmarks";
import { Segmented, Toggle } from "./components/ui";
import {
  Scale,
  Plus,
  Share2,
  RotateCcw,
  Check,
  Code2,
  Sparkles,
} from "lucide-react";

export default function App() {
  const [state, setState] = useState<AppState>(
    () => readStateFromUrl() ?? loadLocal() ?? defaultState()
  );
  const [copied, setCopied] = useState(false);
  const [sharedBanner, setSharedBanner] = useState(
    () => readStateFromUrl() !== null
  );

  useEffect(() => {
    saveLocal(state);
  }, [state]);

  const results = useMemo(
    () => computeAll(state.offers, state.settings),
    [state]
  );

  const setSettings = (patch: Partial<Settings>) =>
    setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));

  const updateOffer = (id: string, o: Offer) =>
    setState((s) => ({
      ...s,
      offers: s.offers.map((x) => (x.id === id ? o : x)),
    }));

  const removeOffer = (id: string) =>
    setState((s) => ({ ...s, offers: s.offers.filter((x) => x.id !== id) }));

  const addOffer = () =>
    setState((s) => ({ ...s, offers: [...s.offers, makeOffer()] }));

  const duplicateOffer = (id: string) =>
    setState((s) => {
      const src = s.offers.find((x) => x.id === id);
      if (!src) return s;
      const copy = makeOffer({ ...src, company: src.company + " (copy)" });
      return { ...s, offers: [...s.offers, copy] };
    });

  const share = async () => {
    const url = buildShareUrl(state);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* ignore */
    }
    window.history.replaceState(null, "", url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    window.history.replaceState(null, "", window.location.pathname);
    setSharedBanner(false);
    setState(defaultState());
  };

  const userAvgTotals = results.map((r) => r.avgAnnualGross);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6">
      {/* Header */}
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-ink-950 shadow-glow">
            <Scale size={24} strokeWidth={2.4} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white">
              Offer<span className="text-brand-400">Wise</span>
            </h1>
            <p className="text-xs text-slate-400">
              Compare tech job offers by real take-home value
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            className="flex items-center gap-1.5 rounded-lg border border-ink-600 bg-ink-800/60 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-ink-500 hover:text-white"
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button
            onClick={share}
            className="flex items-center gap-1.5 rounded-lg bg-brand-500 px-3.5 py-2 text-xs font-bold text-ink-950 transition hover:bg-brand-400"
          >
            {copied ? <Check size={14} /> : <Share2 size={14} />}
            {copied ? "Link copied!" : "Share"}
          </button>
        </div>
      </header>

      {sharedBanner && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-brand-500/30 bg-brand-500/10 px-4 py-2.5 text-sm text-brand-200">
          <Sparkles size={15} />
          You&apos;re viewing a shared comparison. Edit freely — changes stay in
          your browser.
        </div>
      )}

      {/* Settings bar */}
      <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-ink-600/60 bg-ink-800/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Horizon</span>
          <Segmented
            value={String(state.settings.years)}
            options={[2, 3, 4, 5, 6].map((y) => ({
              value: String(y),
              label: `${y}y`,
            }))}
            onChange={(v) => setSettings({ years: Number(v) })}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Equity outlook</span>
          <Segmented
            value={state.settings.scenario}
            options={[
              { value: "conservative", label: "Cons." },
              { value: "expected", label: "Expected" },
              { value: "optimistic", label: "Optim." },
            ]}
            onChange={(v) => setSettings({ scenario: v as Settings["scenario"] })}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Filing</span>
          <Segmented
            value={state.settings.filing}
            options={[
              { value: "single", label: "Single" },
              { value: "married", label: "Married" },
            ]}
            onChange={(v) => setSettings({ filing: v as Settings["filing"] })}
          />
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Toggle
            checked={state.settings.adjustTax}
            onChange={(v) => setSettings({ adjustTax: v })}
            label="After-tax"
          />
          <Toggle
            checked={state.settings.adjustCOL}
            onChange={(v) => setSettings({ adjustCOL: v })}
            label="Cost-of-living"
          />
        </div>
      </div>

      {/* Offer editors */}
      <div className="mb-6 flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {state.offers.map((o, i) => (
          <OfferCard
            key={o.id}
            offer={o}
            index={i}
            settings={state.settings}
            onChange={(next) => updateOffer(o.id, next)}
            onRemove={() => removeOffer(o.id)}
            onDuplicate={() => duplicateOffer(o.id)}
            canRemove={state.offers.length > 1}
          />
        ))}
        {state.offers.length < 4 && (
          <button
            onClick={addOffer}
            className="flex min-w-[130px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-ink-600 text-slate-400 transition hover:border-brand-500 hover:text-brand-300"
          >
            <Plus size={24} />
            <span className="text-sm font-medium">Add offer</span>
          </button>
        )}
      </div>

      {/* Results */}
      <Results results={results} settings={state.settings} />

      {/* Benchmarks */}
      <div className="mt-4">
        <Benchmarks userTotals={userAvgTotals} />
      </div>

      {/* Explainer */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            t: "Model the full package",
            d: "Base, bonus, sign-on, RSUs, startup options, 401k match & perks — vested over your real horizon.",
          },
          {
            t: "See the real number",
            d: "Estimated federal + state + FICA taxes and cost-of-living turn headline numbers into true take-home.",
          },
          {
            t: "100% private & shareable",
            d: "Everything runs in your browser. Nothing is uploaded. Share a link that encodes the scenario itself.",
          },
        ].map((f) => (
          <div
            key={f.t}
            className="rounded-xl border border-ink-600/50 bg-ink-800/40 p-4"
          >
            <div className="mb-1 text-sm font-semibold text-white">{f.t}</div>
            <div className="text-xs leading-relaxed text-slate-400">{f.d}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-10 flex flex-col items-center gap-2 border-t border-ink-600/40 pt-6 text-center text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Scale size={13} className="text-brand-400" />
          <span className="font-semibold text-slate-400">OfferWise</span>
          <span>— open-source offer comparison for engineers.</span>
        </div>
        <p className="max-w-xl leading-relaxed">
          Estimates only, not financial advice. Tax figures use 2025 US brackets
          and simplified assumptions. Verify with a professional before
          decisions.
        </p>
        <a
          href="https://github.com/royce1998/offerwise"
          className="mt-1 flex items-center gap-1.5 text-slate-400 transition hover:text-brand-300"
        >
          <Code2 size={13} /> royce1998/offerwise
        </a>
        <div className="mt-1 font-mono text-[10px] text-slate-600">
          Total shown: {results.map((r) => fmtUSD(r.totalGross, true)).join(" · ")}
        </div>
      </footer>
    </div>
  );
}
