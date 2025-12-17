import type {
  TaxBracket,
  WealthTaxBracket,
  TaxCalculationInput,
  TaxBreakdown,
  DeductionBreakdown,
  TaxLevelResult,
  WealthTaxResult,
  CantonalTaxConfig,
  Municipality,
  SocialContributionsBreakdown,
  EmploymentStatus,
} from '../types';
import { getFederalTaxBrackets } from '../data/federalTax';
import { getCantonConfig, getMunicipalityById } from '../data/cantons';
import { PILLAR_3A_LIMITS, FEDERAL_DEDUCTION_LIMITS, SOCIAL_SECURITY_RATES } from '../data/constants';
import { calculateSelfEmployedAHV, calculateMaxPillar3a, getSelfEmployedAHVRate } from './selfEmployedCalculator';

// Calculate tax using progressive brackets
function calculateTaxFromBrackets(taxableIncome: number, brackets: TaxBracket[]): { tax: number; marginalRate: number } {
  if (taxableIncome <= 0) {
    return { tax: 0, marginalRate: 0 };
  }

  let tax = 0;
  let marginalRate = 0;

  for (const bracket of brackets) {
    if (taxableIncome > bracket.minIncome) {
      if (bracket.maxIncome === null || taxableIncome <= bracket.maxIncome) {
        // We're in this bracket
        const taxableInBracket = taxableIncome - bracket.minIncome;
        tax = bracket.baseAmount + (taxableInBracket * bracket.rate / 100);
        marginalRate = bracket.rate;
        break;
      }
    }
  }

  return { tax: Math.max(0, tax), marginalRate };
}

// Deduction limits type (matches CantonalDeductionLimits structure)
type DeductionLimits = {
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
  // Canton-specific optional deductions
  dualEarnerDeduction?: number;
  rentDeduction?: {
    maxAmount: number;
    percentage: number;
  };
  selfCareDeduction?: number;
  educationDeduction?: number;
  childEducationDeduction?: number;
};

// Context for self-employed deduction calculations
interface SelfEmployedDeductionContext {
  employmentStatus: EmploymentStatus;
  selfEmployedAHV: number;
  selfEmployedNetIncome: number;
}

