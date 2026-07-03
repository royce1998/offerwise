import React from "react";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "rounded-2xl border border-ink-600/60 bg-ink-800/60 backdrop-blur " +
        className
      }
    >
      {children}
    </div>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
      {children}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={
        "w-full rounded-lg border border-ink-600 bg-ink-900/70 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 " +
        className
      }
    />
  );
}

export function MoneyInput({
  value,
  onChange,
  prefix = "$",
  suffix,
  step = 1000,
}: {
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
}) {
  const [focused, setFocused] = React.useState(false);
  const display = focused
    ? String(value)
    : value.toLocaleString("en-US");
  return (
    <div className="flex items-center rounded-lg border border-ink-600 bg-ink-900/70 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/30">
      {prefix && (
        <span className="pl-3 text-sm text-slate-500">{prefix}</span>
      )}
      <input
        type={focused ? "number" : "text"}
        inputMode="numeric"
        step={step}
        value={focused ? value : display}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => {
          const n = parseFloat(e.target.value);
          onChange(Number.isFinite(n) ? n : 0);
        }}
        className="w-full bg-transparent px-2 py-2 text-sm text-slate-100 outline-none"
      />
      {suffix && (
        <span className="pr-3 text-sm text-slate-500">{suffix}</span>
      )}
    </div>
  );
}

export function Select({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-ink-600 bg-ink-900/70 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
    >
      {children}
    </select>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-ink-600 bg-ink-900/70 p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={
            "rounded-md px-3 py-1.5 text-xs font-medium transition " +
            (value === o.value
              ? "bg-brand-500 text-ink-950 shadow"
              : "text-slate-300 hover:text-white")
          }
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 text-sm text-slate-300"
    >
      <span
        className={
          "relative h-5 w-9 rounded-full transition " +
          (checked ? "bg-brand-500" : "bg-ink-600")
        }
      >
        <span
          className={
            "absolute top-0.5 h-4 w-4 rounded-full bg-white transition " +
            (checked ? "left-4" : "left-0.5")
          }
        />
      </span>
      {label}
    </button>
  );
}
