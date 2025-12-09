import type {
  BudgetInputs,
  BudgetBreakdown,
  BudgetCategoryBreakdown,
  BudgetGuideline,
  BudgetComparisonResult,
} from '../types/budget';
import type { TaxBreakdown, TaxpayerProfile } from '../types';
import {
  getCostOfLiving,
  getAverageRent,
  getHealthInsurancePremium,
  getChildcareCost,
  getEstimatedUtilities,
} from '../data/costOfLiving';
import { SWISS_BUDGET_GUIDELINES, CHILD_COST_ESTIMATES } from '../types/budget';

// ============================================
// Budget Calculation
// ============================================

export interface BudgetCalculationInput {
  taxpayer: TaxpayerProfile;
  taxResults: TaxBreakdown;
  budgetInputs: BudgetInputs;
}

/**
 * Calculate the full budget breakdown
 */
export function calculateBudget(input: BudgetCalculationInput): BudgetBreakdown {
  const { taxpayer, taxResults, budgetInputs } = input;
  const cantonCode = taxpayer.canton;

  // Calculate each category
  const categories = calculateCategories(budgetInputs, taxpayer, cantonCode);

  // Sum up total expenses
  const totalExpenses =
    categories.housing.total +
    categories.healthcare.total +
    categories.children.total +
    categories.transportation.total +
    categories.food.total +
    categories.telecommunications.total +
    categories.insurance.total +
    categories.personal.total +
    categories.savings.total +
    categories.other.total;

  const monthlyExpenses = totalExpenses;
  const annualExpenses = totalExpenses * 12;

  // Calculate disposable income
  const monthlyNetIncome = taxResults.netIncome / 12;
  const disposableIncome = taxResults.netIncome - annualExpenses;
  const monthlyDisposableIncome = monthlyNetIncome - monthlyExpenses;

  // Calculate ratios
  const savingsRate = monthlyNetIncome > 0
    ? (categories.savings.total / monthlyNetIncome) * 100
    : 0;
  const housingRatio = monthlyNetIncome > 0
    ? (categories.housing.total / monthlyNetIncome) * 100
    : 0;

  // Generate budget guidelines
  const guidelines = generateGuidelines(categories, monthlyNetIncome);

  return {
    grossIncome: taxResults.grossIncome,
    netIncome: taxResults.netIncome,
    monthlyNetIncome,

    categories,
    totalExpenses: annualExpenses,
    monthlyExpenses,

    disposableIncome,
    monthlyDisposableIncome,

    savingsRate,
    housingRatio,
    guidelines,

    isBalanced: monthlyDisposableIncome >= 0,
    surplus: monthlyDisposableIncome,
  };
}

/**
 * Calculate all budget categories
 */
