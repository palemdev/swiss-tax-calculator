import type { CantonalTaxConfig, Municipality } from '../../types';

// Bern Canton Tax Configuration 2025
export const bernConfig: CantonalTaxConfig = {
  cantonCode: 'BE',
  cantonName: 'Bern',
  cantonNameDe: 'Bern',
  cantonNameFr: 'Berne',
  year: 2025,
  taxMultiplier: 100,

  tariffs: {
    single: [
      { minIncome: 0, maxIncome: 10000, baseAmount: 0, rate: 0 },
      { minIncome: 10000, maxIncome: 20000, baseAmount: 0, rate: 2.20 },
      { minIncome: 20000, maxIncome: 30000, baseAmount: 220.00, rate: 3.30 },
      { minIncome: 30000, maxIncome: 40000, baseAmount: 550.00, rate: 4.40 },
      { minIncome: 40000, maxIncome: 50000, baseAmount: 990.00, rate: 5.50 },
      { minIncome: 50000, maxIncome: 75000, baseAmount: 1540.00, rate: 6.60 },
      { minIncome: 75000, maxIncome: 100000, baseAmount: 3190.00, rate: 7.70 },
      { minIncome: 100000, maxIncome: 150000, baseAmount: 5115.00, rate: 8.80 },
      { minIncome: 150000, maxIncome: 250000, baseAmount: 9515.00, rate: 9.35 },
      { minIncome: 250000, maxIncome: 400000, baseAmount: 18865.00, rate: 9.68 },
      { minIncome: 400000, maxIncome: null, baseAmount: 33385.00, rate: 9.68 },
    ],
    married: [
      { minIncome: 0, maxIncome: 20000, baseAmount: 0, rate: 0 },
      { minIncome: 20000, maxIncome: 40000, baseAmount: 0, rate: 2.20 },
      { minIncome: 40000, maxIncome: 60000, baseAmount: 440.00, rate: 3.30 },
      { minIncome: 60000, maxIncome: 80000, baseAmount: 1100.00, rate: 4.40 },
      { minIncome: 80000, maxIncome: 100000, baseAmount: 1980.00, rate: 5.50 },
      { minIncome: 100000, maxIncome: 150000, baseAmount: 3080.00, rate: 6.60 },
      { minIncome: 150000, maxIncome: 200000, baseAmount: 6380.00, rate: 7.70 },
      { minIncome: 200000, maxIncome: 300000, baseAmount: 10230.00, rate: 8.80 },
      { minIncome: 300000, maxIncome: 500000, baseAmount: 19030.00, rate: 9.35 },
      { minIncome: 500000, maxIncome: 800000, baseAmount: 37730.00, rate: 9.68 },
      { minIncome: 800000, maxIncome: null, baseAmount: 66770.00, rate: 9.68 },
    ],
  },

  deductionLimits: {
    professionalExpenses: {
      flatRate: 2400,
      maxCommuting: 6600,
      maxMeals: 3200,
      maxOther: 2400,
    },
    insurancePremiums: {
      single: 2800,
      married: 5600,
      perChild: 1400,
    },
    pillar3a: {
      withPension: 7056,
      withoutPension: 35280,
    },
    childDeduction: 8000,
    childcareDeduction: 8000,
    marriedDeduction: 0, // Included in tariff
    socialDeductions: {
      single: 0,
      married: 0,
    },
  },
};

// Bern Municipalities
export const bernMunicipalities: Municipality[] = [
  { id: 'be-bern', name: 'Bern', cantonCode: 'BE', taxMultiplier: 154.5, churchTaxMultipliers: { catholic: 18.19, protestant: 16.76, christCatholic: 15.0 } },
  { id: 'be-thun', name: 'Thun', cantonCode: 'BE', taxMultiplier: 155, churchTaxMultipliers: { catholic: 17.5, protestant: 16.0, christCatholic: 15.0 } },
  { id: 'be-biel', name: 'Biel/Bienne', cantonCode: 'BE', taxMultiplier: 169, churchTaxMultipliers: { catholic: 18.0, protestant: 17.0, christCatholic: 16.0 } },
  { id: 'be-koniz', name: 'Köniz', cantonCode: 'BE', taxMultiplier: 151, churchTaxMultipliers: { catholic: 17.0, protestant: 16.0, christCatholic: 15.0 } },
  { id: 'be-muri', name: 'Muri bei Bern', cantonCode: 'BE', taxMultiplier: 146, churchTaxMultipliers: { catholic: 16.5, protestant: 15.5, christCatholic: 14.5 } },
  { id: 'be-ostermundigen', name: 'Ostermundigen', cantonCode: 'BE', taxMultiplier: 152, churchTaxMultipliers: { catholic: 17.0, protestant: 16.0, christCatholic: 15.0 } },
  { id: 'be-bolligen', name: 'Bolligen', cantonCode: 'BE', taxMultiplier: 148, churchTaxMultipliers: { catholic: 16.5, protestant: 15.5, christCatholic: 14.5 } },
  { id: 'be-worb', name: 'Worb', cantonCode: 'BE', taxMultiplier: 155, churchTaxMultipliers: { catholic: 17.0, protestant: 16.0, christCatholic: 15.0 } },
  { id: 'be-spiez', name: 'Spiez', cantonCode: 'BE', taxMultiplier: 156, churchTaxMultipliers: { catholic: 17.0, protestant: 16.0, christCatholic: 15.0 } },
  { id: 'be-langenthal', name: 'Langenthal', cantonCode: 'BE', taxMultiplier: 161, churchTaxMultipliers: { catholic: 17.5, protestant: 16.5, christCatholic: 15.5 } },
  { id: 'be-burgdorf', name: 'Burgdorf', cantonCode: 'BE', taxMultiplier: 163, churchTaxMultipliers: { catholic: 17.5, protestant: 16.5, christCatholic: 15.5 } },
  { id: 'be-interlaken', name: 'Interlaken', cantonCode: 'BE', taxMultiplier: 148, churchTaxMultipliers: { catholic: 16.5, protestant: 15.5, christCatholic: 14.5 } },
];
