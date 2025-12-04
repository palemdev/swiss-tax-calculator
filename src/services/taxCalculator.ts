import type {
  TaxBracket,
  TaxCalculationInput,
  TaxBreakdown,
  DeductionBreakdown,
  TaxLevelResult,
  CantonalTaxConfig,
  Municipality,
} from '../types';
import { getFederalTaxBrackets } from '../data/federalTax';
import { getCantonConfig, getMunicipalityById } from '../data/cantons';
import { PILLAR_3A_LIMITS } from '../data/constants';

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

// Calculate deductions
export function calculateDeductions(
  input: TaxCalculationInput,
  cantonConfig: CantonalTaxConfig
): DeductionBreakdown {
  const { taxpayer, deductions } = input;
  const limits = cantonConfig.deductionLimits;
  const isMarried = taxpayer.civilStatus === 'married';

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
  const maxPillar3a = deductions.hasEmployerPension
    ? PILLAR_3A_LIMITS.withPension
    : PILLAR_3A_LIMITS.withoutPension;
  const pillar3a = Math.min(deductions.pillar3aContributions, maxPillar3a);
  const pensionTotal = pillar2 + pillar3a;

  // Personal deductions
  const marriedDeduction = isMarried ? limits.marriedDeduction : 0;
  const childDeduction = taxpayer.numberOfChildren * limits.childDeduction;
  const childcareDeduction = Math.min(
    deductions.childcareExpenses,
    taxpayer.childrenInChildcare * limits.childcareDeduction
  );
  const socialDeduction = isMarried ? limits.socialDeductions.married : limits.socialDeductions.single;
  const personalTotal = marriedDeduction + childDeduction + childcareDeduction + socialDeduction;

  // Other deductions
  const debtInterest = deductions.debtInterest;
  const donations = deductions.charitableDonations;
  const medical = deductions.medicalExpenses;
  const alimony = deductions.alimonyPaid;
  const other = deductions.otherDeductions;
  const otherTotal = debtInterest + donations + medical + alimony + other;

  const totalDeductions = professionalTotal + insuranceTotal + pensionTotal + personalTotal + otherTotal;

  return {
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
      children: childDeduction,
      childcare: childcareDeduction,
      social: socialDeduction,
      total: personalTotal,
    },
    otherDeductions: {
      debtInterest,
      donations,
      medical,
      alimony,
      other,
      total: otherTotal,
    },
    totalDeductions,
  };
}

// Calculate federal tax
export function calculateFederalTax(
  taxableIncome: number,
  isMarried: boolean
): TaxLevelResult {
  const tariff = isMarried ? 'married' : 'single';
  const brackets = getFederalTaxBrackets(tariff);
  const { tax } = calculateTaxFromBrackets(taxableIncome, brackets);

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
  const taxAmount = baseTax * (cantonConfig.taxMultiplier / 100);

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
  const taxAmount = baseTax * (municipality.taxMultiplier / 100);

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

  const taxAmount = baseTax * (churchMultiplier / 100);

  return {
    taxableIncome,
    baseTax,
    multiplier: churchMultiplier,
    taxAmount,
    effectiveRate: taxableIncome > 0 ? (taxAmount / taxableIncome) * 100 : 0,
  };
}

// Calculate marginal rate (combined)
function calculateMarginalRate(
  taxableIncome: number,
  cantonConfig: CantonalTaxConfig,
  municipality: Municipality,
  isMarried: boolean
): number {
  // Federal marginal rate
  const federalBrackets = getFederalTaxBrackets(isMarried ? 'married' : 'single');
  const { marginalRate: federalMarginal } = calculateTaxFromBrackets(taxableIncome, federalBrackets);

  // Cantonal marginal rate (adjusted by multipliers)
  const cantonalBrackets = isMarried ? cantonConfig.tariffs.married : cantonConfig.tariffs.single;
  const { marginalRate: cantonalMarginal } = calculateTaxFromBrackets(taxableIncome, cantonalBrackets);

  const totalMultiplier = (cantonConfig.taxMultiplier + municipality.taxMultiplier) / 100;
  const adjustedCantonalMarginal = cantonalMarginal * totalMultiplier;

  return federalMarginal + adjustedCantonalMarginal;
}

// Main tax calculation function
export function calculateTax(input: TaxCalculationInput): TaxBreakdown {
  const { taxpayer, income } = input;

  // Get canton and municipality configs
  const cantonConfig = getCantonConfig(taxpayer.canton);
  const municipality = getMunicipalityById(taxpayer.municipality);

  if (!cantonConfig || !municipality) {
    throw new Error('Invalid canton or municipality');
  }

  const isMarried = taxpayer.civilStatus === 'married';

  // Calculate gross income
  const grossIncome =
    income.primaryIncome +
    income.secondaryIncome +
    income.selfEmploymentIncome +
    income.investmentIncome +
    income.rentalIncome +
    income.otherIncome;

  // Calculate deductions
  const deductions = calculateDeductions(input, cantonConfig);

  // Calculate taxable income
  // Note: Federal and cantonal taxable income may differ slightly, but we'll simplify
  const taxableIncome = Math.max(0, grossIncome - deductions.totalDeductions);

  // Calculate all tax components
  const federalTax = calculateFederalTax(taxableIncome, isMarried);
  const cantonalTax = calculateCantonalTax(taxableIncome, cantonConfig, isMarried);
  const municipalTax = calculateMunicipalTax(taxableIncome, cantonConfig, municipality, isMarried);

  // Church tax - consider both spouses for married couples
  let churchTax = calculateChurchTax(taxableIncome, cantonConfig, municipality, taxpayer.religion, isMarried);
  if (isMarried && taxpayer.partnerReligion !== taxpayer.religion) {
    // If spouse has different religion, calculate their portion too
    const partnerChurchTax = calculateChurchTax(
      taxableIncome / 2, // Simplification: split income
      cantonConfig,
      municipality,
      taxpayer.partnerReligion,
      isMarried
    );
    churchTax.taxAmount += partnerChurchTax.taxAmount;
  }

  // Total tax
  const totalTax = federalTax.taxAmount + cantonalTax.taxAmount + municipalTax.taxAmount + churchTax.taxAmount;
  const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;
  const marginalRate = calculateMarginalRate(taxableIncome, cantonConfig, municipality, isMarried);

  return {
    grossIncome,
    deductions,
    totalDeductions: deductions.totalDeductions,
    taxableIncomeFederal: taxableIncome,
    taxableIncomeCantonal: taxableIncome,
    federalTax,
    cantonalTax,
    municipalTax,
    churchTax,
    totalTax,
    effectiveRate,
    marginalRate,
    netIncome: grossIncome - totalTax,
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
