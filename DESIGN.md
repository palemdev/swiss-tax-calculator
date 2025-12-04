# Swiss Tax Calculator - Design Document

## 1. Overview

### 1.1 Purpose
A comprehensive frontend-only React/TypeScript application that calculates Swiss taxes at federal, cantonal, and municipal levels for individuals and married couples, including detailed deductions and visualizations.

### 1.2 Key Features
- **Multi-level tax calculation**: Federal, cantonal, and municipal taxes
- **Civil status support**: Singles and married couples
- **Comprehensive deductions**: Professional expenses, insurance, children, etc.
- **Interactive visualizations**: Charts showing tax breakdown, comparisons, marginal rates
- **Canton comparison**: Compare tax burden across different cantons/municipalities
- **Data persistence**: Local storage for saving calculations

---

## 2. Swiss Tax System Overview

### 2.1 Tax Structure
Swiss taxes are levied at three levels:

1. **Federal Tax (Bundessteuer/Impôt fédéral direct)**
   - Uniform across Switzerland
   - Progressive rates based on taxable income
   - Different tariffs for singles vs. married couples

2. **Cantonal Tax (Kantonssteuer/Impôt cantonal)**
   - Base rate varies by canton
   - Applied to taxable income using cantonal tariff
   - Multiplied by cantonal tax multiplier (100% = base rate)

3. **Municipal Tax (Gemeindesteuer/Impôt communal)**
   - Based on cantonal tax calculation
   - Multiplied by municipal tax multiplier
   - Varies significantly between municipalities

4. **Church Tax (Kirchensteuer/Impôt ecclésiastique)**
   - Optional based on religious affiliation
   - Percentage of cantonal/municipal tax

### 2.2 Tax Tariffs
- **Tariff A (Grundtarif)**: For singles, separated, divorced, widowed without children
- **Tariff B (Verheiratetentarif)**: For married couples (combined income)
- **Tariff H (Einelterntarif)**: For single parents (some cantons)

### 2.3 Common Deductions
1. **Professional Expenses**
   - Commuting costs (max limits apply)
   - Meals away from home
   - Professional tools and equipment
   - Further education related to profession

2. **Insurance Premiums**
   - Health insurance (AHV/IV/EO)
   - Life insurance
   - Accident insurance

3. **Pension Contributions**
   - Pillar 2 (BVG/LPP) - employer pension
   - Pillar 3a - private pension (max CHF 7,056 for employed with pension, CHF 35,280 without)

4. **Personal Deductions**
   - Personal allowance
   - Married couple allowance
   - Child deductions
   - Childcare costs

5. **Other Deductions**
   - Debt interest
   - Charitable donations
   - Medical expenses (above threshold)
   - Disability-related costs

---

## 3. Data Architecture

### 3.1 Core Data Models

```typescript
// Tax Configuration Types
interface FederalTaxBracket {
  minIncome: number;
  maxIncome: number | null;
  baseAmount: number;      // Tax on income up to minIncome
  rate: number;            // Marginal rate for this bracket (percentage)
}

interface FederalTaxTariff {
  tariffType: 'single' | 'married';
  brackets: FederalTaxBracket[];
  year: number;
}

interface CantonalTaxConfig {
  cantonCode: string;      // e.g., "ZH", "BE", "GE"
  cantonName: string;
  year: number;
  taxMultiplier: number;   // Cantonal multiplier (e.g., 100 = 100%)
  brackets: TaxBracket[];  // Cantonal-specific brackets
  tariffs: {
    single: TaxBracket[];
    married: TaxBracket[];
  };
  deductionLimits: CantonalDeductionLimits;
}

interface Municipality {
  id: string;
  name: string;
  cantonCode: string;
  taxMultiplier: number;   // Municipal multiplier
  churchTaxMultipliers: {
    catholic: number;
    protestant: number;
    other: number;
  };
}

interface CantonalDeductionLimits {
  professionalExpenses: {
    flatRate: number;
    maxCommuting: number;
    maxMeals: number;
  };
  insurancePremiums: {
    single: number;
    married: number;
    perChild: number;
  };
  pillar3a: {
    withPension: number;
    withoutPension: number;
  };
  childDeduction: number;
  childcareDeduction: number;
  marriedDeduction: number;
  socialDeductions: {
    single: number;
    married: number;
  };
}
```

