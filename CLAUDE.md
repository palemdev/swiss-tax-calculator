# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Type-check with tsc and build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

## Architecture

This is a frontend-only Swiss tax calculator built with React, TypeScript, and Tailwind CSS. It calculates federal, cantonal, and municipal taxes for Swiss residents.

### Core Layers

**Tax Calculation Engine** (`src/services/taxCalculator.ts`)
- `calculateTax()` - Main entry point that computes full tax breakdown
- `calculateDeductions()` - Applies canton-specific deduction limits
- `calculateFederalTax()`, `calculateCantonalTax()`, `calculateMunicipalTax()`, `calculateChurchTax()` - Individual tax level calculations
- Uses progressive bracket system where each bracket has `minIncome`, `maxIncome`, `baseAmount`, and `rate`

**Tax Data** (`src/data/`)
- `federalTax.ts` - Federal tax brackets for single/married tariffs
- `cantons/*.ts` - Each canton file exports a `CantonalTaxConfig` and array of `Municipality` objects
- `cantons/index.ts` - Aggregates all cantons and provides lookup functions (`getCantonConfig`, `getMunicipalityById`)
- `constants.ts` - Pillar 3a limits, tax colors, civil status/religion options

**State Management** (`src/context/TaxContext.tsx`)
- React Context with useReducer pattern
- Auto-recalculates results when inputs change (300ms debounce)
- Provides `useTax()` hook for accessing state and actions
- Handles comparison calculations across all municipalities

### Key Types (`src/types/index.ts`)

- `TaxBracket` - Progressive tax bracket definition
- `CantonalTaxConfig` - Canton tariffs, multiplier, and deduction limits
- `Municipality` - Municipal tax multiplier and church tax rates
- `TaxpayerProfile`, `IncomeDetails`, `DeductionInputs` - User input types
- `TaxBreakdown`, `DeductionBreakdown` - Calculation results

### Swiss Tax System Notes

- **Tariffs**: Single (Grundtarif) vs Married (Verheiratetentarif) use different brackets
- **Multipliers**: Cantonal and municipal taxes apply multipliers to base tax (e.g., 119% for Zürich city)
- **Church Tax**: Based on religion, calculated as percentage of cantonal base tax
- **Pillar 3a**: CHF 7,056 limit with employer pension, CHF 35,280 without

## Adding New Cantons

1. Create `src/data/cantons/{canton}.ts` with `CantonalTaxConfig` and municipalities array
2. Export from `src/data/cantons/index.ts`
3. Add to `cantonConfigs`, `municipalitiesByCantonCode`, and `cantonList`

## Visualization

Charts use Recharts library. Tax colors are defined in `src/data/constants.ts` as `TAX_COLORS`.
- The dev server is already running typicall when Claude Code runs