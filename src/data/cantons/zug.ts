import type { CantonalTaxConfig, Municipality } from '../../types';

// Zug Canton Tax Configuration 2025
// Known for very low taxes
export const zugConfig: CantonalTaxConfig = {
  cantonCode: 'ZG',
  cantonName: 'Zug',
  cantonNameDe: 'Zug',
  cantonNameFr: 'Zoug',
  year: 2025,
  taxMultiplier: 82, // Low cantonal multiplier

  tariffs: {
    single: [
      { minIncome: 0, maxIncome: 8000, baseAmount: 0, rate: 0 },
      { minIncome: 8000, maxIncome: 16000, baseAmount: 0, rate: 1.50 },
      { minIncome: 16000, maxIncome: 24000, baseAmount: 120.00, rate: 2.00 },
      { minIncome: 24000, maxIncome: 32000, baseAmount: 280.00, rate: 2.50 },
      { minIncome: 32000, maxIncome: 40000, baseAmount: 480.00, rate: 3.00 },
      { minIncome: 40000, maxIncome: 56000, baseAmount: 720.00, rate: 3.50 },
      { minIncome: 56000, maxIncome: 72000, baseAmount: 1280.00, rate: 4.00 },
      { minIncome: 72000, maxIncome: 96000, baseAmount: 1920.00, rate: 4.50 },
      { minIncome: 96000, maxIncome: 128000, baseAmount: 3000.00, rate: 5.00 },
      { minIncome: 128000, maxIncome: 176000, baseAmount: 4600.00, rate: 5.50 },
      { minIncome: 176000, maxIncome: 256000, baseAmount: 7240.00, rate: 6.00 },
      { minIncome: 256000, maxIncome: null, baseAmount: 12040.00, rate: 6.00 },
    ],
    married: [
      { minIncome: 0, maxIncome: 16000, baseAmount: 0, rate: 0 },
      { minIncome: 16000, maxIncome: 32000, baseAmount: 0, rate: 1.50 },
      { minIncome: 32000, maxIncome: 48000, baseAmount: 240.00, rate: 2.00 },
      { minIncome: 48000, maxIncome: 64000, baseAmount: 560.00, rate: 2.50 },
      { minIncome: 64000, maxIncome: 80000, baseAmount: 960.00, rate: 3.00 },
      { minIncome: 80000, maxIncome: 112000, baseAmount: 1440.00, rate: 3.50 },
      { minIncome: 112000, maxIncome: 144000, baseAmount: 2560.00, rate: 4.00 },
      { minIncome: 144000, maxIncome: 192000, baseAmount: 3840.00, rate: 4.50 },
      { minIncome: 192000, maxIncome: 256000, baseAmount: 6000.00, rate: 5.00 },
      { minIncome: 256000, maxIncome: 352000, baseAmount: 9200.00, rate: 5.50 },
      { minIncome: 352000, maxIncome: 512000, baseAmount: 14480.00, rate: 6.00 },
      { minIncome: 512000, maxIncome: null, baseAmount: 24080.00, rate: 6.00 },
    ],
  },

  deductionLimits: {
    professionalExpenses: {
      flatRate: 2400,
      maxCommuting: 6000,
      maxMeals: 3200,
      maxOther: 2000,
    },
    insurancePremiums: {
      single: 3300,
      married: 6600,
      perChild: 1700,
    },
    pillar3a: {
      withPension: 7056,
      withoutPension: 35280,
    },
    childDeduction: 12000,
    childcareDeduction: 6000,
    marriedDeduction: 6100,
    socialDeductions: {
      single: 4100,
      married: 8200,
    },
  },
};

// Zug Municipalities
export const zugMunicipalities: Municipality[] = [
  { id: 'zg-zug', name: 'Zug', cantonCode: 'ZG', taxMultiplier: 60, churchTaxMultipliers: { catholic: 6.0, protestant: 6.0, christCatholic: 6.0 } },
  { id: 'zg-baar', name: 'Baar', cantonCode: 'ZG', taxMultiplier: 56, churchTaxMultipliers: { catholic: 5.8, protestant: 5.8, christCatholic: 5.8 } },
  { id: 'zg-cham', name: 'Cham', cantonCode: 'ZG', taxMultiplier: 61, churchTaxMultipliers: { catholic: 6.0, protestant: 6.0, christCatholic: 6.0 } },
  { id: 'zg-steinhausen', name: 'Steinhausen', cantonCode: 'ZG', taxMultiplier: 58, churchTaxMultipliers: { catholic: 5.9, protestant: 5.9, christCatholic: 5.9 } },
  { id: 'zg-rotkreuz', name: 'Risch (Rotkreuz)', cantonCode: 'ZG', taxMultiplier: 52, churchTaxMultipliers: { catholic: 5.5, protestant: 5.5, christCatholic: 5.5 } },
  { id: 'zg-huenenberg', name: 'Hünenberg', cantonCode: 'ZG', taxMultiplier: 55, churchTaxMultipliers: { catholic: 5.7, protestant: 5.7, christCatholic: 5.7 } },
  { id: 'zg-oberaegeri', name: 'Oberägeri', cantonCode: 'ZG', taxMultiplier: 58, churchTaxMultipliers: { catholic: 5.9, protestant: 5.9, christCatholic: 5.9 } },
  { id: 'zg-unteraegeri', name: 'Unterägeri', cantonCode: 'ZG', taxMultiplier: 56, churchTaxMultipliers: { catholic: 5.8, protestant: 5.8, christCatholic: 5.8 } },
  { id: 'zg-menzingen', name: 'Menzingen', cantonCode: 'ZG', taxMultiplier: 60, churchTaxMultipliers: { catholic: 6.0, protestant: 6.0, christCatholic: 6.0 } },
  { id: 'zg-neuheim', name: 'Neuheim', cantonCode: 'ZG', taxMultiplier: 63, churchTaxMultipliers: { catholic: 6.2, protestant: 6.2, christCatholic: 6.2 } },
  { id: 'zg-walchwil', name: 'Walchwil', cantonCode: 'ZG', taxMultiplier: 62, churchTaxMultipliers: { catholic: 6.1, protestant: 6.1, christCatholic: 6.1 } },
];
