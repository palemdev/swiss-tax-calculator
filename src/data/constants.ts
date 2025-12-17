// Swiss Tax System Constants for 2025

export const TAX_YEAR = 2025;

// Pillar 3a contribution limits
export const PILLAR_3A_LIMITS = {
  withPension: 7056,      // For employees with employer pension (BVG)
  withoutPension: 35280,  // For self-employed without pension (20% of net income, max)
  selfEmployedPercentage: 20, // Self-employed without BVG: 20% of net income
};

// AHV/IV/EO Contribution rates (employee portion)
export const SOCIAL_SECURITY_RATES = {
  ahvIvEo: 5.3,    // AHV/IV/EO employee contribution
  alv: 1.1,        // Unemployment insurance (up to cap)
  alvSolidarity: 0.5, // ALV solidarity contribution (above cap)
  alvCap: 148200,  // Maximum income for regular ALV rate
};

// Self-employed AHV/IV/EO rates (degressive scale)
// Self-employed pay the full rate (not split with employer)
export const SELF_EMPLOYED_AHV_RATES = {
  minimumContribution: 514,      // Minimum annual contribution
  minimumIncomeThreshold: 9800,  // Below this, pay minimum
  fullRateThreshold: 58800,      // Above this, pay full 10.6%
  fullRate: 10.6,                // Full rate percentage
  // Degressive scale for incomes between minimum and full rate threshold
  scale: [
    { minIncome: 9800, maxIncome: 17800, rate: 5.371 },
    { minIncome: 17800, maxIncome: 24000, rate: 6.642 },
    { minIncome: 24000, maxIncome: 30200, rate: 7.478 },
    { minIncome: 30200, maxIncome: 36400, rate: 8.127 },
    { minIncome: 36400, maxIncome: 42600, rate: 8.683 },
    { minIncome: 42600, maxIncome: 48800, rate: 9.188 },
    { minIncome: 48800, maxIncome: 55000, rate: 9.660 },
    { minIncome: 55000, maxIncome: 58800, rate: 10.113 },
  ],
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
  socialContributions: '#f97316', // Orange
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

// Employment status options
export const EMPLOYMENT_STATUS_OPTIONS = [
  { value: 'employed', label: 'Employed', labelDe: 'Arbeitnehmer/in' },
  { value: 'self-employed', label: 'Self-employed', labelDe: 'Selbständigerwerbend' },
  { value: 'mixed', label: 'Both employed and self-employed', labelDe: 'Angestellt und selbständig' },
] as const;
