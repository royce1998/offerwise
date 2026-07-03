# OfferWise 💰⚖️

**Compare tech job offers by their _real_ take-home value.**

> Live app → **https://royce1998.github.io/offerwise/**

Base salary is the easy part. The hard part is comparing a $210k + big-RSU offer
in San Francisco against a $185k + startup-options offer in Austin — once you
account for vesting schedules, equity growth, sign-on bonuses, 401k match,
federal + state + FICA taxes, and cost of living.

**OfferWise does that math for you.** It's a fast, private, open-source
calculator that turns messy offer letters into a single honest number: the
offer that actually leaves you with the most.

![OfferWise](https://img.shields.io/badge/live-royce1998.github.io%2Fofferwise-18b866) ![license](https://img.shields.io/badge/license-MIT-blue) ![built with](https://img.shields.io/badge/React%20+%20Vite%20+%20TS-informational)

---

## Why this exists (the levels.fyi insight)

[levels.fyi](https://levels.fyi) started in 2017 as a dead-simple tool that
mapped equivalent job levels across companies (Google L5 ≈ Meta E5 ≈ Amazon
SDE II). It exploded because it attacked **information asymmetry** — engineers
simply didn't know what fair pay looked like. Crowdsourced, verified data
created network effects, and it grew into a business on negotiation services,
a job board, and enterprise data.

But there's a gap levels.fyi never fully closed: once you _have_ competing
offers, **comparing them apples-to-apples is genuinely hard** — especially
modeling RSUs, private-startup stock options (strike price, dilution, exit
scenarios), sign-on clawbacks, and location-adjusted take-home.

OfferWise focuses on exactly that decision moment.

## Features

- **Compare up to 4 offers** side by side.
- **Full package modeling** — base, target bonus, annual raises, sign-on
  (year 1 & 2), RSUs with custom vesting schedules & growth assumptions,
  **startup stock options** (strike, 409A, expected exit, dilution), 401k
  match, and perks.
- **Real take-home** — estimated 2025 US federal + state + FICA taxes.
- **Cost-of-living adjustment** across 24 metros (SF, NYC, Seattle, Austin,
  London, Bangalore, remote, …).
- **Equity outlook scenarios** — conservative / expected / optimistic multipliers
  on equity growth and startup exits.
- **Market benchmarks** — total-comp ranges by company & level (Google, Meta,
  Amazon, OpenAI, Nvidia, Stripe, …) so you can gauge how competitive an offer is.
- **Charts** — annual comp breakdown + cumulative comp over your horizon.
- **100% private** — everything runs in your browser; nothing is uploaded.
- **Shareable links** — the scenario is encoded _into the URL itself_, so
  sharing needs no backend and no account.

## Tech

React 19 · TypeScript · Vite · Tailwind CSS · Recharts · lucide-react.
No backend, no database, no tracking. Static site deployed to GitHub Pages.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173/offerwise/
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and
publishes to GitHub Pages automatically.

## Disclaimer

OfferWise provides **estimates for guidance only** — not financial, tax, or
legal advice. Tax logic uses simplified 2025 US assumptions; benchmark and
cost-of-living figures are approximate and community-sourced. Verify with a
professional before making decisions.

## License

MIT © royce1998