// Calculate deductions using provided limits
export function calculateDeductions(
  input: TaxCalculationInput,
  limits: DeductionLimits,
  selfEmployedContext?: SelfEmployedDeductionContext
): DeductionBreakdown {
  const { taxpayer, income, deductions } = input;
  const isMarried = taxpayer.civilStatus === 'married';
  const employedIncome = income.grossIncome;
  const employmentStatus = selfEmployedContext?.employmentStatus ?? taxpayer.employmentStatus ?? 'employed';

  // Social security contributions depend on employment status
  let ahvIvEo = 0;
  let alv = 0;

  // Employed portion: AHV/IV/EO and ALV on salary
  if (employmentStatus === 'employed' || employmentStatus === 'mixed') {
    ahvIvEo += employedIncome * (SOCIAL_SECURITY_RATES.ahvIvEo / 100);

    // ALV: 1.1% up to cap, 0.5% solidarity above cap
    if (employedIncome <= SOCIAL_SECURITY_RATES.alvCap) {
      alv = employedIncome * (SOCIAL_SECURITY_RATES.alv / 100);
    } else {
      alv = SOCIAL_SECURITY_RATES.alvCap * (SOCIAL_SECURITY_RATES.alv / 100) +
            (employedIncome - SOCIAL_SECURITY_RATES.alvCap) * (SOCIAL_SECURITY_RATES.alvSolidarity / 100);
    }
  }

  // Self-employed portion: Full AHV/IV/EO (no ALV)
  if ((employmentStatus === 'self-employed' || employmentStatus === 'mixed') && selfEmployedContext) {
    ahvIvEo += selfEmployedContext.selfEmployedAHV;
  }

  const socialSecurityTotal = ahvIvEo + alv;

  // Professional expenses
  let professionalCommuting = 0;
  let professionalMeals = 0;
  let professionalOther = 0;

  if (deductions.usesFlatRateProfessional) {
    professionalOther = limits.professionalExpenses.flatRate;
  } else {
    professionalCommuting = Math.min(deductions.actualCommutingCosts, limits.professionalExpenses.maxCommuting);
    professionalMeals = Math.min(deductions.mealExpenses, limits.professionalExpenses.maxMeals);
    professionalOther = Math.min(deductions.professionalExpenses, limits.professionalExpenses.maxOther);
  }

  const professionalTotal = professionalCommuting + professionalMeals + professionalOther;

  // Insurance premiums
  const maxInsurance = isMarried
    ? limits.insurancePremiums.married + (taxpayer.numberOfChildren * limits.insurancePremiums.perChild)
    : limits.insurancePremiums.single + (taxpayer.numberOfChildren * limits.insurancePremiums.perChild);

  const insuranceHealth = deductions.healthInsurancePremiums;
  const insuranceOther = deductions.otherInsurancePremiums;
  const insuranceTotal = Math.min(insuranceHealth + insuranceOther, maxInsurance);

  // Pension contributions
  const pillar2 = deductions.pillar2Contributions;

  // Pillar 3a limit depends on employment status and pension coverage
  let maxPillar3a: number;
  if (selfEmployedContext && (employmentStatus === 'self-employed' || employmentStatus === 'mixed')) {
    // Self-employed: use special calculation based on hasEmployerPension
    maxPillar3a = calculateMaxPillar3a(
      selfEmployedContext.selfEmployedNetIncome,
      deductions.hasEmployerPension
    );
  } else {
    // Employed: standard limits
    maxPillar3a = deductions.hasEmployerPension
      ? PILLAR_3A_LIMITS.withPension
      : PILLAR_3A_LIMITS.withoutPension;
  }
  const pillar3a = Math.min(deductions.pillar3aContributions, maxPillar3a);
  const pensionTotal = pillar2 + pillar3a;

  // Personal deductions
  const marriedDeduction = isMarried ? limits.marriedDeduction : 0;

  // Dual earner deduction (SZ) - only for married couples where both work
  const dualEarnerDeduction = (isMarried && deductions.isDualEarnerCouple && limits.dualEarnerDeduction)
    ? limits.dualEarnerDeduction
    : 0;

  const childDeduction = taxpayer.numberOfChildren * limits.childDeduction;

  // Childcare vs Self-care deduction (mutually exclusive in ZG)
  // Self-care is for parents who care for children themselves instead of using external childcare
  let childcareDeduction = 0;
  let selfCareDeduction = 0;

  if (deductions.usesSelfCareDeduction && limits.selfCareDeduction) {
    // Self-care deduction (Eigenbetreuungsabzug) - per child in childcare age (under 15)
    selfCareDeduction = taxpayer.childrenInChildcare * limits.selfCareDeduction;
  } else {
    // External childcare deduction (Fremdbetreuungsabzug)
    childcareDeduction = Math.min(
      deductions.childcareExpenses,
      taxpayer.childrenInChildcare * limits.childcareDeduction
    );
  }

  // Child education deduction (ZG) - for children 15+ in education
  const childEducationDeduction = limits.childEducationDeduction
    ? (deductions.childrenInEducation || 0) * limits.childEducationDeduction
    : 0;

  const socialDeduction = isMarried ? limits.socialDeductions.married : limits.socialDeductions.single;
  const personalTotal = marriedDeduction + dualEarnerDeduction + childDeduction + childcareDeduction + selfCareDeduction + childEducationDeduction + socialDeduction;

  // Other deductions
  const debtInterest = deductions.debtInterest;
  const donations = deductions.charitableDonations;
  const medical = deductions.medicalExpenses;
  const alimony = deductions.alimonyPaid;

  // Rent deduction (ZG) - percentage of rent up to max
  let rentDeduction = 0;
  if (limits.rentDeduction && deductions.rentExpenses > 0) {
    const calculatedRent = deductions.rentExpenses * (limits.rentDeduction.percentage / 100);
    rentDeduction = Math.min(calculatedRent, limits.rentDeduction.maxAmount);
  }

  // Education/training deduction
  const educationDeduction = limits.educationDeduction
    ? Math.min(deductions.educationExpenses || 0, limits.educationDeduction)
    : 0;

  const other = deductions.otherDeductions;
  const otherTotal = debtInterest + donations + medical + alimony + rentDeduction + educationDeduction + other;

  const totalDeductions = socialSecurityTotal + professionalTotal + insuranceTotal + pensionTotal + personalTotal + otherTotal;

  return {
    socialSecurity: {
      ahvIvEo,
      alv,
      total: socialSecurityTotal,
    },
    professionalExpenses: {
      commuting: professionalCommuting,
      meals: professionalMeals,
      other: professionalOther,
      total: professionalTotal,
    },
    insurancePremiums: {
      health: Math.min(insuranceHealth, maxInsurance),
      other: Math.min(insuranceOther, maxInsurance - Math.min(insuranceHealth, maxInsurance)),
      total: insuranceTotal,
    },
    pensionContributions: {
      pillar2,
      pillar3a,
      total: pensionTotal,
    },
    personalDeductions: {
      married: marriedDeduction,
      dualEarner: dualEarnerDeduction,
      children: childDeduction,
      childcare: childcareDeduction,
      selfCare: selfCareDeduction,
      childEducation: childEducationDeduction,
      social: socialDeduction,
      total: personalTotal,
    },
    otherDeductions: {
      debtInterest,
      donations,
      medical,
      alimony,
      rent: rentDeduction,
      education: educationDeduction,
      other,
      total: otherTotal,
    },
    totalDeductions,
  };
}