### 3.2 User Input Models

```typescript
interface TaxpayerProfile {
  civilStatus: 'single' | 'married' | 'divorced' | 'widowed' | 'separated';
  canton: string;
  municipality: string;
  religion: 'none' | 'catholic' | 'protestant' | 'other';
  hasChildren: boolean;
  numberOfChildren: number;
  childrenAges: number[];   // For determining applicable deductions
}

interface IncomeDetails {
  primaryIncome: number;           // Main employment income
  secondaryIncome: number;         // Spouse income (if married)
  selfEmploymentIncome: number;
  investmentIncome: number;        // Dividends, interest
  rentalIncome: number;
  otherIncome: number;
  foreignIncome: number;
}

interface DeductionInputs {
  // Professional Expenses
  actualCommutingCosts: number;
  usesFlatRateProfessional: boolean;
  mealExpenses: number;
  professionalEquipment: number;
  furtherEducation: number;

  // Insurance
  healthInsurancePremiums: number;
  lifeInsurancePremiums: number;
  accidentInsurancePremiums: number;

  // Pension
  pillar2Contributions: number;    // Usually on salary slip
  pillar3aContributions: number;
  hasEmployerPension: boolean;

  // Personal
  childcareExpenses: number;
  alimonyPaid: number;

  // Other
  debtInterest: number;
  charitableDonations: number;
  medicalExpenses: number;
  disabilityExpenses: number;
}

interface TaxCalculationInput {
  year: number;
  taxpayer: TaxpayerProfile;
  income: IncomeDetails;
  deductions: DeductionInputs;
}
```

### 3.3 Calculation Result Models

```typescript
interface DeductionBreakdown {
  professionalExpenses: {
    commuting: number;
    meals: number;
    equipment: number;
    education: number;
    total: number;
  };
  insurancePremiums: {
    health: number;
    life: number;
    accident: number;
    total: number;
  };
  pensionContributions: {
    pillar2: number;
    pillar3a: number;
    total: number;
  };
  personalDeductions: {
    married: number;
    children: number;
    childcare: number;
    social: number;
    total: number;
  };
  otherDeductions: {
    debtInterest: number;
    donations: number;
    medical: number;
    disability: number;
    alimony: number;
    total: number;
  };
  totalDeductions: number;
}

interface TaxBreakdown {
  grossIncome: number;
  totalDeductions: number;
  taxableIncome: number;

  federalTax: {
    taxableIncome: number;
    taxAmount: number;
    effectiveRate: number;
    marginalRate: number;
  };

  cantonalTax: {
    baseTax: number;
    multiplier: number;
    taxAmount: number;
    effectiveRate: number;
  };

  municipalTax: {
    baseTax: number;       // Same as cantonal base
    multiplier: number;
    taxAmount: number;
    effectiveRate: number;
  };

  churchTax: {
    applicable: boolean;
    baseTax: number;
    multiplier: number;
    taxAmount: number;
  };

  totalTax: number;
  effectiveRate: number;
  marginalRate: number;
  netIncome: number;
}

interface TaxComparisonResult {
  municipality: Municipality;
  taxBreakdown: TaxBreakdown;
  ranking: number;
  differenceFromCheapest: number;
  differenceFromAverage: number;
}
```

---

## 4. Component Architecture

