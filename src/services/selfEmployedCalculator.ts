/**
 * Self-Employed Tax Calculator
 *
 * Handles specific calculations for self-employed individuals (Selbständigerwerbende)
 * in Switzerland, including:
 * - AHV/IV/EO contributions at the full rate (degressive scale for lower incomes)
 * - Pillar 3a limits (20% of net income, max CHF 35,280 without BVG)
 * - No ALV contributions (self-employed are not covered)
 */

import { SELF_EMPLOYED_AHV_RATES, PILLAR_3A_LIMITS } from '../data/constants';

/**
 * Calculate AHV/IV/EO contribution for self-employed individuals
 *
 * Self-employed pay the full contribution rate (not split with employer).
 * A degressive scale applies for lower incomes to support small businesses.
 *
 * @param netBusinessIncome - Net income from self-employment after business expenses
 * @returns Annual AHV/IV/EO contribution amount
 */
export function calculateSelfEmployedAHV(netBusinessIncome: number): number {
  if (netBusinessIncome <= 0) {
    return 0;
  }

  // Below minimum threshold: pay minimum contribution
  if (netBusinessIncome < SELF_EMPLOYED_AHV_RATES.minimumIncomeThreshold) {
    return SELF_EMPLOYED_AHV_RATES.minimumContribution;
  }

  // Above full rate threshold: pay full 10.6%
  if (netBusinessIncome >= SELF_EMPLOYED_AHV_RATES.fullRateThreshold) {
    return netBusinessIncome * (SELF_EMPLOYED_AHV_RATES.fullRate / 100);
  }

  // Find the applicable degressive rate bracket
  for (const bracket of SELF_EMPLOYED_AHV_RATES.scale) {
    if (netBusinessIncome >= bracket.minIncome && netBusinessIncome < bracket.maxIncome) {
      return netBusinessIncome * (bracket.rate / 100);
    }
  }

  // Fallback to full rate (shouldn't reach here)
  return netBusinessIncome * (SELF_EMPLOYED_AHV_RATES.fullRate / 100);
}

/**
 * Get the effective AHV rate for a given self-employed income
 * Useful for displaying the rate to users
 *
 * @param netBusinessIncome - Net income from self-employment
 * @returns Effective AHV rate as percentage (e.g., 10.6 for 10.6%)
 */
export function getSelfEmployedAHVRate(netBusinessIncome: number): number {
  if (netBusinessIncome <= 0) {
    return 0;
  }

  if (netBusinessIncome < SELF_EMPLOYED_AHV_RATES.minimumIncomeThreshold) {
    // Return effective rate based on minimum contribution
    return (SELF_EMPLOYED_AHV_RATES.minimumContribution / netBusinessIncome) * 100;
  }

  if (netBusinessIncome >= SELF_EMPLOYED_AHV_RATES.fullRateThreshold) {
    return SELF_EMPLOYED_AHV_RATES.fullRate;
  }

  for (const bracket of SELF_EMPLOYED_AHV_RATES.scale) {
    if (netBusinessIncome >= bracket.minIncome && netBusinessIncome < bracket.maxIncome) {
      return bracket.rate;
    }
  }

  return SELF_EMPLOYED_AHV_RATES.fullRate;
}

/**
 * Calculate maximum Pillar 3a contribution for self-employed without BVG
 *
 * Self-employed without occupational pension (BVG) can contribute up to 20%
 * of their net income, with a maximum of CHF 35,280 (2025).
 *
 * @param netBusinessIncome - Net income from self-employment
 * @param hasBVG - Whether the person has occupational pension
 * @returns Maximum allowed Pillar 3a contribution
 */
export function calculateMaxPillar3a(netBusinessIncome: number, hasBVG: boolean): number {
  if (hasBVG) {
    // With BVG: standard limit applies
    return PILLAR_3A_LIMITS.withPension;
  }

  // Without BVG: 20% of net income, max CHF 35,280
  const percentageLimit = netBusinessIncome * (PILLAR_3A_LIMITS.selfEmployedPercentage / 100);
  return Math.min(percentageLimit, PILLAR_3A_LIMITS.withoutPension);
}

/**
 * Calculate taxable income for self-employed
 *
 * For self-employed, the AHV contributions are tax-deductible, creating a
 * circular dependency. This function uses iteration to solve it:
 * 1. Calculate AHV on net business income
 * 2. Subtract AHV to get preliminary taxable income
 * 3. Recalculate AHV on adjusted income
 * 4. Repeat until stable (typically 2-3 iterations)
 *
 * @param netBusinessIncome - Net income from self-employment
 * @param otherDeductions - Other tax deductions to apply
 * @returns Object with taxable income and AHV contribution
 */
export function calculateSelfEmployedTaxableIncome(
  netBusinessIncome: number,
  otherDeductions: number = 0
): { taxableIncome: number; ahvContribution: number } {
  if (netBusinessIncome <= 0) {
    return { taxableIncome: 0, ahvContribution: 0 };
  }

  // Initial AHV calculation on full net income
  let ahv = calculateSelfEmployedAHV(netBusinessIncome);
  let taxableIncome = Math.max(0, netBusinessIncome - ahv - otherDeductions);

  // Iterate to find stable values (typically converges in 2-3 iterations)
  const MAX_ITERATIONS = 5;
  const CONVERGENCE_THRESHOLD = 1; // CHF 1 tolerance

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    // Recalculate AHV based on taxable income + AHV (the income before AHV deduction)
    const incomeForAHV = taxableIncome + ahv;
    const newAhv = calculateSelfEmployedAHV(incomeForAHV);

    // Check for convergence
    if (Math.abs(newAhv - ahv) < CONVERGENCE_THRESHOLD) {
      break;
    }

    ahv = newAhv;
    taxableIncome = Math.max(0, netBusinessIncome - ahv - otherDeductions);
  }

  return {
    taxableIncome: Math.max(0, taxableIncome),
    ahvContribution: ahv,
  };
}

/**
 * Calculate total income for mixed employment (employed + self-employed)
 *
 * @param employedIncome - Gross salary from employment
 * @param selfEmployedIncome - Net income from self-employment
 * @returns Total income for tax calculation purposes
 */
export function calculateMixedIncome(
  employedIncome: number,
  selfEmployedIncome: number
): number {
  // Both incomes are added together for tax purposes
  // Note: Self-employed AHV is deducted separately
  return employedIncome + selfEmployedIncome;
}