// Round down to nearest 5 Rappen (0.05 CHF)
function roundToNearest5Rappen(amount: number): number {
  return Math.floor(amount * 20) / 20;
}

// Calculate federal tax
export function calculateFederalTax(
  taxableIncome: number,
  isMarried: boolean,
  numberOfChildren: number = 0
): TaxLevelResult {
  const tariff = isMarried ? 'married' : 'single';
  const brackets = getFederalTaxBrackets(tariff);

  // Round taxable income down to nearest 100 CHF for bracket lookup
  const roundedIncome = Math.floor(taxableIncome / 100) * 100;

  const { tax: rawTax } = calculateTaxFromBrackets(roundedIncome, brackets);

  // Reduce by CHF 263 per child
  const childReduction = numberOfChildren * 263;
  const taxAfterChildReduction = Math.max(0, rawTax - childReduction);

  // Round down to nearest 5 Rappen
  const tax = roundToNearest5Rappen(taxAfterChildReduction);

  return {
    taxableIncome,
    baseTax: tax,
    multiplier: 100, // Federal tax has no multiplier
    taxAmount: tax,
    effectiveRate: taxableIncome > 0 ? (tax / taxableIncome) * 100 : 0,
  };
}

// Calculate cantonal tax
export function calculateCantonalTax(
  taxableIncome: number,
  cantonConfig: CantonalTaxConfig,
  isMarried: boolean
): TaxLevelResult {
  const brackets = isMarried ? cantonConfig.tariffs.married : cantonConfig.tariffs.single;
  const { tax: baseTax } = calculateTaxFromBrackets(taxableIncome, brackets);
  const taxAmount = roundToNearest5Rappen(baseTax * (cantonConfig.taxMultiplier / 100));

  return {
    taxableIncome,
    baseTax,
    multiplier: cantonConfig.taxMultiplier,
    taxAmount,
    effectiveRate: taxableIncome > 0 ? (taxAmount / taxableIncome) * 100 : 0,
  };
}

