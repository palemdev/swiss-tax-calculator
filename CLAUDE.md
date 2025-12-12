# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Type-check with tsc and build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

**Important:** Always run `npm run lint` after making code changes to ensure there are no linting errors. The project uses strict ESLint rules including:
- No `any` types (`@typescript-eslint/no-explicit-any`)
- No components created during render (`react-hooks/static-components`)
- Exhaustive deps for React hooks (`react-hooks/exhaustive-deps`)

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

- **Tariffs**: Single (Grundtarif) vs Married (Verheiratetentarif/Mehrpersonentarif) use different brackets
- **Multipliers**: Cantonal and municipal taxes apply multipliers to base tax (e.g., 119% for Zürich city)
- **Church Tax**: Based on religion, calculated as percentage of cantonal base tax
- **Wealth Tax**: Optional per canton, uses progressive brackets with allowances for marital status and children
- **Pillar 3a**: CHF 7,056 limit with employer pension, CHF 35,280 without

## Adding New Cantons

1. Create `src/data/cantons/{canton}.ts` with `CantonalTaxConfig` and municipalities array
2. Include `wealthTax` config if the canton has wealth tax (optional - some cantons don't)
3. Export from `src/data/cantons/index.ts`
4. Add to `cantonConfigs`, `municipalitiesByCantonCode`, and `cantonList`

## Component Patterns

**Forms** use react-hook-form with Zod validation schemas. Form state syncs to TaxContext via `updateTaxpayer`, `updateIncome`, `updateDeductions`.

**Pages** (`src/pages/`)
- `CalculatorPage` - Main tax calculation with forms and results
- `ComparisonPage` - Compare taxes across all municipalities
- `BudgetPage` - Budget calculator with cost of living comparison

## Budget Calculator

The budget calculator integrates with the tax calculator to provide comprehensive financial planning.

**Budget Calculation Engine** (`src/services/budgetCalculator.ts`)
- `calculateBudget()` - Computes budget breakdown using net income from tax calculation
- `calculateBudgetComparison()` - Compares disposable income across municipalities (taxes + cost of living)
- `getBudgetSuggestions()` - Generates budget improvement suggestions

**Cost of Living Data** (`src/data/costOfLiving/`)
- `{canton}.ts` - Each canton file exports a `CantonCostOfLiving` with rent, health insurance, childcare costs, and cost indices
- `index.ts` - Aggregates data and provides lookup functions (`getCostOfLiving`, `getAverageRent`, etc.)

**Budget State Management** (`src/context/BudgetContext.tsx`)
- Integrates with TaxContext (pulls net income automatically)
- Manages budget inputs, results, and comparison calculations
- Provides `useBudget()` hook

**Key Budget Types** (`src/types/budget.ts`)
- `CantonCostOfLiving` - Cantonal cost data (rent, health insurance, childcare, cost indices)
- `BudgetInputs` - User expense inputs (housing, transport, food, savings, etc.)
- `BudgetBreakdown` - Calculation results with categories and guidelines
- `BudgetComparisonResult` - Results combining taxes and cost of living

### Adding Cost of Living for New Cantons

1. Create `src/data/costOfLiving/{canton}.ts` with `CantonCostOfLiving` data
2. Export from `src/data/costOfLiving/index.ts`
3. Add to `costOfLivingByCantonCode` record

## Visualization

Charts use Recharts library. Tax colors are defined in `src/data/constants.ts` as `TAX_COLORS`.

Note: The dev server is typically already running when Claude Code runs.