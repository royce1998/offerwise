import type { Offer, OfferResult, Settings, YearBreakdown, Scenario } from "../types";
import { getLocation } from "../data/locations";
import { totalTax } from "./tax";

// Scenario multiplier applied to equity growth / exit assumptions.
export function scenarioMult(s: Scenario): number {
  return s === "conservative" ? 0.4 : s === "optimistic" ? 1.6 : 1.0;
}

function vestFractionForYear(offer: Offer, year: number): number {
  const sched = offer.vestSchedule;
  const idx = year - 1;
  return idx < sched.length ? (sched[idx] ?? 0) / 100 : 0;
}

// Annualized expected value of a private-company option grant over horizon.
export function optionsExpectedValue(offer: Offer, settings: Settings): number {
  const m = scenarioMult(settings.scenario);
  const effectiveExit = offer.exitPPS * m;
  const gainPerShare = Math.max(0, effectiveExit - offer.strikePrice);
  const afterDilution = gainPerShare * (1 - offer.dilutionPct / 100);
  const vestedFraction = offer.vestSchedule
    .slice(0, settings.years)
    .reduce((a, b) => a + b, 0) / 100;
  return offer.numOptions * afterDilution * vestedFraction;
}

export function computeOffer(offer: Offer, settings: Settings): OfferResult {
  const loc = getLocation(offer.locationId);
  const m = scenarioMult(settings.scenario);
  const years: YearBreakdown[] = [];

  const optionsEV = offer.equityKind === "options" ? optionsExpectedValue(offer, settings) : 0;

  for (let y = 1; y <= settings.years; y++) {
    const base = offer.base * Math.pow(1 + offer.annualRaisePct / 100, y - 1);
    const bonus = base * (offer.targetBonusPct / 100);
    const signOn = y === 1 ? offer.signOnY1 : y === 2 ? offer.signOnY2 : 0;

    let equity = 0;
    if (offer.equityKind === "rsu") {
      const growth = Math.pow(1 + (offer.equityGrowthPct / 100) * m, y - 1);
      equity = offer.equityGrantValue * vestFractionForYear(offer, y) * growth;
    } else if (offer.equityKind === "options") {
      // Spread expected value across the vesting horizon.
      equity = optionsEV / settings.years;
    }

    const benefits =
      base * (offer.match401kPct / 100) + offer.otherPerksAnnual;

    // Only cash + RSU vests are taxed as wages. Options EV shown pre-tax (est.).
    const wageIncome = base + bonus + signOn + (offer.equityKind === "rsu" ? equity : 0);
    const tax = settings.adjustTax ? totalTax(wageIncome, settings.filing, loc.stateTax) : 0;

    const gross = base + bonus + signOn + equity + benefits;
    const net = base + bonus + signOn + equity - tax + benefits;

    years.push({ year: y, base, bonus, signOn, equity, benefits, gross, net });
  }

  const totalGross = years.reduce((a, y) => a + y.gross, 0);
  const totalNet = years.reduce((a, y) => a + y.net, 0);
  const avgAnnualGross = totalGross / settings.years;
  const colFactor = settings.adjustCOL ? loc.col / 100 : 1;
  const colAdjustedNet = totalNet / colFactor;

  const totalWages = years.reduce(
    (a, y) => a + y.base + y.bonus + y.signOn + (offer.equityKind === "rsu" ? y.equity : 0),
    0
  );
  const totalTaxPaid = totalWages - years.reduce(
    (a, y) => a + y.base + y.bonus + y.signOn + (offer.equityKind === "rsu" ? y.equity : 0) - 0,
    0
  );
  // effective tax rate computed from gross vs net on taxed portion
  const taxedGross = years.reduce(
    (a, y) => a + y.base + y.bonus + y.signOn + (offer.equityKind === "rsu" ? y.equity : 0),
    0
  );
  const taxedNet = years.reduce(
    (a, y) =>
      a +
      y.base +
      y.bonus +
      y.signOn +
      (offer.equityKind === "rsu" ? y.equity : 0) -
      (settings.adjustTax ? totalTax(y.base + y.bonus + y.signOn + (offer.equityKind === "rsu" ? y.equity : 0), settings.filing, loc.stateTax) : 0),
    0
  );
  const effectiveTaxRate = taxedGross > 0 ? 1 - taxedNet / taxedGross : 0;

  // avoid unused var lint
  void totalTaxPaid;

  return {
    offer,
    years,
    totalGross,
    totalNet,
    avgAnnualGross,
    colAdjustedNet,
    effectiveTaxRate,
    equityExpectedValue: optionsEV,
  };
}

export function computeAll(offers: Offer[], settings: Settings): OfferResult[] {
  return offers.map((o) => computeOffer(o, settings));
}

export function fmtUSD(n: number, compact = false): string {
  if (compact) {
    if (Math.abs(n) >= 1_000_000)
      return "$" + (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1) + "M";
    if (Math.abs(n) >= 1_000)
      return "$" + Math.round(n / 1000) + "k";
  }
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}