function calculateCategories(
  inputs: BudgetInputs,
  taxpayer: TaxpayerProfile,
  cantonCode: string
): BudgetCategoryBreakdown {
  const numChildren = taxpayer.numberOfChildren;
  const isMarried = taxpayer.civilStatus === 'married';
  const numAdults = isMarried ? 2 : 1;

  // Housing
  const rentAmount = inputs.customRent ??
    getAverageRent(cantonCode, inputs.locationType, inputs.apartmentSize) ??
    1800;
  const utilities = getEstimatedUtilities(inputs.apartmentSize);

  // Healthcare (adults - multiply by number of adults)
  const perAdultInsurance = inputs.customHealthInsurance ??
    getHealthInsurancePremium(cantonCode, inputs.healthInsuranceModel) ??
    400;
  const insurancePremium = perAdultInsurance * numAdults;
  // Estimate out-of-pocket costs (franchise + copay) per adult
  const outOfPocketPerAdult = inputs.healthInsuranceModel === 'highDeductible' ? 150 : 50;
  const outOfPocket = outOfPocketPerAdult * numAdults;

  // Children costs
  const childHealthInsurance = numChildren > 0
    ? (getHealthInsurancePremium(cantonCode, 'standard', true) ?? 100) * numChildren
    : 0;

  // Childcare
  let childcareCost = 0;
  if (inputs.childcareType !== 'none' && inputs.childrenInDaycare > 0) {
    const perChildCost = inputs.customChildcare ??
      getChildcareCost(
        cantonCode,
        inputs.childcareType === 'afterSchool' ? 'afterSchool' : inputs.childcareType
      ) ?? 0;
    childcareCost = perChildCost * inputs.childrenInDaycare;
  }

  // Additional child costs (food, clothing, education, activities)
  const childFood = numChildren * CHILD_COST_ESTIMATES.food;
  const childClothing = numChildren * CHILD_COST_ESTIMATES.clothing;
  const childEducation = numChildren * CHILD_COST_ESTIMATES.education;

  const totalChildrenCosts = childHealthInsurance + childcareCost + childFood + childClothing + childEducation;

  // Transportation
  const publicTransport = inputs.hasPublicTransportPass ? inputs.publicTransportCost : 0;
  const carCosts = inputs.hasCar ? inputs.carCosts : 0;

  // Food (adults only - child food is in children category)
  // Scale by number of adults (married = 2 adults sharing meals, ~1.7x single cost)
  const adultFoodMultiplier = isMarried ? 1.7 : 1;
  const groceries = Math.round(inputs.groceriesCost * adultFoodMultiplier);
  const diningOut = Math.round(inputs.diningOutCost * adultFoodMultiplier);

  // Telecommunications (phone per adult, internet/streaming shared)
  const phone = inputs.phonePlan * numAdults;
  const internet = inputs.internetCost;
  const streaming = inputs.streamingServices;

  // Insurance (non-health)
  const liability = inputs.liabilityInsurance;
  const household = inputs.householdInsurance;
  const otherInsurance = inputs.otherInsurance;

  // Personal (scale clothing and care per adult, entertainment/hobbies shared)
  const clothing = inputs.clothingBudget * numAdults;
  const care = inputs.personalCare * numAdults;
  const entertainment = inputs.entertainmentBudget;
  const hobbies = inputs.hobbies;

  // Savings
  const generalSavings = inputs.savingsTarget;
  const emergency = inputs.emergencyFund;
  const investments = inputs.investmentContribution;

  // Other
  const vacation = inputs.vacationBudget;
  const gifts = inputs.giftsBudget;
  const other = inputs.otherExpenses;

  return {
    housing: {
      rent: rentAmount,
      utilities,
      total: rentAmount + utilities,
    },
    healthcare: {
      insurance: insurancePremium,
      outOfPocket,
      total: insurancePremium + outOfPocket,
    },
    children: {
      healthInsurance: childHealthInsurance,
      childcare: childcareCost,
      food: childFood,
      clothing: childClothing,
      education: childEducation,
      total: totalChildrenCosts,
    },
    transportation: {
      publicTransport,
      car: carCosts,
      total: publicTransport + carCosts,
    },
    food: {
      groceries,
      diningOut,
      total: groceries + diningOut,
    },
    telecommunications: {
      phone,
      internet,
      streaming,
      total: phone + internet + streaming,
    },
    insurance: {
      liability,
      household,
      other: otherInsurance,
      total: liability + household + otherInsurance,
    },
    personal: {
      clothing,
      care,
      entertainment,
      hobbies,
      total: clothing + care + entertainment + hobbies,
    },
    savings: {
      general: generalSavings,
      emergency,
      investments,
      total: generalSavings + emergency + investments,
    },
    other: {
      vacation,
      gifts,
      miscellaneous: other,
      total: vacation + gifts + other,
    },
  };
}

/**
 * Generate budget guidelines with status indicators
 */
