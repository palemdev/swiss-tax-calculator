# Swiss Tax Calculator

A comprehensive frontend-only tax and budget calculator for Swiss residents. Calculate federal, cantonal, and municipal taxes, compare tax burdens across municipalities, and plan your budget with cost of living data.

## Features

### Tax Calculator
- Progressive tax bracket calculations for federal and cantonal taxes
- Support for single and married tariffs (Grundtarif / Verheiratetentarif)
- Municipal tax multipliers
- Church tax calculations by religion (Catholic, Protestant, Christ-Catholic)
- Wealth tax calculations with canton-specific allowances
- Self-employment income support with AHV/IV/EO calculations
- Canton-specific deductions (dual-earner, rent, childcare, education)
- Pillar 2 and Pillar 3a contribution handling

### Tax Comparison
- Compare tax burden across all municipalities
- Ranking by total tax, effective rate, or net income
- Visual charts for easy comparison

### Budget Calculator
- Comprehensive budget planning with expense categories
- Cost of living data by canton (rent, healthcare, childcare)
- Compare disposable income across municipalities (taxes + cost of living)
- Budget suggestions and guidelines

### Visualizations
- Tax distribution pie charts
- Marginal rate charts
- Wealth tax rate comparisons
- Marriage penalty analysis
- Income breakdown charts

## Supported Cantons

- Zürich (ZH)
- Zug (ZG)
- Schwyz (SZ)

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Type-check and build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Project Structure

```
src/
├── components/       # React components
│   ├── budget/       # Budget calculator components
│   ├── charts/       # Visualization components
│   ├── chatbot/      # AI chatbot (optional)
│   ├── common/       # Reusable UI components
│   ├── comparison/   # Tax comparison components
│   ├── forms/        # Input forms
│   ├── layout/       # Layout components
│   └── results/      # Tax result display
├── context/          # React Context providers
├── data/             # Tax data and configurations
│   ├── cantons/      # Canton-specific tax configs
│   └── costOfLiving/ # Cost of living data
├── pages/            # Page components
├── services/         # Calculation engines
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Adding New Cantons

1. Create `src/data/cantons/{canton}.ts` with `CantonalTaxConfig` and municipalities array
2. Include `wealthTax` config if applicable
3. Export from `src/data/cantons/index.ts`
4. Add cost of living data in `src/data/costOfLiving/{canton}.ts`

## Disclaimer

This calculator is for informational purposes only. Please consult a tax professional for official tax advice.
