import type { FilingStatus } from "../types";

// 2025 U.S. federal parameters (approximations for estimation only).
interface Bracket {
  upTo: number;
  rate: number;
}

const FEDERAL: Record<FilingStatus, Bracket[]> = {
  single: [
    { upTo: 11925, rate: 0.1 },
    { upTo: 48475, rate: 0.12 },
    { upTo: 103350, rate: 0.22 },
    { upTo: 197300, rate: 0.24 },
    { upTo: 250525, rate: 0.32 },
    { upTo: 626350, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
  married: [
    { upTo: 23850, rate: 0.1 },
    { upTo: 96950, rate: 0.12 },
    { upTo: 206700, rate: 0.22 },
    { upTo: 394600, rate: 0.24 },
    { upTo: 501050, rate: 0.32 },
    { upTo: 751600, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
};

const STD_DEDUCTION: Record<FilingStatus, number> = {
  single: 15000,
  married: 30000,
};

const SS_WAGE_BASE = 176100; // 2025 Social Security cap
const SS_RATE = 0.062;
const MEDICARE_RATE = 0.0145;
const ADDL_MEDICARE_RATE = 0.009;
const ADDL_MEDICARE_THRESHOLD: Record<FilingStatus, number> = {
  single: 200000,
  married: 250000,
};

export function federalTax(income: number, filing: FilingStatus): number {
  const taxable = Math.max(0, income - STD_DEDUCTION[filing]);
  let tax = 0;
  let prev = 0;
  for (const b of FEDERAL[filing]) {
    if (taxable > prev) {
      const slice = Math.min(taxable, b.upTo) - prev;
      tax += slice * b.rate;
      prev = b.upTo;
    } else break;
  }
  return tax;
}

export function ficaTax(wages: number, filing: FilingStatus): number {
  const ss = Math.min(wages, SS_WAGE_BASE) * SS_RATE;
  let medicare = wages * MEDICARE_RATE;
  const threshold = ADDL_MEDICARE_THRESHOLD[filing];
  if (wages > threshold) medicare += (wages - threshold) * ADDL_MEDICARE_RATE;
  return ss + medicare;
}

// Total tax on a year's wage income (base + bonus + signon + vested RSUs).
export function totalTax(
  wages: number,
  filing: FilingStatus,
  stateRate: number
): number {
  const fed = federalTax(wages, filing);
  const fica = ficaTax(wages, filing);
  const state = Math.max(0, wages - STD_DEDUCTION[filing]) * stateRate;
  return fed + fica + state;
}
