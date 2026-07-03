import type { Offer, EquityKind } from "../types";
import { LOCATIONS } from "../data/locations";
import { Label, MoneyInput, Select, TextInput, Segmented } from "./ui";
import { fmtUSD, optionsExpectedValue, scenarioMult } from "../lib/calc";
import type { Settings } from "../types";
import { Trash2, Copy } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-ink-600/50 px-4 py-3">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </div>
      {children}
    </div>
  );
}

export function OfferCard({
  offer,
  settings,
  index,
  onChange,
  onRemove,
  onDuplicate,
  canRemove,
}: {
  offer: Offer;
  settings: Settings;
  index: number;
  onChange: (o: Offer) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  canRemove: boolean;
}) {
  const set = <K extends keyof Offer>(k: K, v: Offer[K]) =>
    onChange({ ...offer, [k]: v });

  const equityOpts: { value: EquityKind; label: string }[] = [
    { value: "rsu", label: "RSUs" },
    { value: "options", label: "Options" },
    { value: "none", label: "None" },
  ];

  const optEV = offer.equityKind === "options" ? optionsExpectedValue(offer, settings) : 0;

  return (
    <div className="min-w-[300px] flex-1 overflow-hidden rounded-2xl border border-ink-600/60 bg-ink-800/60 backdrop-blur">
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ background: `linear-gradient(90deg, ${offer.color}22, transparent)` }}
      >
        <span
          className="h-3 w-3 shrink-0 rounded-full"
          style={{ background: offer.color }}
        />
        <input
          value={offer.company}
          onChange={(e) => set("company", e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-base font-bold text-white outline-none placeholder:text-slate-500"
          placeholder="Company"
        />
        <button
          onClick={onDuplicate}
          title="Duplicate"
          className="rounded-md p-1.5 text-slate-400 hover:bg-ink-700 hover:text-white"
        >
          <Copy size={15} />
        </button>
        <button
          onClick={onRemove}
          disabled={!canRemove}
          title="Remove"
          className="rounded-md p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-300 disabled:opacity-30"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Role / level / location */}
      <div className="grid grid-cols-2 gap-2 px-4 pb-1">
        <div>
          <Label>Role</Label>
          <TextInput value={offer.role} onChange={(v) => set("role", v)} />
        </div>
        <div>
          <Label>Level</Label>
          <TextInput value={offer.level} onChange={(v) => set("level", v)} placeholder="e.g. L5" />
        </div>
        <div className="col-span-2">
          <Label>Location</Label>
          <Select value={offer.locationId} onChange={(v) => set("locationId", v)}>
            {LOCATIONS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label} · COL {l.col}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Cash */}
      <Section title="Cash Compensation">
        <div className="grid grid-cols-2 gap-2">
          <div className="col-span-2">
            <Label>Base salary / yr</Label>
            <MoneyInput value={offer.base} onChange={(v) => set("base", v)} />
          </div>
          <div>
            <Label>Sign-on Y1</Label>
            <MoneyInput value={offer.signOnY1} onChange={(v) => set("signOnY1", v)} step={1000} />
          </div>
          <div>
            <Label>Sign-on Y2</Label>
            <MoneyInput value={offer.signOnY2} onChange={(v) => set("signOnY2", v)} step={1000} />
          </div>
          <div>
            <Label>Target bonus %</Label>
            <MoneyInput value={offer.targetBonusPct} onChange={(v) => set("targetBonusPct", v)} prefix="" suffix="%" step={1} />
          </div>
          <div>
            <Label>Annual raise %</Label>
            <MoneyInput value={offer.annualRaisePct} onChange={(v) => set("annualRaisePct", v)} prefix="" suffix="%" step={1} />
          </div>
        </div>
      </Section>

      {/* Equity */}
      <Section title="Equity">
        <div className="mb-3">
          <Segmented value={offer.equityKind} options={equityOpts} onChange={(v) => set("equityKind", v)} />
        </div>

        {offer.equityKind === "rsu" && (
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <Label>Total grant value</Label>
              <MoneyInput value={offer.equityGrantValue} onChange={(v) => set("equityGrantValue", v)} step={10000} />
            </div>
            <div className="col-span-2">
              <Label>Vesting schedule (% / yr)</Label>
              <VestEditor schedule={offer.vestSchedule} onChange={(s) => set("vestSchedule", s)} />
            </div>
            <div className="col-span-2">
              <Label>Expected stock growth %/yr</Label>
              <MoneyInput value={offer.equityGrowthPct} onChange={(v) => set("equityGrowthPct", v)} prefix="" suffix="%" step={1} />
            </div>
          </div>
        )}

        {offer.equityKind === "options" && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label># Options</Label>
              <MoneyInput value={offer.numOptions} onChange={(v) => set("numOptions", v)} prefix="" step={1000} />
            </div>
            <div>
              <Label>Strike price</Label>
              <MoneyInput value={offer.strikePrice} onChange={(v) => set("strikePrice", v)} step={0.5} />
            </div>
            <div>
              <Label>Current PPS (409A)</Label>
              <MoneyInput value={offer.currentPPS} onChange={(v) => set("currentPPS", v)} step={0.5} />
            </div>
            <div>
              <Label>Expected exit PPS</Label>
              <MoneyInput value={offer.exitPPS} onChange={(v) => set("exitPPS", v)} step={1} />
            </div>
            <div className="col-span-2">
              <Label>Future dilution %</Label>
              <MoneyInput value={offer.dilutionPct} onChange={(v) => set("dilutionPct", v)} prefix="" suffix="%" step={1} />
            </div>
            <div className="col-span-2">
              <Label>Vesting schedule (% / yr)</Label>
              <VestEditor schedule={offer.vestSchedule} onChange={(s) => set("vestSchedule", s)} />
            </div>
            <div className="col-span-2 rounded-lg bg-ink-900/60 px-3 py-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>
                  Est. value ({settings.scenario}, ×{scenarioMult(settings.scenario)})
                </span>
                <span className="font-mono font-semibold text-brand-300">
                  {fmtUSD(optEV)}
                </span>
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                Gain/share ≈ {fmtUSD(Math.max(0, offer.exitPPS * scenarioMult(settings.scenario) - offer.strikePrice))} after strike, less {offer.dilutionPct}% dilution.
              </div>
            </div>
          </div>
        )}

        {offer.equityKind === "none" && (
          <p className="text-xs text-slate-500">No equity in this offer.</p>
        )}
      </Section>

      {/* Benefits */}
      <Section title="Benefits">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>401k match %</Label>
            <MoneyInput value={offer.match401kPct} onChange={(v) => set("match401kPct", v)} prefix="" suffix="%" step={1} />
          </div>
          <div>
            <Label>Other perks / yr</Label>
            <MoneyInput value={offer.otherPerksAnnual} onChange={(v) => set("otherPerksAnnual", v)} step={500} />
          </div>
        </div>
      </Section>

      <div className="px-4 pb-1 text-right text-[11px] text-slate-600">
        Offer {index + 1}
      </div>
    </div>
  );
}

