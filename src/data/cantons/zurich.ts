import type { CantonalTaxConfig, Municipality } from '../../types';

// Zurich Canton Tax Configuration 2025
export const zurichConfig: CantonalTaxConfig = {
  cantonCode: 'ZH',
  cantonName: 'Zurich',
  cantonNameDe: 'Zürich',
  cantonNameFr: 'Zurich',
  year: 2025,
  taxMultiplier: 100, // 100% = base rate

  tariffs: {
    single: [
      { minIncome: 0, maxIncome: 6700, baseAmount: 0, rate: 0 },
      { minIncome: 6700, maxIncome: 11400, baseAmount: 0, rate: 2.00 },
      { minIncome: 11400, maxIncome: 16100, baseAmount: 94.00, rate: 3.00 },
      { minIncome: 16100, maxIncome: 23700, baseAmount: 235.00, rate: 4.00 },
      { minIncome: 23700, maxIncome: 33000, baseAmount: 539.00, rate: 5.00 },
      { minIncome: 33000, maxIncome: 43900, baseAmount: 1004.00, rate: 6.00 },
      { minIncome: 43900, maxIncome: 56600, baseAmount: 1658.00, rate: 7.00 },
      { minIncome: 56600, maxIncome: 73500, baseAmount: 2547.00, rate: 8.00 },
      { minIncome: 73500, maxIncome: 98000, baseAmount: 3899.00, rate: 9.00 },
      { minIncome: 98000, maxIncome: 130800, baseAmount: 6104.00, rate: 10.00 },
      { minIncome: 130800, maxIncome: 175500, baseAmount: 9384.00, rate: 11.00 },
      { minIncome: 175500, maxIncome: 254900, baseAmount: 14301.00, rate: 12.00 },
      { minIncome: 254900, maxIncome: null, baseAmount: 23829.00, rate: 13.00 },
    ],
    married: [
      { minIncome: 0, maxIncome: 13500, baseAmount: 0, rate: 0 },
      { minIncome: 13500, maxIncome: 22700, baseAmount: 0, rate: 2.00 },
      { minIncome: 22700, maxIncome: 32200, baseAmount: 184.00, rate: 3.00 },
      { minIncome: 32200, maxIncome: 47200, baseAmount: 469.00, rate: 4.00 },
      { minIncome: 47200, maxIncome: 65800, baseAmount: 1069.00, rate: 5.00 },
      { minIncome: 65800, maxIncome: 87700, baseAmount: 1999.00, rate: 6.00 },
      { minIncome: 87700, maxIncome: 113100, baseAmount: 3313.00, rate: 7.00 },
      { minIncome: 113100, maxIncome: 147000, baseAmount: 5091.00, rate: 8.00 },
      { minIncome: 147000, maxIncome: 196000, baseAmount: 7803.00, rate: 9.00 },
      { minIncome: 196000, maxIncome: 261500, baseAmount: 12213.00, rate: 10.00 },
      { minIncome: 261500, maxIncome: 350900, baseAmount: 18763.00, rate: 11.00 },
      { minIncome: 350900, maxIncome: 509800, baseAmount: 28597.00, rate: 12.00 },
      { minIncome: 509800, maxIncome: null, baseAmount: 47665.00, rate: 13.00 },
    ],
  },

  deductionLimits: {
    professionalExpenses: {
      flatRate: 2000,
      maxCommuting: 5000,
      maxMeals: 3200,
      maxOther: 2400,
    },
    insurancePremiums: {
      single: 2600,
      married: 5200,
      perChild: 1300,
    },
    pillar3a: {
      withPension: 7056,
      withoutPension: 35280,
    },
    childDeduction: 9000,
    childcareDeduction: 10100,
    marriedDeduction: 2600,
    socialDeductions: {
      single: 2600,
      married: 5200,
    },
  },
};

