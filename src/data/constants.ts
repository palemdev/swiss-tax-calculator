// Swiss Tax System Constants for 2025

export const TAX_YEAR = 2025;

// Pillar 3a contribution limits
export const PILLAR_3A_LIMITS = {
  withPension: 7056,      // For employees with employer pension (BVG)
  withoutPension: 35280,  // For self-employed without pension (20% of net income, max)
};

// AHV/IV/EO Contribution rates (employee portion)
export const SOCIAL_SECURITY_RATES = {
  ahvIvEo: 5.3,    // AHV/IV/EO employee contribution
  alv: 1.1,        // Unemployment insurance (up to cap)
  alvSolidarity: 0.5, // ALV solidarity contribution (above cap)
  alvCap: 148200,  // Maximum income for regular ALV rate
};

// Federal tax thresholds
export const FEDERAL_TAX_THRESHOLDS = {
  maxMarginalRate: 11.5, // Maximum federal marginal rate
};

// Federal deduction limits (used for calculating federal taxable income)
// These are consistent across all cantons for federal tax calculation
export const FEDERAL_DEDUCTION_LIMITS = {
  professionalExpenses: {
    flatRate: 2000,
    maxCommuting: 3000,
    maxMeals: 3200,
    maxOther: 2000,
  },
  insurancePremiums: {
    single: 2700,
    married: 5400,
    perChild: 1350,
  },
  pillar3a: PILLAR_3A_LIMITS,
  childDeduction: 6600,
  childcareDeduction: 25000,
  marriedDeduction: 2700,
  socialDeductions: {
    single: 0,
    married: 0,
  },
};

// Currency formatting
export const CURRENCY = {
  code: 'CHF',
  locale: 'de-CH',
  symbol: 'CHF',
};

// Chart colors
export const TAX_COLORS = {
  federal: '#3b82f6',     // Blue
  cantonal: '#8b5cf6',    // Purple
  municipal: '#ec4899',   // Pink
  church: '#6b7280',      // Gray
  wealth: '#f59e0b',      // Amber
  deductions: '#22c55e',  // Green
  netIncome: '#10b981',   // Emerald
};

// Civil status options
export const CIVIL_STATUS_OPTIONS = [
  { value: 'single', label: 'Single', labelDe: 'Ledig' },
  { value: 'married', label: 'Married', labelDe: 'Verheiratet' },
  { value: 'divorced', label: 'Divorced', labelDe: 'Geschieden' },
  { value: 'widowed', label: 'Widowed', labelDe: 'Verwitwet' },
  { value: 'separated', label: 'Separated', labelDe: 'Getrennt' },
] as const;

// Religion options
export const RELIGION_OPTIONS = [
  { value: 'none', label: 'No religious affiliation', labelDe: 'Keine Religionszugehörigkeit' },
  { value: 'catholic', label: 'Roman Catholic', labelDe: 'Römisch-katholisch' },
  { value: 'protestant', label: 'Protestant', labelDe: 'Evangelisch-reformiert' },
  { value: 'christCatholic', label: 'Christ Catholic', labelDe: 'Christkatholisch' },
  { value: 'other', label: 'Other (no church tax)', labelDe: 'Andere (keine Kirchensteuer)' },
] as const;