// Calculate municipal tax
export function calculateMunicipalTax(
  taxableIncome: number,
  cantonConfig: CantonalTaxConfig,
  municipality: Municipality,
  isMarried: boolean
): TaxLevelResult {
  const brackets = isMarried ? cantonConfig.tariffs.married : cantonConfig.tariffs.single;
  const { tax: baseTax } = calculateTaxFromBrackets(taxableIncome, brackets);
  const taxAmount = roundToNearest5Rappen(baseTax * (municipality.taxMultiplier / 100));

  return {
    taxableIncome,
    baseTax,
    multiplier: municipality.taxMultiplier,
    taxAmount,
    effectiveRate: taxableIncome > 0 ? (taxAmount / taxableIncome) * 100 : 0,
  };
}

// Calculate church tax
export function calculateChurchTax(
  taxableIncome: number,
  cantonConfig: CantonalTaxConfig,
  municipality: Municipality,
  religion: string,
  isMarried: boolean
): TaxLevelResult {
  if (religion === 'none' || religion === 'other') {
    return {
      taxableIncome,
      baseTax: 0,
      multiplier: 0,
      taxAmount: 0,
      effectiveRate: 0,
    };
  }

  const brackets = isMarried ? cantonConfig.tariffs.married : cantonConfig.tariffs.single;
  const { tax: baseTax } = calculateTaxFromBrackets(taxableIncome, brackets);

  let churchMultiplier = 0;
  if (religion === 'catholic') {
    churchMultiplier = municipality.churchTaxMultipliers.catholic;
  } else if (religion === 'protestant') {
    churchMultiplier = municipality.churchTaxMultipliers.protestant;
  } else if (religion === 'christCatholic') {
    churchMultiplier = municipality.churchTaxMultipliers.christCatholic;
  }

  const taxAmount = roundToNearest5Rappen(baseTax * (churchMultiplier / 100));

  return {
    taxableIncome,
    baseTax,
    multiplier: churchMultiplier,
    taxAmount,
    effectiveRate: taxableIncome > 0 ? (taxAmount / taxableIncome) * 100 : 0,
  };
}

// Calculate wealth tax using progressive brackets
function calculateWealthTaxFromBrackets(taxableWealth: number, brackets: WealthTaxBracket[]): number {
  if (taxableWealth <= 0) {
    return 0;
  }

  let totalTax = 0;
  let remainingWealth = taxableWealth;

  for (const bracket of brackets) {
    if (remainingWealth <= 0) break;

    const bracketSize = bracket.maxWealth !== null
      ? bracket.maxWealth - bracket.minWealth
      : Infinity;

    const wealthInBracket = Math.min(remainingWealth, bracketSize);
    totalTax += wealthInBracket * (bracket.rate / 100);
    remainingWealth -= wealthInBracket;
  }

  return totalTax;
}

// Calculate wealth tax
export function calculateWealthTax(
  grossWealth: number,
  cantonConfig: CantonalTaxConfig,
  municipality: Municipality,
  isMarried: boolean,
  numberOfChildren: number,
  religion: string
): WealthTaxResult {
  // Return zero result if canton doesn't have wealth tax configured
  if (!cantonConfig.wealthTax) {
    return {
      grossWealth,
      allowance: 0,
      taxableWealth: 0,
      cantonalTax: 0,
      municipalTax: 0,
      churchTax: 0,
      totalTax: 0,
      effectiveRate: 0,
    };
  }

  const { allowances, brackets } = cantonConfig.wealthTax;

  // Calculate allowance based on civil status and children
  const baseAllowance = isMarried ? allowances.married : allowances.single;
  const childAllowance = numberOfChildren * allowances.perChild;
  const totalAllowance = baseAllowance + childAllowance;

  // Calculate taxable wealth
  const taxableWealth = Math.max(0, grossWealth - totalAllowance);

  // Calculate base wealth tax using progressive brackets
  const baseTax = calculateWealthTaxFromBrackets(taxableWealth, brackets);

  // Apply cantonal and municipal multipliers
  const cantonalTax = roundToNearest5Rappen(baseTax * (cantonConfig.taxMultiplier / 100));
  const municipalTax = roundToNearest5Rappen(baseTax * (municipality.taxMultiplier / 100));

  // Calculate church tax on wealth (if applicable)
  let churchTax = 0;
  if (religion !== 'none' && religion !== 'other') {
    let churchMultiplier = 0;
    if (religion === 'catholic') {
      churchMultiplier = municipality.churchTaxMultipliers.catholic;
    } else if (religion === 'protestant') {
      churchMultiplier = municipality.churchTaxMultipliers.protestant;
    } else if (religion === 'christCatholic') {
      churchMultiplier = municipality.churchTaxMultipliers.christCatholic;
    }
    churchTax = roundToNearest5Rappen(baseTax * (churchMultiplier / 100));
  }

  const totalTax = cantonalTax + municipalTax + churchTax;
  const effectiveRate = grossWealth > 0 ? (totalTax / grossWealth) * 100 : 0;

  return {
    grossWealth,
    allowance: totalAllowance,
    taxableWealth,
    cantonalTax,
    municipalTax,
    churchTax,
    totalTax,
    effectiveRate,
  };
}