### 4.1 Application Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── MainLayout.tsx
│   │
│   ├── forms/
│   │   ├── TaxpayerForm.tsx
│   │   ├── IncomeForm.tsx
│   │   ├── DeductionsForm.tsx
│   │   ├── LocationSelector.tsx
│   │   └── FormSection.tsx
│   │
│   ├── results/
│   │   ├── TaxSummary.tsx
│   │   ├── TaxBreakdownCard.tsx
│   │   ├── DeductionSummary.tsx
│   │   └── NetIncomeDisplay.tsx
│   │
│   ├── charts/
│   │   ├── TaxDistributionPie.tsx
│   │   ├── MarginalRateChart.tsx
│   │   ├── CantonComparisonBar.tsx
│   │   ├── IncomeVsTaxLine.tsx
│   │   ├── TaxBracketVisualization.tsx
│   │   └── DeductionImpactChart.tsx
│   │
│   ├── comparison/
│   │   ├── CantonComparison.tsx
│   │   ├── MunicipalityComparison.tsx
│   │   ├── ComparisonTable.tsx
│   │   └── SwissMap.tsx
│   │
│   └── common/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Card.tsx
│       ├── Tooltip.tsx
│       ├── InfoPopover.tsx
│       └── CurrencyInput.tsx
│
├── hooks/
│   ├── useTaxCalculation.ts
│   ├── useDeductions.ts
│   ├── useCantonData.ts
│   ├── useLocalStorage.ts
│   └── useComparison.ts
│
├── services/
│   ├── taxCalculator.ts
│   ├── federalTaxService.ts
│   ├── cantonalTaxService.ts
│   ├── municipalTaxService.ts
│   ├── deductionCalculator.ts
│   └── comparisonService.ts
│
├── data/
│   ├── federalTax2024.ts
│   ├── cantons/
│   │   ├── zurich.ts
│   │   ├── bern.ts
│   │   ├── geneva.ts
│   │   └── ... (all 26 cantons)
│   ├── municipalities/
│   │   └── index.ts
│   └── constants.ts
│
├── types/
│   ├── tax.ts
│   ├── taxpayer.ts
│   ├── deductions.ts
│   ├── results.ts
│   └── index.ts
│
├── utils/
│   ├── formatters.ts
│   ├── validators.ts
│   ├── calculations.ts
│   └── helpers.ts
│
├── context/
│   ├── TaxContext.tsx
│   └── ThemeContext.tsx
│
├── pages/
│   ├── Calculator.tsx
│   ├── Comparison.tsx
│   ├── About.tsx
│   └── Help.tsx
│
└── styles/
    ├── globals.css
    ├── variables.css
    └── components/
