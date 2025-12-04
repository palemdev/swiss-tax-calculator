import type { CantonalTaxConfig, Municipality } from '../../types';

// Vaud Canton Tax Configuration 2024
export const vaudConfig: CantonalTaxConfig = {
  cantonCode: 'VD',
  cantonName: 'Vaud',
  cantonNameDe: 'Waadt',
  cantonNameFr: 'Vaud',
  year: 2024,
  taxMultiplier: 154.5, // Cantonal coefficient

  tariffs: {
    single: [
      { minIncome: 0, maxIncome: 16300, baseAmount: 0, rate: 0 },
      { minIncome: 16300, maxIncome: 22700, baseAmount: 0, rate: 1.98 },
      { minIncome: 22700, maxIncome: 29300, baseAmount: 126.72, rate: 2.83 },
      { minIncome: 29300, maxIncome: 38100, baseAmount: 313.50, rate: 3.68 },
      { minIncome: 38100, maxIncome: 49300, baseAmount: 637.34, rate: 4.53 },
      { minIncome: 49300, maxIncome: 63200, baseAmount: 1144.70, rate: 5.38 },
      { minIncome: 63200, maxIncome: 79600, baseAmount: 1892.48, rate: 6.23 },
      { minIncome: 79600, maxIncome: 103900, baseAmount: 2914.60, rate: 6.80 },
      { minIncome: 103900, maxIncome: 134700, baseAmount: 4567.00, rate: 7.93 },
      { minIncome: 134700, maxIncome: 175700, baseAmount: 7009.44, rate: 8.78 },
      { minIncome: 175700, maxIncome: 229900, baseAmount: 10609.24, rate: 9.63 },
      { minIncome: 229900, maxIncome: 313700, baseAmount: 15829.00, rate: 10.48 },
      { minIncome: 313700, maxIncome: null, baseAmount: 24613.04, rate: 11.05 },
    ],
    married: [
      { minIncome: 0, maxIncome: 30300, baseAmount: 0, rate: 0 },
      { minIncome: 30300, maxIncome: 43900, baseAmount: 0, rate: 1.98 },
      { minIncome: 43900, maxIncome: 57500, baseAmount: 269.28, rate: 2.83 },
      { minIncome: 57500, maxIncome: 74700, baseAmount: 654.16, rate: 3.68 },
      { minIncome: 74700, maxIncome: 95900, baseAmount: 1287.12, rate: 4.53 },
      { minIncome: 95900, maxIncome: 123000, baseAmount: 2247.66, rate: 5.38 },
      { minIncome: 123000, maxIncome: 156000, baseAmount: 3705.84, rate: 6.23 },
      { minIncome: 156000, maxIncome: 202600, baseAmount: 5762.94, rate: 6.80 },
      { minIncome: 202600, maxIncome: 262600, baseAmount: 8931.74, rate: 7.93 },
      { minIncome: 262600, maxIncome: 342800, baseAmount: 13691.74, rate: 8.78 },
      { minIncome: 342800, maxIncome: 449000, baseAmount: 20733.30, rate: 9.63 },
      { minIncome: 449000, maxIncome: 611500, baseAmount: 30959.94, rate: 10.48 },
      { minIncome: 611500, maxIncome: null, baseAmount: 47990.02, rate: 11.05 },
    ],
  },

  deductionLimits: {
    professionalExpenses: {
      flatRate: 2600,
      maxCommuting: 7000,
      maxMeals: 3200,
      maxOther: 2400,
    },
    insurancePremiums: {
      single: 3000,
      married: 6000,
      perChild: 1500,
    },
    pillar3a: {
      withPension: 7056,
      withoutPension: 35280,
    },
    childDeduction: 7700,
    childcareDeduction: 7100,
    marriedDeduction: 0,
    socialDeductions: {
      single: 0,
      married: 0,
    },
  },
};

// Vaud Municipalities
export const vaudMunicipalities: Municipality[] = [
  { id: 'vd-lausanne', name: 'Lausanne', cantonCode: 'VD', taxMultiplier: 79, churchTaxMultipliers: { catholic: 9.0, protestant: 9.0, christCatholic: 0 } },
  { id: 'vd-nyon', name: 'Nyon', cantonCode: 'VD', taxMultiplier: 73.5, churchTaxMultipliers: { catholic: 8.5, protestant: 8.5, christCatholic: 0 } },
  { id: 'vd-montreux', name: 'Montreux', cantonCode: 'VD', taxMultiplier: 72.5, churchTaxMultipliers: { catholic: 8.5, protestant: 8.5, christCatholic: 0 } },
  { id: 'vd-vevey', name: 'Vevey', cantonCode: 'VD', taxMultiplier: 76.5, churchTaxMultipliers: { catholic: 9.0, protestant: 9.0, christCatholic: 0 } },
  { id: 'vd-yverdon', name: 'Yverdon-les-Bains', cantonCode: 'VD', taxMultiplier: 79.5, churchTaxMultipliers: { catholic: 9.0, protestant: 9.0, christCatholic: 0 } },
  { id: 'vd-renens', name: 'Renens', cantonCode: 'VD', taxMultiplier: 78.5, churchTaxMultipliers: { catholic: 9.0, protestant: 9.0, christCatholic: 0 } },
  { id: 'vd-pully', name: 'Pully', cantonCode: 'VD', taxMultiplier: 70, churchTaxMultipliers: { catholic: 8.0, protestant: 8.0, christCatholic: 0 } },
  { id: 'vd-morges', name: 'Morges', cantonCode: 'VD', taxMultiplier: 72, churchTaxMultipliers: { catholic: 8.5, protestant: 8.5, christCatholic: 0 } },
  { id: 'vd-ecublens', name: 'Ecublens', cantonCode: 'VD', taxMultiplier: 74, churchTaxMultipliers: { catholic: 8.5, protestant: 8.5, christCatholic: 0 } },
  { id: 'vd-prilly', name: 'Prilly', cantonCode: 'VD', taxMultiplier: 77, churchTaxMultipliers: { catholic: 9.0, protestant: 9.0, christCatholic: 0 } },
  { id: 'vd-gland', name: 'Gland', cantonCode: 'VD', taxMultiplier: 71, churchTaxMultipliers: { catholic: 8.0, protestant: 8.0, christCatholic: 0 } },
  { id: 'vd-aigle', name: 'Aigle', cantonCode: 'VD', taxMultiplier: 74.5, churchTaxMultipliers: { catholic: 8.5, protestant: 8.5, christCatholic: 0 } },
];
