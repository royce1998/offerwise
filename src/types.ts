export type EquityKind = "none" | "rsu" | "options";
export type FilingStatus = "single" | "married";
export type Scenario = "conservative" | "expected" | "optimistic";

export interface Offer {
  id: string;
  company: string;
  role: string;
  level: string;
  locationId: string;
  color: string;

  // Cash
  base: number; // annual base salary
  signOnY1: number; // signing bonus paid in year 1
  signOnY2: number; // signing bonus paid in year 2
  targetBonusPct: number; // annual target bonus as % of base
  annualRaisePct: number; // expected annual base raise %

  // Equity
  equityKind: EquityKind;
  // RSU / public: total grant value (at grant, in $)
  equityGrantValue: number;
  vestSchedule: number[]; // percent vesting each year, length = vestYears
  equityGrowthPct: number; // expected annual stock price growth %

  // Options / private startup
  numOptions: number;
  strikePrice: number; // $ per share
  currentPPS: number; // current preferred / 409A share price
  exitPPS: number; // expected exit price per share
  dilutionPct: number; // total future dilution before exit %

  // Benefits
  match401kPct: number; // employer 401k match as % of base
  otherPerksAnnual: number; // annual $ value of other perks
}

export interface Settings {
  years: number; // comparison horizon (2-6)
  filing: FilingStatus;
  scenario: Scenario;
  adjustCOL: boolean; // cost-of-living adjust
  adjustTax: boolean; // show after-tax
}

export interface AppState {
  offers: Offer[];
  settings: Settings;
}

// Per-year computed breakdown for one offer
export interface YearBreakdown {
  year: number;
  base: number;
  bonus: number;
  signOn: number;
  equity: number;
  benefits: number;
  gross: number;
  net: number; // after-tax
}

export interface OfferResult {
  offer: Offer;
  years: YearBreakdown[];
  totalGross: number;
  totalNet: number;
  avgAnnualGross: number;
  colAdjustedNet: number; // net divided by COL factor
  effectiveTaxRate: number;
  equityExpectedValue: number; // for private options: EV of the grant
}