```

### 4.2 Main Components

#### Calculator Page (Main View)
```
┌─────────────────────────────────────────────────────────────────┐
│  Header: Swiss Tax Calculator 2024                    [Compare] │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────┐  ┌────────────────────────────────┐ │
│ │   INPUT FORM            │  │   RESULTS                      │ │
│ │                         │  │                                │ │
│ │ ┌─────────────────────┐ │  │  ┌──────────────────────────┐  │ │
│ │ │ Personal Details    │ │  │  │ Tax Summary Card         │  │ │
│ │ │ - Civil Status      │ │  │  │ Total Tax: CHF 45,230    │  │ │
│ │ │ - Canton            │ │  │  │ Effective Rate: 18.2%    │  │ │
│ │ │ - Municipality      │ │  │  │ Net Income: CHF 203,450  │  │ │
│ │ │ - Religion          │ │  │  └──────────────────────────┘  │ │
│ │ │ - Children          │ │  │                                │ │
│ │ └─────────────────────┘ │  │  ┌──────────────────────────┐  │ │
│ │                         │  │  │  Tax Distribution Pie    │  │ │
│ │ ┌─────────────────────┐ │  │  │      ┌───────┐           │  │ │
│ │ │ Income              │ │  │  │     /  Fed   \          │  │ │
│ │ │ - Primary Income    │ │  │  │    │ Cantonal │          │  │ │
│ │ │ - Secondary Income  │ │  │  │     \ Munic  /          │  │ │
│ │ │ - Other Income      │ │  │  │      └───────┘           │  │ │
│ │ └─────────────────────┘ │  │  └──────────────────────────┘  │ │
│ │                         │  │                                │ │
│ │ ┌─────────────────────┐ │  │  ┌──────────────────────────┐  │ │
│ │ │ Deductions          │ │  │  │ Breakdown Table          │  │ │
│ │ │ [Expandable sections]│ │  │  │ Federal:     CHF 12,340 │  │ │
│ │ │ - Professional      │ │  │  │ Cantonal:    CHF 22,450 │  │ │
│ │ │ - Insurance         │ │  │  │ Municipal:   CHF 8,940  │  │ │
│ │ │ - Pension           │ │  │  │ Church:      CHF 1,500  │  │ │
│ │ │ - Personal          │ │  │  └──────────────────────────┘  │ │
│ │ │ - Other             │ │  │                                │ │
│ │ └─────────────────────┘ │  │  ┌──────────────────────────┐  │ │
│ │                         │  │  │ Marginal Rate Chart      │  │ │
│ │ [Calculate Button]      │  │  │ ────────────────────     │  │ │
│ │                         │  │  │        /‾‾‾‾‾            │  │ │
│ └─────────────────────────┘  │  │   ────/                  │  │ │
│                              │  │  /‾‾‾‾                   │  │ │
│                              │  └──────────────────────────┘  │ │
│                              └────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  Deduction Summary: CHF 34,560 total deductions                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Comparison Page
```
┌─────────────────────────────────────────────────────────────────┐
│  Canton/Municipality Comparison                                 │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │  Swiss Map (Interactive)                                    │ │
│ │  [Colored by tax burden]                                    │ │
│ │                    ┌────┐                                   │ │
│ │              ┌────┤ ZH │                                    │ │
│ │         ┌───┤ AG ├────┤                                     │ │
│ │    ┌───┤ SO ├────┤    │                                     │ │
│ │    │BE │    └────┘    │                                     │ │
│ │    └───┘              │                                     │ │
│ │                                                             │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │  Comparison Bar Chart                                       │ │
│ │                                                             │ │
│ │  Zug      ████████ CHF 28,450                              │ │
│ │  Schwyz   ██████████ CHF 32,100                            │ │
│ │  Zurich   ████████████████ CHF 45,230                      │ │
│ │  Geneva   ██████████████████ CHF 52,340                    │ │
│ │  ...                                                        │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │  Detailed Comparison Table                                  │ │
│ │  ───────────────────────────────────────────────────────    │ │
│ │  Canton  │ Fed Tax │ Cant Tax │ Mun Tax │ Total │ Rate    │ │
│ │  ───────────────────────────────────────────────────────    │ │
│ │  Zug     │ 12,340  │ 10,230   │ 5,880   │ 28,450│ 11.4%   │ │
│ │  ...     │ ...     │ ...      │ ...     │ ...   │ ...     │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Visualization Specifications

### 5.1 Chart Library
**Recommended: Recharts**
- React-native, composable
- Good TypeScript support
- Responsive and customizable
- Active maintenance

**Alternative: Chart.js with react-chartjs-2**
- More chart types
- Better performance for large datasets

### 5.2 Chart Specifications

#### Tax Distribution Pie Chart
```typescript
interface TaxDistributionData {
  name: string;        // "Federal", "Cantonal", "Municipal", "Church"
  value: number;       // Tax amount
  color: string;       // Consistent color scheme
  percentage: number;  // Percentage of total
}
```
- Interactive tooltips showing exact amounts
- Legend with percentages
- Responsive sizing

#### Marginal Rate Line Chart
```typescript
interface MarginalRatePoint {
  income: number;
  federalRate: number;
  cantonalRate: number;
  totalRate: number;
  currentPosition?: boolean;  // Highlight user's position
}
```
- X-axis: Income (0 to ~500k CHF)
- Y-axis: Marginal rate (0% to 45%)
- Multiple lines for different tax levels
- Vertical line showing user's current income

#### Canton Comparison Bar Chart
```typescript
interface ComparisonBar {
  location: string;
  federalTax: number;
  cantonalTax: number;
  municipalTax: number;
  churchTax: number;
  total: number;
}
```
- Stacked bars showing tax composition
- Sortable by total or individual components
- Highlight current selection

#### Income vs Tax Progressive Chart
```typescript
interface ProgressivePoint {
  income: number;
  totalTax: number;
  netIncome: number;
  effectiveRate: number;
}
```
- Dual Y-axis: Tax amount and effective rate
- Area chart for tax burden
- Line for effective rate

### 5.3 Swiss Map Visualization
**Options:**
1. **SVG-based map** (Recommended)
   - Use d3-geo with TopoJSON of Swiss cantons
   - Color-coded by tax burden
   - Interactive hover states

2. **Pre-built component**
   - react-simple-maps
   - Custom SVG with defined paths

**Color Scheme:**
- Green (low tax): #22c55e → #16a34a
- Yellow (medium): #eab308 → #ca8a04
- Orange (higher): #f97316 → #ea580c
- Red (high tax): #ef4444 → #dc2626

---

## 6. State Management

### 6.1 Context Structure

```typescript
interface TaxCalculatorState {
  // Input State
  taxpayer: TaxpayerProfile;
  income: IncomeDetails;
  deductions: DeductionInputs;