function VestEditor({
  schedule,
  onChange,
}: {
  schedule: number[];
  onChange: (s: number[]) => void;
}) {
  const total = schedule.reduce((a, b) => a + b, 0);
  const presets: { label: string; v: number[] }[] = [
    { label: "25/25/25/25", v: [25, 25, 25, 25] },
    { label: "10/20/30/40", v: [10, 20, 30, 40] },
    { label: "33/33/33 (3y)", v: [34, 33, 33] },
    { label: "5/15/40/40", v: [5, 15, 40, 40] },
  ];
  return (
    <div>
      <div className="mb-1.5 flex flex-wrap gap-1">
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => onChange(p.v)}
            className={
              "rounded-md border px-2 py-0.5 text-[11px] transition " +
              (JSON.stringify(p.v) === JSON.stringify(schedule)
                ? "border-brand-500 bg-brand-500/15 text-brand-300"
                : "border-ink-600 text-slate-400 hover:border-ink-500")
            }
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex gap-1">
        {schedule.map((v, i) => (
          <input
            key={i}
            type="number"
            value={v}
            onChange={(e) => {
              const next = [...schedule];
              next[i] = parseFloat(e.target.value) || 0;
              onChange(next);
            }}
            className="w-full rounded-md border border-ink-600 bg-ink-900/70 px-1.5 py-1 text-center text-xs text-slate-100 outline-none focus:border-brand-500"
          />
        ))}
      </div>
      <div className={"mt-1 text-right text-[11px] " + (total === 100 ? "text-slate-500" : "text-amber-400")}>
        Total: {total}% {total !== 100 && "(should be 100%)"}
      </div>
    </div>
  );
}