function generateGuidelines(
  categories: BudgetCategoryBreakdown,
  monthlyNetIncome: number
): BudgetGuideline[] {
  if (monthlyNetIncome <= 0) return [];

  const guidelines: BudgetGuideline[] = [];

  // Housing guideline (25-30%)
  const housingPercent = (categories.housing.total / monthlyNetIncome) * 100;
  guidelines.push({
    category: 'Housing',
    recommendedPercentage: SWISS_BUDGET_GUIDELINES.housing,
    actualPercentage: housingPercent,
    actualAmount: categories.housing.total,
    status: housingPercent <= 25 ? 'good' : housingPercent <= 33 ? 'warning' : 'over',
    message: housingPercent <= 25
      ? 'Housing costs are within recommended limits'
      : housingPercent <= 33
        ? 'Housing costs are slightly above recommended 25%'
        : 'Housing costs exceed recommended maximum of 33%',
  });

  // Healthcare guideline (10%)
  const healthcarePercent = (categories.healthcare.total / monthlyNetIncome) * 100;
  guidelines.push({
    category: 'Healthcare',
    recommendedPercentage: SWISS_BUDGET_GUIDELINES.healthcare,
    actualPercentage: healthcarePercent,
    actualAmount: categories.healthcare.total,
    status: healthcarePercent <= 10 ? 'good' : healthcarePercent <= 15 ? 'warning' : 'over',
    message: healthcarePercent <= 10
      ? 'Healthcare costs are within budget'
      : healthcarePercent <= 15
        ? 'Healthcare costs are above average'
        : 'Consider optimizing health insurance (higher deductible)',
  });

  // Food guideline (10%)
  const foodPercent = (categories.food.total / monthlyNetIncome) * 100;
  guidelines.push({
    category: 'Food',
    recommendedPercentage: SWISS_BUDGET_GUIDELINES.food,
    actualPercentage: foodPercent,
    actualAmount: categories.food.total,
    status: foodPercent <= 10 ? 'good' : foodPercent <= 15 ? 'warning' : 'over',
    message: foodPercent <= 10
      ? 'Food budget is well managed'
      : foodPercent <= 15
        ? 'Food costs are above recommended 10%'
        : 'Consider reducing dining out expenses',
  });

  // Transportation guideline (8%)
  const transportPercent = (categories.transportation.total / monthlyNetIncome) * 100;
  guidelines.push({
    category: 'Transportation',
    recommendedPercentage: SWISS_BUDGET_GUIDELINES.transportation,
    actualPercentage: transportPercent,
    actualAmount: categories.transportation.total,
    status: transportPercent <= 8 ? 'good' : transportPercent <= 12 ? 'warning' : 'over',
    message: transportPercent <= 8
      ? 'Transportation costs are efficient'
      : transportPercent <= 12
        ? 'Transportation costs are above average'
        : 'Consider public transport over car ownership',
  });

  // Savings guideline (10%)
  // Note: Only shows explicitly budgeted savings - disposable income is additional potential savings
  const savingsPercent = (categories.savings.total / monthlyNetIncome) * 100;
  guidelines.push({
    category: 'Savings (Budgeted)',
    recommendedPercentage: SWISS_BUDGET_GUIDELINES.savings,
    actualPercentage: savingsPercent,
    actualAmount: categories.savings.total,
    status: savingsPercent >= 10 ? 'good' : savingsPercent >= 5 ? 'warning' : 'over',
    message: savingsPercent >= 10
      ? 'Great savings rate! You\'re building wealth'
      : savingsPercent >= 5
        ? 'Try to increase savings to at least 10%'
        : 'Savings are below recommended minimum',
  });

  return guidelines;
}

// ============================================
// Budget Comparison Across Cantons
// ============================================

import { calculateTaxForComparison } from './taxCalculator';
import type { TaxCalculationInput } from '../types';
import { allMunicipalities, cantonList } from '../data/cantons';

/**
 * Compare budget outcomes across all municipalities
 * This combines tax differences with cost of living differences
 */