// Calculate marginal rate (combined taxes + social contributions)
function calculateMarginalRate(
  taxableIncome: number,
  cantonConfig: CantonalTaxConfig,
  municipality: Municipality,
  isMarried: boolean,
  employmentStatus: EmploymentStatus,
  employedIncome: number,
  selfEmployedIncome: number
): number {
  // Federal marginal rate
  const federalBrackets = getFederalTaxBrackets(isMarried ? 'married' : 'single');
  const { marginalRate: federalMarginal } = calculateTaxFromBrackets(taxableIncome, federalBrackets);

  // Cantonal marginal rate (adjusted by multipliers)
  const cantonalBrackets = isMarried ? cantonConfig.tariffs.married : cantonConfig.tariffs.single;
  const { marginalRate: cantonalMarginal } = calculateTaxFromBrackets(taxableIncome, cantonalBrackets);

  const totalMultiplier = (cantonConfig.taxMultiplier + municipality.taxMultiplier) / 100;
  const adjustedCantonalMarginal = cantonalMarginal * totalMultiplier;

  // Add social contribution marginal rates
  let socialMarginalRate = 0;

  if (employmentStatus === 'employed') {
    // Employed: AHV 5.3% + ALV (1.1% below cap, 0.5% above cap)
    socialMarginalRate = SOCIAL_SECURITY_RATES.ahvIvEo;
    if (employedIncome <= SOCIAL_SECURITY_RATES.alvCap) {
      socialMarginalRate += SOCIAL_SECURITY_RATES.alv;
    } else {
      socialMarginalRate += SOCIAL_SECURITY_RATES.alvSolidarity;
    }
  } else if (employmentStatus === 'self-employed') {
    // Self-employed: use current AHV rate from degressive scale
    socialMarginalRate = getSelfEmployedAHVRate(selfEmployedIncome);
  } else if (employmentStatus === 'mixed') {
    // Mixed: use the higher of the two rates (marginal rate on next CHF earned)
    const employedRate = SOCIAL_SECURITY_RATES.ahvIvEo +
      (employedIncome <= SOCIAL_SECURITY_RATES.alvCap
        ? SOCIAL_SECURITY_RATES.alv
        : SOCIAL_SECURITY_RATES.alvSolidarity);
    const selfEmployedRate = getSelfEmployedAHVRate(selfEmployedIncome);
    socialMarginalRate = Math.max(employedRate, selfEmployedRate);
  }

  return federalMarginal + adjustedCantonalMarginal + socialMarginalRate;
}