  // Calculation Results
  results: TaxBreakdown | null;
  deductionBreakdown: DeductionBreakdown | null;

  // Comparison Data
  comparisonResults: TaxComparisonResult[];

  // UI State
  isCalculating: boolean;
  activeSection: 'calculator' | 'comparison' | 'help';
  errors: ValidationError[];

  // History
  savedCalculations: SavedCalculation[];
}

interface TaxCalculatorActions {
  updateTaxpayer: (data: Partial<TaxpayerProfile>) => void;
  updateIncome: (data: Partial<IncomeDetails>) => void;
  updateDeductions: (data: Partial<DeductionInputs>) => void;
  calculate: () => void;
  runComparison: (cantons: string[]) => void;
  saveCalculation: (name: string) => void;
  loadCalculation: (id: string) => void;
  reset: () => void;
}
```

### 6.2 Local Storage Schema
```typescript
interface StoredData {
  version: string;
  lastUpdated: string;
  calculations: SavedCalculation[];
  preferences: UserPreferences;
}

interface SavedCalculation {
  id: string;
  name: string;
  createdAt: string;
  input: TaxCalculationInput;
  results: TaxBreakdown;
}

interface UserPreferences {
  defaultCanton: string;
  defaultMunicipality: string;
  theme: 'light' | 'dark' | 'system';
  showAdvancedDeductions: boolean;
  preferredLanguage: 'en' | 'de' | 'fr' | 'it';
}
```

---

## 7. Tax Calculation Logic

### 7.1 Federal Tax Calculation

```typescript
function calculateFederalTax(
  taxableIncome: number,
  tariff: 'single' | 'married'
): FederalTaxResult {
  const brackets = getFederalBrackets(tariff);
  let tax = 0;
  let marginalRate = 0;

  for (const bracket of brackets) {
    if (taxableIncome > bracket.minIncome) {
      const taxableInBracket = Math.min(
        taxableIncome - bracket.minIncome,
        (bracket.maxIncome || Infinity) - bracket.minIncome
      );

      if (taxableIncome <= (bracket.maxIncome || Infinity)) {
        tax = bracket.baseAmount + (taxableInBracket * bracket.rate / 100);
        marginalRate = bracket.rate;
        break;
      }
    }
  }

  return {
    taxAmount: Math.round(tax * 100) / 100,
    effectiveRate: (tax / taxableIncome) * 100,
    marginalRate
  };
}
```

### 7.2 Cantonal Tax Calculation

```typescript
function calculateCantonalTax(
  taxableIncome: number,
  canton: CantonalTaxConfig,
  tariff: 'single' | 'married'
): CantonalTaxResult {
  // Calculate base tax using cantonal brackets
  const baseTax = calculateBaseTax(taxableIncome, canton.tariffs[tariff]);

  // Apply cantonal multiplier
  const cantonalTax = baseTax * (canton.taxMultiplier / 100);

  return {
    baseTax,
    multiplier: canton.taxMultiplier,
    taxAmount: Math.round(cantonalTax * 100) / 100,
    effectiveRate: (cantonalTax / taxableIncome) * 100
  };
}
```

### 7.3 Deduction Calculation

```typescript
function calculateDeductions(
  input: DeductionInputs,
  profile: TaxpayerProfile,
  limits: CantonalDeductionLimits
): DeductionBreakdown {
  // Professional expenses (capped)
  const professionalExpenses = calculateProfessionalExpenses(input, limits);

  // Insurance (capped by status)
  const insurance = calculateInsuranceDeductions(input, profile, limits);

  // Pension (capped)
  const pension = calculatePensionDeductions(input, limits);

  // Personal deductions (fixed amounts based on status)
  const personal = calculatePersonalDeductions(profile, limits);

  // Other deductions
  const other = calculateOtherDeductions(input, limits);

  return {
    professionalExpenses,
    insurancePremiums: insurance,
    pensionContributions: pension,
    personalDeductions: personal,
    otherDeductions: other,
    totalDeductions: sumAllDeductions(...)
  };
}
```

---

## 8. User Interface Design

### 8.1 Design System

**Colors:**
```css
:root {
  /* Primary - Swiss Red inspired */
  --primary-500: #dc2626;
  --primary-600: #b91c1c;

  /* Neutral */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-700: #374151;
  --gray-900: #111827;

  /* Semantic */
  --success: #22c55e;
  --warning: #eab308;
  --error: #ef4444;
  --info: #3b82f6;

  /* Tax Level Colors */
  --federal-color: #3b82f6;
  --cantonal-color: #8b5cf6;
  --municipal-color: #ec4899;
  --church-color: #6b7280;
}
```

**Typography:**
```css
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Sizes */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
```

### 8.2 Component Styling Approach
**Recommended: Tailwind CSS**
- Utility-first approach
- Excellent TypeScript integration
- Built-in responsive design
- Easy dark mode support

### 8.3 Responsive Breakpoints
```typescript
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
};
```

### 8.4 Form UX Guidelines
1. **Progressive disclosure**: Show advanced deductions only when expanded
2. **Smart defaults**: Pre-fill common values
3. **Instant validation**: Validate as user types
4. **Helpful tooltips**: Explain tax terms with info icons
5. **Auto-calculation**: Update results as inputs change (debounced)
6. **Currency formatting**: Format numbers as CHF with thousands separator

---

## 9. Data Requirements

### 9.1 Required Tax Data Files

The application requires the following data to be configured:

1. **Federal Tax Tariffs** (yearly updates)
   - Single tariff brackets and rates
   - Married tariff brackets and rates

2. **Cantonal Tax Data** (per canton)
   - Tax tariff/brackets
   - Cantonal tax multiplier
   - Deduction limits and rules

3. **Municipal Data** (per municipality)
   - Municipal tax multiplier
   - Church tax rates (Catholic, Protestant)

4. **Constants**
   - Pillar 3a limits
   - AHV/IV/EO rates
   - Standard deduction amounts

### 9.2 Data Update Strategy
- Store tax year with data
- Allow easy yearly updates by adding new data files
- Maintain historical data for past year calculations

---

## 10. Technical Specifications

### 10.1 Technology Stack
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State**: React Context + useReducer
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router v6
- **Storage**: localStorage API

### 10.2 Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 10.3 Performance Targets
- Initial load: < 3s on 3G
- Calculation time: < 100ms
- Chart rendering: < 200ms
- Bundle size: < 500KB gzipped

---

## 11. Future Enhancements (Out of Scope for v1)

1. **Wealth Tax Calculator**: Add property and asset taxation
2. **Multi-year Projections**: Show tax evolution over time
3. **PDF Export**: Generate tax reports
4. **Backend Integration**: Save calculations to server
5. **Real-time Data Updates**: Fetch latest tax rates from official sources
6. **Multi-language Support**: DE, FR, IT, EN
7. **Mobile App**: React Native version
8. **Tax Optimization Tips**: AI-powered suggestions

---

## 12. Document Data Input Format

When providing tax data documents, please include:

1. **Federal Tax Tables**
   - Income brackets with rates for singles and married
   - Base amounts for each bracket

2. **Cantonal Information**
   - Canton name and code
   - Tax multiplier
   - Tariff brackets
   - Deduction limits

3. **Municipality Lists**
   - Municipality name
   - Associated canton
   - Tax multiplier
   - Church tax rates

Example format:
```
Canton: Zürich (ZH)
Tax Year: 2024
Cantonal Multiplier: 100%

Income Brackets (Single):
0 - 6,700: 0%
6,701 - 11,400: 2%
11,401 - 16,100: 3%
...

Municipalities:
- Zürich City: 119%
- Zollikon: 82%
- Küsnacht: 77%
...
```

---

## 13. Implementation Phases

### Phase 1: Core Infrastructure
- Project setup with Vite + React + TypeScript
- Base component library
- Type definitions
- Basic form structure

### Phase 2: Tax Calculation Engine
- Federal tax calculator
- Cantonal tax calculator
- Municipal tax calculator
- Deduction calculator

### Phase 3: User Interface
- Calculator page with forms
- Results display
- Basic charts

### Phase 4: Advanced Features
- Canton comparison
- Swiss map visualization
- Local storage persistence
- Advanced charts

### Phase 5: Polish
- Responsive design
- Performance optimization
- Accessibility
- Documentation

---

*Document Version: 1.0*
*Last Updated: December 2024*