export function calculateBudgetComparison(
  taxInput: TaxCalculationInput,
  budgetInputs: BudgetInputs
): BudgetComparisonResult[] {
  const results: BudgetComparisonResult[] = [];

  for (const municipality of allMunicipalities) {
    const cantonCode = municipality.cantonCode;
    const costData = getCostOfLiving(cantonCode);

    // Skip if no cost data
    if (!costData) continue;

    // Calculate taxes for this municipality
    const taxBreakdown = calculateTaxForComparison(
      taxInput,
      cantonCode,
      municipality.id
    );

    if (!taxBreakdown) continue;

    // Get location type based on municipality
    // For simplicity, we'll use urban for main cities, suburban for others
    const isUrban = costData.referenceCities.urban.toLowerCase() ===
      municipality.name.toLowerCase();
    const locationType = isUrban ? 'urban' : 'suburban';

    // Calculate estimated costs for this location
    const estimatedRent = getAverageRent(
      cantonCode,
      locationType,
      budgetInputs.apartmentSize
    ) ?? 1800;

    const estimatedHealthInsurance = (
      getHealthInsurancePremium(cantonCode, budgetInputs.healthInsuranceModel) ?? 400
    );

    let estimatedChildcare = 0;
    if (budgetInputs.childcareType !== 'none' && budgetInputs.childrenInDaycare > 0) {
      const perChildCost = getChildcareCost(
        cantonCode,
        budgetInputs.childcareType === 'afterSchool' ? 'afterSchool' : budgetInputs.childcareType
      ) ?? 0;
      estimatedChildcare = perChildCost * budgetInputs.childrenInDaycare;
    }

    // Calculate total monthly living cost
    // Fixed costs: rent, health insurance, childcare
    // Variable costs scaled by cost index
    const costIndex = costData.costIndex.overall / 100;
    const fixedCosts = estimatedRent + estimatedHealthInsurance + estimatedChildcare;

    // Scale variable costs by cost index
    const variableCosts = (
      budgetInputs.groceriesCost +
      budgetInputs.diningOutCost +
      budgetInputs.publicTransportCost +
      budgetInputs.entertainmentBudget
    ) * costIndex;

    const totalMonthlyCost = fixedCosts + variableCosts;

    // Calculate disposable income
    const monthlyNetIncome = taxBreakdown.netIncome / 12;
    const monthlyDisposableIncome = monthlyNetIncome - totalMonthlyCost;

    results.push({
      cantonCode,
      cantonName: cantonList.find(c => c.code === cantonCode)?.name || cantonCode,
      municipalityId: municipality.id,
      municipalityName: municipality.name,

      totalTax: taxBreakdown.totalTax,
      netIncome: taxBreakdown.netIncome,

      estimatedRent,
      estimatedHealthInsurance,
      estimatedChildcare,
      totalMonthlyCost,

      monthlyDisposableIncome,
      annualDisposableIncome: monthlyDisposableIncome * 12,

      ranking: 0,
      differenceFromBest: 0,
    });
  }

  // Sort by disposable income (highest first) and calculate rankings
  results.sort((a, b) => b.monthlyDisposableIncome - a.monthlyDisposableIncome);

  const bestDisposable = results[0]?.monthlyDisposableIncome || 0;

  results.forEach((result, index) => {
    result.ranking = index + 1;
    result.differenceFromBest = bestDisposable - result.monthlyDisposableIncome;
  });

  return results;
}

/**
 * Get budget suggestions based on current inputs
 */
export function getBudgetSuggestions(budget: BudgetBreakdown): string[] {
  const suggestions: string[] = [];

  // Calculate budgeted savings
  const budgetedSavings = budget.categories.savings.total;

  // Deficit warning (highest priority)
  if (!budget.isBalanced) {
    suggestions.push(
      `Your expenses exceed income by CHF ${Math.abs(Math.round(budget.surplus))}/month. Review and reduce non-essential spending.`
    );
  }

  // Housing suggestions
  if (budget.housingRatio > 30) {
    suggestions.push(
      'Consider moving to a smaller apartment or suburban area to reduce housing costs'
    );
  }

  // Savings suggestions - consider both budgeted and disposable
  if (budget.savingsRate < 10 && budget.monthlyDisposableIncome > 0) {
    // They have low budgeted savings but have disposable income
    const totalPotentialSavings = budgetedSavings + budget.monthlyDisposableIncome;
    const potentialRate = (totalPotentialSavings / budget.monthlyNetIncome) * 100;

    if (potentialRate >= 10) {
      suggestions.push(
        `You have CHF ${Math.round(budget.monthlyDisposableIncome)} unallocated each month. Consider moving this to your savings budget for a ${Math.round(potentialRate)}% effective savings rate.`
      );
    } else {
      const neededSavings = budget.monthlyNetIncome * 0.1;
      suggestions.push(
        `Increase monthly savings by CHF ${Math.round(neededSavings - totalPotentialSavings)} to reach 10% savings rate`
      );
    }
  } else if (budget.savingsRate < 10) {
    const neededSavings = budget.monthlyNetIncome * 0.1;
    suggestions.push(
      `Increase monthly savings by CHF ${Math.round(neededSavings - budgetedSavings)} to reach 10% savings rate`
    );
  }

  // High disposable income suggestion - encourage intentional allocation
  if (budget.monthlyDisposableIncome > budget.monthlyNetIncome * 0.2) {
    suggestions.push(
      `You have ${Math.round((budget.monthlyDisposableIncome / budget.monthlyNetIncome) * 100)}% of income unallocated. Consider increasing Pillar 3a contributions, investments, or budgeting for future goals.`
    );
  }

  // Transportation suggestions
  if (budget.categories.transportation.car > 500) {
    suggestions.push(
      'Car costs are high. Consider if public transport (GA card) would be more economical'
    );
  }

  // Food suggestions
  if (budget.categories.food.diningOut > budget.categories.food.groceries * 0.5) {
    suggestions.push(
      'Dining out expenses are high. Cooking more at home could save significantly'
    );
  }

  return suggestions;
}