// Calculate social contributions (AHV/IV/EO and ALV)
// These are mandatory payroll deductions separate from tax deductions
export function calculateSocialContributions(
  employedIncome: number,
  selfEmployedIncome: number,
  employmentStatus: EmploymentStatus
): SocialContributionsBreakdown {
  let ahvIvEoEmployed = 0;
  let alvEmployed = 0;
  let ahvIvEoSelfEmployed = 0;

  // Employed contributions
  if (employmentStatus === 'employed' || employmentStatus === 'mixed') {
    // AHV/IV/EO: 5.3% of employed income
    ahvIvEoEmployed = employedIncome * (SOCIAL_SECURITY_RATES.ahvIvEo / 100);

    // ALV: 1.1% up to cap, 0.5% solidarity above cap
    if (employedIncome <= SOCIAL_SECURITY_RATES.alvCap) {
      alvEmployed = employedIncome * (SOCIAL_SECURITY_RATES.alv / 100);
    } else {
      alvEmployed = SOCIAL_SECURITY_RATES.alvCap * (SOCIAL_SECURITY_RATES.alv / 100) +
            (employedIncome - SOCIAL_SECURITY_RATES.alvCap) * (SOCIAL_SECURITY_RATES.alvSolidarity / 100);
    }
  }

  // Self-employed contributions (no ALV for self-employed)
  if (employmentStatus === 'self-employed' || employmentStatus === 'mixed') {
    ahvIvEoSelfEmployed = calculateSelfEmployedAHV(selfEmployedIncome);
  }

  const totalAhvIvEo = ahvIvEoEmployed + ahvIvEoSelfEmployed;

  return {
    ahvIvEoEmployed,
    alvEmployed,
    ahvIvEoSelfEmployed,
    ahvIvEo: totalAhvIvEo,
    alv: alvEmployed,
    total: totalAhvIvEo + alvEmployed,
  };
}

// Empty deduction breakdown for when deductions are disabled
const emptyDeductions: DeductionBreakdown = {
  socialSecurity: { ahvIvEo: 0, alv: 0, total: 0 },
  professionalExpenses: { commuting: 0, meals: 0, other: 0, total: 0 },
  insurancePremiums: { health: 0, other: 0, total: 0 },
  pensionContributions: { pillar2: 0, pillar3a: 0, total: 0 },
  personalDeductions: { married: 0, dualEarner: 0, children: 0, childcare: 0, selfCare: 0, childEducation: 0, social: 0, total: 0 },
  otherDeductions: { debtInterest: 0, donations: 0, medical: 0, alimony: 0, rent: 0, education: 0, other: 0, total: 0 },
  totalDeductions: 0,
};

