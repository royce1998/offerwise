import type { AppState, Offer, Settings } from "../types";

export const OFFER_COLORS = ["#18b866", "#3b82f6", "#f59e0b", "#ec4899"];

let seq = 0;
export function makeOffer(partial: Partial<Offer> = {}): Offer {
  seq += 1;
  const color = OFFER_COLORS[(seq - 1) % OFFER_COLORS.length];
  return {
    id: Math.random().toString(36).slice(2, 9),
    company: partial.company ?? "New Offer",
    role: partial.role ?? "Software Engineer",
    level: partial.level ?? "",
    locationId: partial.locationId ?? "remote-us",
    color: partial.color ?? color,
    base: partial.base ?? 180000,
    signOnY1: partial.signOnY1 ?? 25000,
    signOnY2: partial.signOnY2 ?? 0,
    targetBonusPct: partial.targetBonusPct ?? 15,
    annualRaisePct: partial.annualRaisePct ?? 3,
    equityKind: partial.equityKind ?? "rsu",
    equityGrantValue: partial.equityGrantValue ?? 400000,
    vestSchedule: partial.vestSchedule ?? [25, 25, 25, 25],
    equityGrowthPct: partial.equityGrowthPct ?? 8,
    numOptions: partial.numOptions ?? 20000,
    strikePrice: partial.strikePrice ?? 2,
    currentPPS: partial.currentPPS ?? 5,
    exitPPS: partial.exitPPS ?? 25,
    dilutionPct: partial.dilutionPct ?? 20,
    match401kPct: partial.match401kPct ?? 4,
    otherPerksAnnual: partial.otherPerksAnnual ?? 3000,
  };
}

export const DEFAULT_SETTINGS: Settings = {
  years: 4,
  filing: "single",
  scenario: "expected",
  adjustCOL: true,
  adjustTax: true,
};

export function defaultState(): AppState {
  return {
    offers: [
      makeOffer({
        company: "BigTech Inc.",
        level: "Senior (L5)",
        locationId: "sf",
        base: 210000,
        signOnY1: 50000,
        targetBonusPct: 18,
        equityKind: "rsu",
        equityGrantValue: 720000,
        equityGrowthPct: 10,
      }),
      makeOffer({
        company: "Rocket Startup",
        level: "Senior",
        locationId: "austin",
        base: 185000,
        signOnY1: 20000,
        targetBonusPct: 0,
        equityKind: "options",
        numOptions: 40000,
        strikePrice: 1.5,
        currentPPS: 6,
        exitPPS: 40,
        dilutionPct: 25,
        match401kPct: 0,
        otherPerksAnnual: 1500,
      }),
    ],
    settings: DEFAULT_SETTINGS,
  };
}

const LS_KEY = "offerwise:v1";

export function saveLocal(state: AppState) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function loadLocal(): AppState | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as AppState) : null;
  } catch {
    return null;
  }
}

// --- URL sharing (client-side, no backend) ---
function toB64(s: string): string {
  return btoa(unescape(encodeURIComponent(s)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
function fromB64(s: string): string {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  return decodeURIComponent(
    escape(atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad))
  );
}

export function encodeState(state: AppState): string {
  return toB64(JSON.stringify(state));
}

export function decodeState(hash: string): AppState | null {
  try {
    const s = JSON.parse(fromB64(hash)) as AppState;
    if (!s.offers || !Array.isArray(s.offers)) return null;
    return s;
  } catch {
    return null;
  }
}

export function readStateFromUrl(): AppState | null {
  const params = new URLSearchParams(window.location.search);
  const d = params.get("d");
  if (d) return decodeState(d);
  return null;
}

export function buildShareUrl(state: AppState): string {
  const base = window.location.origin + window.location.pathname;
  return base + "?d=" + encodeState(state);
}
