import type { CantonalTaxConfig, Municipality } from '../../types';

// Basel-Stadt Canton Tax Configuration 2024
export const baselStadtConfig: CantonalTaxConfig = {
  cantonCode: 'BS',
  cantonName: 'Basel-Stadt',
  cantonNameDe: 'Basel-Stadt',
  cantonNameFr: 'Bâle-Ville',
  year: 2024,
  taxMultiplier: 100,

  tariffs: {
    single: [
      { minIncome: 0, maxIncome: 11000, baseAmount: 0, rate: 0 },
      { minIncome: 11000, maxIncome: 16000, baseAmount: 0, rate: 2.50 },
      { minIncome: 16000, maxIncome: 22000, baseAmount: 125.00, rate: 5.00 },
      { minIncome: 22000, maxIncome: 30000, baseAmount: 425.00, rate: 7.50 },
      { minIncome: 30000, maxIncome: 40000, baseAmount: 1025.00, rate: 10.00 },
      { minIncome: 40000, maxIncome: 50000, baseAmount: 2025.00, rate: 12.00 },
      { minIncome: 50000, maxIncome: 75000, baseAmount: 3225.00, rate: 14.50 },
      { minIncome: 75000, maxIncome: 100000, baseAmount: 6850.00, rate: 16.50 },
      { minIncome: 100000, maxIncome: 150000, baseAmount: 10975.00, rate: 19.00 },
      { minIncome: 150000, maxIncome: 200000, baseAmount: 20475.00, rate: 21.50 },
      { minIncome: 200000, maxIncome: 300000, baseAmount: 31225.00, rate: 23.50 },
      { minIncome: 300000, maxIncome: null, baseAmount: 54725.00, rate: 24.00 },
    ],
    married: [
      { minIncome: 0, maxIncome: 22000, baseAmount: 0, rate: 0 },
      { minIncome: 22000, maxIncome: 32000, baseAmount: 0, rate: 2.50 },
      { minIncome: 32000, maxIncome: 44000, baseAmount: 250.00, rate: 5.00 },
      { minIncome: 44000, maxIncome: 60000, baseAmount: 850.00, rate: 7.50 },
      { minIncome: 60000, maxIncome: 80000, baseAmount: 2050.00, rate: 10.00 },
      { minIncome: 80000, maxIncome: 100000, baseAmount: 4050.00, rate: 12.00 },
      { minIncome: 100000, maxIncome: 150000, baseAmount: 6450.00, rate: 14.50 },
      { minIncome: 150000, maxIncome: 200000, baseAmount: 13700.00, rate: 16.50 },
      { minIncome: 200000, maxIncome: 300000, baseAmount: 21950.00, rate: 19.00 },
      { minIncome: 300000, maxIncome: 400000, baseAmount: 40950.00, rate: 21.50 },
      { minIncome: 400000, maxIncome: 600000, baseAmount: 62450.00, rate: 23.50 },
      { minIncome: 600000, maxIncome: null, baseAmount: 109450.00, rate: 24.00 },
    ],
  },

  deductionLimits: {
    professionalExpenses: {
      flatRate: 3000,
      maxCommuting: 6000,
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
    childDeduction: 7500,
    childcareDeduction: 5000,
    marriedDeduction: 0,
    socialDeductions: {
      single: 0,
      married: 0,
    },
  },
};

// Basel-Stadt has only 3 municipalities
export const baselStadtMunicipalities: Municipality[] = [
  { id: 'bs-basel', name: 'Basel', cantonCode: 'BS', taxMultiplier: 120, churchTaxMultipliers: { catholic: 8, protestant: 8, christCatholic: 6 } },
  { id: 'bs-riehen', name: 'Riehen', cantonCode: 'BS', taxMultiplier: 106, churchTaxMultipliers: { catholic: 7, protestant: 7, christCatholic: 5 } },
  { id: 'bs-bettingen', name: 'Bettingen', cantonCode: 'BS', taxMultiplier: 95, churchTaxMultipliers: { catholic: 6, protestant: 6, christCatholic: 5 } },
];

// Basel-Landschaft Canton Tax Configuration 2024
export const baselLandConfig: CantonalTaxConfig = {
  cantonCode: 'BL',
  cantonName: 'Basel-Landschaft',
  cantonNameDe: 'Basel-Landschaft',
  cantonNameFr: 'Bâle-Campagne',
  year: 2024,
  taxMultiplier: 100,

  tariffs: {
    single: [
      { minIncome: 0, maxIncome: 10000, baseAmount: 0, rate: 0 },
      { minIncome: 10000, maxIncome: 20000, baseAmount: 0, rate: 4.00 },
      { minIncome: 20000, maxIncome: 30000, baseAmount: 400.00, rate: 6.00 },
      { minIncome: 30000, maxIncome: 40000, baseAmount: 1000.00, rate: 8.00 },
      { minIncome: 40000, maxIncome: 50000, baseAmount: 1800.00, rate: 10.00 },
      { minIncome: 50000, maxIncome: 70000, baseAmount: 2800.00, rate: 12.00 },
      { minIncome: 70000, maxIncome: 90000, baseAmount: 5200.00, rate: 14.00 },
      { minIncome: 90000, maxIncome: 120000, baseAmount: 8000.00, rate: 16.00 },
      { minIncome: 120000, maxIncome: 160000, baseAmount: 12800.00, rate: 17.00 },
      { minIncome: 160000, maxIncome: 250000, baseAmount: 19600.00, rate: 18.00 },
      { minIncome: 250000, maxIncome: null, baseAmount: 35800.00, rate: 18.60 },
    ],
    married: [
      { minIncome: 0, maxIncome: 20000, baseAmount: 0, rate: 0 },
      { minIncome: 20000, maxIncome: 40000, baseAmount: 0, rate: 4.00 },
      { minIncome: 40000, maxIncome: 60000, baseAmount: 800.00, rate: 6.00 },
      { minIncome: 60000, maxIncome: 80000, baseAmount: 2000.00, rate: 8.00 },
      { minIncome: 80000, maxIncome: 100000, baseAmount: 3600.00, rate: 10.00 },
      { minIncome: 100000, maxIncome: 140000, baseAmount: 5600.00, rate: 12.00 },
      { minIncome: 140000, maxIncome: 180000, baseAmount: 10400.00, rate: 14.00 },
      { minIncome: 180000, maxIncome: 240000, baseAmount: 16000.00, rate: 16.00 },
      { minIncome: 240000, maxIncome: 320000, baseAmount: 25600.00, rate: 17.00 },
      { minIncome: 320000, maxIncome: 500000, baseAmount: 39200.00, rate: 18.00 },
      { minIncome: 500000, maxIncome: null, baseAmount: 71600.00, rate: 18.60 },
    ],
  },

  deductionLimits: {
    professionalExpenses: {
      flatRate: 2400,
      maxCommuting: 5600,
      maxMeals: 3200,
      maxOther: 2000,
    },
    insurancePremiums: {
      single: 2700,
      married: 5400,
      perChild: 1350,
    },
    pillar3a: {
      withPension: 7056,
      withoutPension: 35280,
    },
    childDeduction: 7200,
    childcareDeduction: 6000,
    marriedDeduction: 0,
    socialDeductions: {
      single: 0,
      married: 0,
    },
  },
};

// Basel-Landschaft Municipalities
export const baselLandMunicipalities: Municipality[] = [
  { id: 'bl-allschwil', name: 'Allschwil', cantonCode: 'BL', taxMultiplier: 61, churchTaxMultipliers: { catholic: 7, protestant: 7, christCatholic: 5 } },
  { id: 'bl-reinach', name: 'Reinach', cantonCode: 'BL', taxMultiplier: 60, churchTaxMultipliers: { catholic: 7, protestant: 7, christCatholic: 5 } },
  { id: 'bl-muttenz', name: 'Muttenz', cantonCode: 'BL', taxMultiplier: 56, churchTaxMultipliers: { catholic: 6, protestant: 6, christCatholic: 5 } },
  { id: 'bl-pratteln', name: 'Pratteln', cantonCode: 'BL', taxMultiplier: 55, churchTaxMultipliers: { catholic: 6, protestant: 6, christCatholic: 5 } },
  { id: 'bl-binningen', name: 'Binningen', cantonCode: 'BL', taxMultiplier: 58, churchTaxMultipliers: { catholic: 6, protestant: 6, christCatholic: 5 } },
  { id: 'bl-liestal', name: 'Liestal', cantonCode: 'BL', taxMultiplier: 62, churchTaxMultipliers: { catholic: 7, protestant: 7, christCatholic: 5 } },
  { id: 'bl-bottmingen', name: 'Bottmingen', cantonCode: 'BL', taxMultiplier: 53, churchTaxMultipliers: { catholic: 6, protestant: 6, christCatholic: 5 } },
  { id: 'bl-oberwil', name: 'Oberwil', cantonCode: 'BL', taxMultiplier: 55, churchTaxMultipliers: { catholic: 6, protestant: 6, christCatholic: 5 } },
  { id: 'bl-therwil', name: 'Therwil', cantonCode: 'BL', taxMultiplier: 57, churchTaxMultipliers: { catholic: 6, protestant: 6, christCatholic: 5 } },
  { id: 'bl-arlesheim', name: 'Arlesheim', cantonCode: 'BL', taxMultiplier: 54, churchTaxMultipliers: { catholic: 6, protestant: 6, christCatholic: 5 } },
];
