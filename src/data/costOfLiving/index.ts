import type { CantonCostOfLiving } from '../../types/budget';
import { zurichCostOfLiving } from './zh';
import { zugCostOfLiving } from './zug';
import { schwyzCostOfLiving } from './schwyz';

// All canton cost of living configurations
export const costOfLivingByCantonCode: Record<string, CantonCostOfLiving> = {
  ZH: zurichCostOfLiving,
  ZG: zugCostOfLiving,
  SZ: schwyzCostOfLiving,
};

// Helper functions
export const getCostOfLiving = (cantonCode: string): CantonCostOfLiving | undefined => {
  return costOfLivingByCantonCode[cantonCode];
};

export const getAllCostOfLivingData = (): CantonCostOfLiving[] => {
  return Object.values(costOfLivingByCantonCode);
};

// Get average rent for a canton and configuration
export const getAverageRent = (
  cantonCode: string,
  locationType: 'urban' | 'suburban',
  apartmentSize: 'studio' | 'twoRoom' | 'threeRoom' | 'fourPlusRoom'
): number | undefined => {
  const costData = getCostOfLiving(cantonCode);
  if (!costData) return undefined;
  return costData.rent[locationType][apartmentSize];
};

// Get health insurance premium
export const getHealthInsurancePremium = (
  cantonCode: string,
  model: 'standard' | 'highDeductible',
  isChild: boolean = false,
  isYoungAdult: boolean = false
): number | undefined => {
  const costData = getCostOfLiving(cantonCode);
  if (!costData) return undefined;

  if (isChild) return costData.healthInsurance.child;
  if (isYoungAdult) return costData.healthInsurance.youngAdult;

  return model === 'standard'
    ? costData.healthInsurance.adultStandard
    : costData.healthInsurance.adultHighDeductible;
};

// Get childcare cost
export const getChildcareCost = (
  cantonCode: string,
  type: 'fullTime' | 'partTime' | 'afterSchool'
): number | undefined => {
  const costData = getCostOfLiving(cantonCode);
  if (!costData) return undefined;

  switch (type) {
    case 'fullTime':
      return costData.childcare.daycareFullTime;
    case 'partTime':
      return costData.childcare.daycarePartTime;
    case 'afterSchool':
      return costData.childcare.afterSchool;
  }
};

// Get cost index for comparing cantons
export const getCostIndex = (
  cantonCode: string,
  category: 'overall' | 'housing' | 'groceries' | 'transport' | 'healthcare' = 'overall'
): number | undefined => {
  const costData = getCostOfLiving(cantonCode);
  if (!costData) return undefined;
  return costData.costIndex[category];
};

// Calculate estimated monthly utilities based on apartment size
export const getEstimatedUtilities = (
  apartmentSize: 'studio' | 'twoRoom' | 'threeRoom' | 'fourPlusRoom'
): number => {
  const estimates = {
    studio: 80,
    twoRoom: 120,
    threeRoom: 150,
    fourPlusRoom: 200,
  };
  return estimates[apartmentSize];
};

// Export individual canton data for direct imports
export { zurichCostOfLiving } from './zh';
export { zugCostOfLiving } from './zug';
export { schwyzCostOfLiving } from './schwyz';
