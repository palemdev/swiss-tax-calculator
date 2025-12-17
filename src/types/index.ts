// ============================================
// Tax Configuration Types
// ============================================

export interface TaxBracket {
  minIncome: number;
  maxIncome: number | null;
  baseAmount: number;
  rate: number; // Percentage (e.g., 11.5 for 11.5%)
}

export interface WealthTaxBracket {
  minWealth: number;
  maxWealth: number | null;
  rate: number; // Percentage (e.g., 0.0425 for 0.0425%)
}

export interface FederalTaxTariff {
  tariffType: 'single' | 'married';
  brackets: TaxBracket[];
  year: number;
}

export interface CantonalDeductionLimits {
  professionalExpenses: {
    flatRate: number;
    maxCommuting: number;
    maxMeals: number;
    maxOther: number;
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
  // Canton-specific deductions (optional - not all cantons have these)
  dualEarnerDeduction?: number;              // Zweiverdienerabzug (SZ)
  rentDeduction?: {                          // Mietzinsabzug (ZG)
    maxAmount: number;
    percentage: number;                      // e.g., 30 for 30%
  };
  selfCareDeduction?: number;                // Eigenbetreuungsabzug (ZG) - per child under 15
  educationDeduction?: number;               // Weiterbildungskosten - max amount
  childEducationDeduction?: number;          // Kinderzusatzabzug (ZG) - for children 15+ in education
}

export interface WealthTaxConfig {
  allowances: {
    single: number;
    married: number;
    perChild: number;
  };
  brackets: WealthTaxBracket[];
}

export interface CantonalTaxConfig {
  cantonCode: string;
  cantonName: string;
  cantonNameDe: string;
  cantonNameFr: string;
  year: number;
  taxMultiplier: number;
  tariffs: {
    single: TaxBracket[];
    married: TaxBracket[];
  };
  deductionLimits: CantonalDeductionLimits;
  wealthTax?: WealthTaxConfig;
}

export interface Municipality {
  id: string;
  name: string;
  cantonCode: string;
  taxMultiplier: number;
  churchTaxMultipliers: {
    catholic: number;
    protestant: number;
    christCatholic: number;
  };
}

// ============================================
// User Input Types
// ============================================

export type CivilStatus = 'single' | 'married' | 'divorced' | 'widowed' | 'separated';
export type Religion = 'none' | 'catholic' | 'protestant' | 'christCatholic' | 'other';
export type EmploymentStatus = 'employed' | 'self-employed' | 'mixed';

export interface SelfEmployedIncome {
  netBusinessIncome: number;
}

export interface TaxpayerProfile {
  civilStatus: CivilStatus;
  canton: string;
  municipality: string;
  religion: Religion;
  partnerReligion: Religion;
  numberOfChildren: number;
  childrenInChildcare: number;
  // Employment status
  employmentStatus: EmploymentStatus;
}

export interface IncomeDetails {
  grossIncome: number; // Employment income (salary)
  wealth: number;
  // Self-employed income
  selfEmployedIncome?: SelfEmployedIncome;
}

export interface DeductionInputs {
  // Professional Expenses
  actualCommutingCosts: number;
  usesFlatRateProfessional: boolean;
  mealExpenses: number;
  professionalExpenses: number;

  // Insurance
  healthInsurancePremiums: number;
  otherInsurancePremiums: number;

  // Pension
  pillar2Contributions: number;
  pillar3aContributions: number;
  hasEmployerPension: boolean;

  // Personal
  childcareExpenses: number;
  alimonyPaid: number;

  // Canton-specific deductions
  rentExpenses: number;                    // For Mietzinsabzug (ZG)
  educationExpenses: number;               // For Weiterbildungskosten
  usesSelfCareDeduction: boolean;          // Eigenbetreuungsabzug instead of childcare (ZG)
  childrenInEducation: number;             // Children 15+ in education for Kinderzusatzabzug (ZG)
  isDualEarnerCouple: boolean;             // For Zweiverdienerabzug (SZ)

  // Other
  debtInterest: number;
  charitableDonations: number;
  medicalExpenses: number;
  otherDeductions: number;
}

export interface TaxCalculationInput {
  year: number;
  taxpayer: TaxpayerProfile;
  income: IncomeDetails;
  deductions: DeductionInputs;
  enableDeductions: boolean;
}

// ============================================
// Calculation Result Types
// ============================================

export interface DeductionBreakdown {
  socialSecurity: {
    ahvIvEo: number;
    alv: number;
    total: number;
  };
  professionalExpenses: {
    commuting: number;
    meals: number;
    other: number;
    total: number;
  };
  insurancePremiums: {
    health: number;
    other: number;
    total: number;
  };
  pensionContributions: {
    pillar2: number;
    pillar3a: number;
    total: number;
  };
  personalDeductions: {
    married: number;
    dualEarner: number;
    children: number;
    childcare: number;
    selfCare: number;
    childEducation: number;
    social: number;
    total: number;
  };
  otherDeductions: {
    debtInterest: number;
    donations: number;
    medical: number;
    alimony: number;
    rent: number;
    education: number;
    other: number;
    total: number;
  };
  totalDeductions: number;
}

export interface TaxLevelResult {
  taxableIncome: number;
  baseTax: number;
  multiplier: number;
  taxAmount: number;
  effectiveRate: number;
}

export interface WealthTaxResult {
  grossWealth: number;
  allowance: number;
  taxableWealth: number;
  cantonalTax: number;
  municipalTax: number;
  churchTax: number;
  totalTax: number;
  effectiveRate: number;
}

export interface SocialContributionsBreakdown {
  // Employed contributions (employee portion)
  ahvIvEoEmployed: number;
  alvEmployed: number;
  // Self-employed contributions (full rate)
  ahvIvEoSelfEmployed: number;
  // Totals
  ahvIvEo: number; // Combined AHV/IV/EO
  alv: number;     // Only from employment (self-employed don't pay ALV)
  total: number;
}

export interface TaxBreakdown {
  grossIncome: number;
  deductions: DeductionBreakdown;
  deductionsFederal: DeductionBreakdown;
  totalDeductions: number;
  totalDeductionsFederal: number;
  taxableIncomeFederal: number;
  taxableIncomeCantonal: number;

  federalTax: TaxLevelResult;
  cantonalTax: TaxLevelResult;
  municipalTax: TaxLevelResult;
  churchTax: TaxLevelResult;
  wealthTax: WealthTaxResult;

  socialContributions: SocialContributionsBreakdown;
  totalTax: number;
  totalIncomeTax: number;
  effectiveRate: number;
  marginalRate: number;
  netIncome: number;
}

export interface TaxComparisonResult {
  canton: string;
  cantonName: string;
  municipality: string;
  municipalityName: string;
  taxBreakdown: TaxBreakdown;
  ranking: number;
  differenceFromCheapest: number;
  differenceFromAverage: number;
}

// ============================================
// UI State Types
// ============================================

export interface SavedCalculation {
  id: string;
  name: string;
  createdAt: string;
  input: TaxCalculationInput;
  results: TaxBreakdown;
}

export interface UserPreferences {
  defaultCanton: string;
  defaultMunicipality: string;
  showAdvancedDeductions: boolean;
}
