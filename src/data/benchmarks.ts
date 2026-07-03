// Approximate market total-compensation benchmarks for software engineers,
// aggregated from public community-sourced ranges (USD/yr, US metro).
// These are ballpark medians for guidance — not guarantees.

export interface BenchLevel {
  level: string;
  title: string;
  base: number;
  stock: number; // annualized equity
  bonus: number;
}

export interface CompanyBench {
  company: string;
  ladder: string; // level naming
  levels: BenchLevel[];
}

export const BENCHMARKS: CompanyBench[] = [
  {
    company: "Google",
    ladder: "L3–L6",
    levels: [
      { level: "L3", title: "SWE II", base: 145000, stock: 45000, bonus: 22000 },
      { level: "L4", title: "SWE III", base: 175000, stock: 90000, bonus: 30000 },
      { level: "L5", title: "Senior SWE", base: 210000, stock: 180000, bonus: 42000 },
      { level: "L6", title: "Staff SWE", base: 255000, stock: 320000, bonus: 60000 },
    ],
  },
  {
    company: "Meta",
    ladder: "E3–E6",
    levels: [
      { level: "E3", title: "SWE", base: 150000, stock: 55000, bonus: 15000 },
      { level: "E4", title: "SWE", base: 185000, stock: 110000, bonus: 25000 },
      { level: "E5", title: "Senior SWE", base: 220000, stock: 220000, bonus: 44000 },
      { level: "E6", title: "Staff SWE", base: 260000, stock: 400000, bonus: 65000 },
    ],
  },
  {
    company: "Amazon",
    ladder: "SDE I–Principal",
    levels: [
      { level: "L4", title: "SDE I", base: 135000, stock: 30000, bonus: 8000 },
      { level: "L5", title: "SDE II", base: 175000, stock: 90000, bonus: 12000 },
      { level: "L6", title: "SDE III", base: 210000, stock: 190000, bonus: 20000 },
      { level: "L7", title: "Principal SDE", base: 245000, stock: 380000, bonus: 35000 },
    ],
  },
  {
    company: "Apple",
    ladder: "ICT2–ICT5",
    levels: [
      { level: "ICT2", title: "SWE", base: 150000, stock: 40000, bonus: 15000 },
      { level: "ICT3", title: "SWE", base: 185000, stock: 95000, bonus: 25000 },
      { level: "ICT4", title: "Senior SWE", base: 225000, stock: 200000, bonus: 40000 },
      { level: "ICT5", title: "Staff SWE", base: 265000, stock: 350000, bonus: 55000 },
    ],
  },
  {
    company: "Microsoft",
    ladder: "59–65",
    levels: [
      { level: "59", title: "SWE", base: 130000, stock: 25000, bonus: 15000 },
      { level: "62", title: "SWE II", base: 165000, stock: 60000, bonus: 22000 },
      { level: "63", title: "Senior SWE", base: 195000, stock: 110000, bonus: 32000 },
      { level: "65", title: "Principal SWE", base: 235000, stock: 240000, bonus: 50000 },
    ],
  },
  {
    company: "Netflix",
    ladder: "Single ladder",
    levels: [
      { level: "L4", title: "SWE", base: 300000, stock: 0, bonus: 0 },
      { level: "L5", title: "Senior SWE", base: 450000, stock: 0, bonus: 0 },
      { level: "L6", title: "Staff SWE", base: 600000, stock: 0, bonus: 0 },
    ],
  },
  {
    company: "OpenAI",
    ladder: "IC3–IC5",
    levels: [
      { level: "IC3", title: "MTS", base: 245000, stock: 200000, bonus: 0 },
      { level: "IC4", title: "Senior MTS", base: 300000, stock: 500000, bonus: 0 },
      { level: "IC5", title: "Staff MTS", base: 360000, stock: 800000, bonus: 0 },
    ],
  },
  {
    company: "Stripe",
    ladder: "L1–L3",
    levels: [
      { level: "L1", title: "SWE", base: 175000, stock: 90000, bonus: 0 },
      { level: "L2", title: "SWE", base: 210000, stock: 150000, bonus: 0 },
      { level: "L3", title: "Senior SWE", base: 245000, stock: 240000, bonus: 0 },
    ],
  },
  {
    company: "Nvidia",
    ladder: "IC2–IC5",
    levels: [
      { level: "IC2", title: "SWE", base: 150000, stock: 60000, bonus: 18000 },
      { level: "IC3", title: "SWE", base: 185000, stock: 130000, bonus: 28000 },
      { level: "IC4", title: "Senior SWE", base: 225000, stock: 280000, bonus: 42000 },
      { level: "IC5", title: "Principal", base: 275000, stock: 500000, bonus: 60000 },
    ],
  },
  {
    company: "Databricks",
    ladder: "L3–L5",
    levels: [
      { level: "L3", title: "SWE", base: 170000, stock: 80000, bonus: 0 },
      { level: "L4", title: "Senior SWE", base: 200000, stock: 160000, bonus: 0 },
      { level: "L5", title: "Staff SWE", base: 235000, stock: 300000, bonus: 0 },
    ],
  },
  {
    company: "Uber",
    ladder: "L4–L6",
    levels: [
      { level: "L4", title: "SWE II", base: 165000, stock: 70000, bonus: 15000 },
      { level: "L5", title: "Senior SWE", base: 200000, stock: 150000, bonus: 25000 },
      { level: "L6", title: "Staff SWE", base: 235000, stock: 290000, bonus: 40000 },
    ],
  },
  {
    company: "Startup (Series B, mid)",
    ladder: "Typical",
    levels: [
      { level: "Mid", title: "SWE", base: 150000, stock: 40000, bonus: 0 },
      { level: "Senior", title: "Senior SWE", base: 185000, stock: 70000, bonus: 0 },
      { level: "Staff", title: "Staff SWE", base: 215000, stock: 110000, bonus: 0 },
    ],
  },
];

export function benchTotal(l: BenchLevel): number {
  return l.base + l.stock + l.bonus;
}
