// ============================================
// Tax Configuration Types
// ============================================

export interface TaxBracket {
  minIncome: number;
  maxIncome: number | null;
  baseAmount: number;
  rate: number; // Percentage (e.g., 11.5 for 11.5%)
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

export interface TaxpayerProfile {
  civilStatus: CivilStatus;
  canton: string;
  municipality: string;
  religion: Religion;
  partnerReligion: Religion;
  numberOfChildren: number;
  childrenInChildcare: number;
}

export interface IncomeDetails {
  primaryIncome: number;
  secondaryIncome: number;
  selfEmploymentIncome: number;
  investmentIncome: number;
  rentalIncome: number;
  otherIncome: number;
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
    children: number;
    childcare: number;
    social: number;
    total: number;
  };
  otherDeductions: {
    debtInterest: number;
    donations: number;
    medical: number;
    alimony: number;
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

  totalTax: number;
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