// Zurich Municipalities
export const zurichMunicipalities: Municipality[] = [
  { id: 'zh-zurich', name: 'Zürich', cantonCode: 'ZH', taxMultiplier: 119, churchTaxMultipliers: { catholic: 10, protestant: 10, christCatholic: 10 } },
  { id: 'zh-winterthur', name: 'Winterthur', cantonCode: 'ZH', taxMultiplier: 122, churchTaxMultipliers: { catholic: 10, protestant: 10, christCatholic: 10 } },
  { id: 'zh-zollikon', name: 'Zollikon', cantonCode: 'ZH', taxMultiplier: 82, churchTaxMultipliers: { catholic: 8, protestant: 8, christCatholic: 8 } },
  { id: 'zh-kusnacht', name: 'Küsnacht', cantonCode: 'ZH', taxMultiplier: 77, churchTaxMultipliers: { catholic: 8, protestant: 8, christCatholic: 8 } },
  { id: 'zh-meilen', name: 'Meilen', cantonCode: 'ZH', taxMultiplier: 83, churchTaxMultipliers: { catholic: 9, protestant: 9, christCatholic: 9 } },
  { id: 'zh-herrliberg', name: 'Herrliberg', cantonCode: 'ZH', taxMultiplier: 75, churchTaxMultipliers: { catholic: 8, protestant: 8, christCatholic: 8 } },
  { id: 'zh-erlenbach', name: 'Erlenbach', cantonCode: 'ZH', taxMultiplier: 72, churchTaxMultipliers: { catholic: 7, protestant: 7, christCatholic: 7 } },
  { id: 'zh-kilchberg', name: 'Kilchberg', cantonCode: 'ZH', taxMultiplier: 83, churchTaxMultipliers: { catholic: 9, protestant: 9, christCatholic: 9 } },
  { id: 'zh-thalwil', name: 'Thalwil', cantonCode: 'ZH', taxMultiplier: 88, churchTaxMultipliers: { catholic: 9, protestant: 9, christCatholic: 9 } },
  { id: 'zh-adliswil', name: 'Adliswil', cantonCode: 'ZH', taxMultiplier: 105, churchTaxMultipliers: { catholic: 10, protestant: 10, christCatholic: 10 } },
  { id: 'zh-horgen', name: 'Horgen', cantonCode: 'ZH', taxMultiplier: 97, churchTaxMultipliers: { catholic: 9, protestant: 9, christCatholic: 9 } },
  { id: 'zh-waedenswil', name: 'Wädenswil', cantonCode: 'ZH', taxMultiplier: 110, churchTaxMultipliers: { catholic: 10, protestant: 10, christCatholic: 10 } },
  { id: 'zh-uster', name: 'Uster', cantonCode: 'ZH', taxMultiplier: 111, churchTaxMultipliers: { catholic: 10, protestant: 10, christCatholic: 10 } },
  { id: 'zh-dubendorf', name: 'Dübendorf', cantonCode: 'ZH', taxMultiplier: 117, churchTaxMultipliers: { catholic: 10, protestant: 10, christCatholic: 10 } },
  { id: 'zh-dietikon', name: 'Dietikon', cantonCode: 'ZH', taxMultiplier: 116, churchTaxMultipliers: { catholic: 10, protestant: 10, christCatholic: 10 } },
  { id: 'zh-opfikon', name: 'Opfikon', cantonCode: 'ZH', taxMultiplier: 92, churchTaxMultipliers: { catholic: 9, protestant: 9, christCatholic: 9 } },
  { id: 'zh-kloten', name: 'Kloten', cantonCode: 'ZH', taxMultiplier: 96, churchTaxMultipliers: { catholic: 9, protestant: 9, christCatholic: 9 } },
  { id: 'zh-bulach', name: 'Bülach', cantonCode: 'ZH', taxMultiplier: 99, churchTaxMultipliers: { catholic: 9, protestant: 9, christCatholic: 9 } },
  { id: 'zh-wallisellen', name: 'Wallisellen', cantonCode: 'ZH', taxMultiplier: 89, churchTaxMultipliers: { catholic: 9, protestant: 9, christCatholic: 9 } },
  { id: 'zh-maur', name: 'Maur', cantonCode: 'ZH', taxMultiplier: 86, churchTaxMultipliers: { catholic: 9, protestant: 9, christCatholic: 9 } },
];