// Main tax calculation function
export function calculateTax(input: TaxCalculationInput): TaxBreakdown {
  const { taxpayer, income, enableDeductions } = input;

  // Get canton and municipality configs
  const cantonConfig = getCantonConfig(taxpayer.canton);
  const municipality = getMunicipalityById(taxpayer.municipality);

  if (!cantonConfig || !municipality) {
    throw new Error('Invalid canton or municipality');
  }

  const isMarried = taxpayer.civilStatus === 'married';
  const employmentStatus = taxpayer.employmentStatus ?? 'employed';

  // Calculate income based on employment status
  const employedIncome = (employmentStatus === 'employed' || employmentStatus === 'mixed')
    ? income.grossIncome
    : 0;
  const selfEmployedNetIncome = (employmentStatus === 'self-employed' || employmentStatus === 'mixed')
    ? (income.selfEmployedIncome?.netBusinessIncome ?? 0)
    : 0;

  // Calculate self-employed AHV first (needed for deductions)
  const selfEmployedAHV = (employmentStatus === 'self-employed' || employmentStatus === 'mixed')
    ? calculateSelfEmployedAHV(selfEmployedNetIncome)
    : 0;

  // Total gross income for tax purposes
  // Note: For self-employed, we use net business income (after business expenses)
  const grossIncome = employedIncome + selfEmployedNetIncome;

  // Context for self-employed deduction calculations
  const selfEmployedContext: SelfEmployedDeductionContext | undefined =
    (employmentStatus === 'self-employed' || employmentStatus === 'mixed')
      ? {
          employmentStatus,
          selfEmployedAHV,
          selfEmployedNetIncome,
        }
      : undefined;

  // Calculate deductions (or use empty deductions if disabled)
  let federalDeductions: DeductionBreakdown;
  let cantonalDeductions: DeductionBreakdown;

  if (enableDeductions) {
    federalDeductions = calculateDeductions(input, FEDERAL_DEDUCTION_LIMITS, selfEmployedContext);
    cantonalDeductions = calculateDeductions(input, cantonConfig.deductionLimits, selfEmployedContext);
  } else {
    federalDeductions = emptyDeductions;
    cantonalDeductions = emptyDeductions;
  }

  const taxableIncomeFederal = Math.max(0, grossIncome - federalDeductions.totalDeductions);
  const taxableIncomeCantonal = Math.max(0, grossIncome - cantonalDeductions.totalDeductions);

  // Calculate all tax components
  const federalTax = calculateFederalTax(taxableIncomeFederal, isMarried, taxpayer.numberOfChildren);
  const cantonalTax = calculateCantonalTax(taxableIncomeCantonal, cantonConfig, isMarried);
  const municipalTax = calculateMunicipalTax(taxableIncomeCantonal, cantonConfig, municipality, isMarried);

  // Church tax - consider both spouses for married couples
  const churchTax = calculateChurchTax(taxableIncomeCantonal, cantonConfig, municipality, taxpayer.religion, isMarried);
  if (isMarried && taxpayer.partnerReligion !== taxpayer.religion) {
    // If spouse has different religion, calculate their portion too
    const partnerChurchTax = calculateChurchTax(
      taxableIncomeCantonal / 2, // Simplification: split income
      cantonConfig,
      municipality,
      taxpayer.partnerReligion,
      isMarried
    );
    churchTax.taxAmount += partnerChurchTax.taxAmount;
  }

  // Calculate wealth tax
  const wealthTax = calculateWealthTax(
    income.wealth,
    cantonConfig,
    municipality,
    isMarried,
    taxpayer.numberOfChildren,
    taxpayer.religion
  );

  // Calculate social contributions (mandatory payroll deductions)
  const socialContributions = calculateSocialContributions(
    employedIncome,
    selfEmployedNetIncome,
    employmentStatus
  );

  // Total income tax (before wealth tax)
  const totalIncomeTax = federalTax.taxAmount + cantonalTax.taxAmount + municipalTax.taxAmount + churchTax.taxAmount;

  // Total tax (income + wealth)
  const totalTax = totalIncomeTax + wealthTax.totalTax;

  // Effective rate includes taxes AND social contributions (total mandatory costs)
  const totalMandatoryCosts = totalTax + socialContributions.total;
  const effectiveRate = grossIncome > 0 ? (totalMandatoryCosts / grossIncome) * 100 : 0;
  const marginalRate = calculateMarginalRate(
    taxableIncomeCantonal,
    cantonConfig,
    municipality,
    isMarried,
    employmentStatus,
    employedIncome,
    selfEmployedNetIncome
  );

  // Net income = gross income - taxes - social contributions
  const netIncome = grossIncome - totalTax - socialContributions.total;

  return {
    grossIncome,
    deductions: cantonalDeductions,
    deductionsFederal: federalDeductions,
    totalDeductions: cantonalDeductions.totalDeductions,
    totalDeductionsFederal: federalDeductions.totalDeductions,
    taxableIncomeFederal,
    taxableIncomeCantonal,
    federalTax,
    cantonalTax,
    municipalTax,
    churchTax,
    wealthTax,
    socialContributions,
    totalTax,
    totalIncomeTax,
    effectiveRate,
    marginalRate,
    netIncome,
  };
}

// Calculate tax for comparison purposes (multiple municipalities)
export function calculateTaxForComparison(
  input: TaxCalculationInput,
  cantonCode: string,
  municipalityId: string
): TaxBreakdown | null {
  const cantonConfig = getCantonConfig(cantonCode);
  const municipality = getMunicipalityById(municipalityId);

  if (!cantonConfig || !municipality) {
    return null;
  }

  const modifiedInput: TaxCalculationInput = {
    ...input,
    taxpayer: {
      ...input.taxpayer,
      canton: cantonCode,
      municipality: municipalityId,
    },
  };

  return calculateTax(modifiedInput);
}
