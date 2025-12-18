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

  // Wealth Tax (Vermögenssteuer) 2024
  // Indexstand per Juni 2024: 107.70, Basis - Teilrevision StG 2024
  // Allowances: single 200k, married 400k, per child 100k
  wealthTax: {
    allowances: {
      single: 200000,
      married: 400000,
      perChild: 100000,
    },
    brackets: [
      { minWealth: 0, maxWealth: 254000, rate: 0.0425 },
      { minWealth: 254000, maxWealth: 508000, rate: 0.085 },
      { minWealth: 508000, maxWealth: 762000, rate: 0.1275 },
      { minWealth: 762000, maxWealth: null, rate: 0.17 },
    ],
  },

  // Grundtarif 2025 (Indexstand per Juni 2024: 110.2, Basis: Dezember 2005)
  // Source: Official Canton Zug tax tariff table
  tariffs: {
    single: [
      { minIncome: 0, maxIncome: 1100, baseAmount: 0, rate: 0.50 },
      { minIncome: 1100, maxIncome: 3300, baseAmount: 5.50, rate: 1.00 },
      { minIncome: 3300, maxIncome: 6100, baseAmount: 27.50, rate: 2.00 },
      { minIncome: 6100, maxIncome: 10100, baseAmount: 83.50, rate: 3.00 },
      { minIncome: 10100, maxIncome: 15300, baseAmount: 203.50, rate: 3.25 },
      { minIncome: 15300, maxIncome: 21100, baseAmount: 372.50, rate: 3.50 },
      { minIncome: 21100, maxIncome: 26900, baseAmount: 575.50, rate: 4.00 },
      { minIncome: 26900, maxIncome: 34900, baseAmount: 807.50, rate: 4.50 },
      { minIncome: 34900, maxIncome: 46400, baseAmount: 1167.50, rate: 5.50 },
      { minIncome: 46400, maxIncome: 59700, baseAmount: 1800.00, rate: 5.50 },
      { minIncome: 59700, maxIncome: 74700, baseAmount: 2531.50, rate: 6.50 },
      { minIncome: 74700, maxIncome: 94800, baseAmount: 3506.50, rate: 8.00 },
      { minIncome: 94800, maxIncome: 120100, baseAmount: 5114.50, rate: 10.00 },
      { minIncome: 120100, maxIncome: 149900, baseAmount: 7644.50, rate: 9.00 },
      { minIncome: 149900, maxIncome: null, baseAmount: 10326.50, rate: 8.00 },
    ],
    // Mehrpersonentarif 2025 - all income thresholds and base amounts doubled from Grundtarif
    married: [
      { minIncome: 0, maxIncome: 2200, baseAmount: 0, rate: 0.50 },
      { minIncome: 2200, maxIncome: 6600, baseAmount: 11.00, rate: 1.00 },
      { minIncome: 6600, maxIncome: 12200, baseAmount: 55.00, rate: 2.00 },
      { minIncome: 12200, maxIncome: 20200, baseAmount: 167.00, rate: 3.00 },
      { minIncome: 20200, maxIncome: 30600, baseAmount: 407.00, rate: 3.25 },
      { minIncome: 30600, maxIncome: 42200, baseAmount: 745.00, rate: 3.50 },
      { minIncome: 42200, maxIncome: 53800, baseAmount: 1151.00, rate: 4.00 },
      { minIncome: 53800, maxIncome: 69800, baseAmount: 1615.00, rate: 4.50 },
      { minIncome: 69800, maxIncome: 92800, baseAmount: 2335.00, rate: 5.50 },
      { minIncome: 92800, maxIncome: 119400, baseAmount: 3600.00, rate: 5.50 },
      { minIncome: 119400, maxIncome: 149400, baseAmount: 5063.00, rate: 6.50 },
      { minIncome: 149400, maxIncome: 189600, baseAmount: 7013.00, rate: 8.00 },
      { minIncome: 189600, maxIncome: 240200, baseAmount: 10229.00, rate: 10.00 },
      { minIncome: 240200, maxIncome: 299800, baseAmount: 15289.00, rate: 9.00 },
      { minIncome: 299800, maxIncome: null, baseAmount: 20653.00, rate: 8.00 },
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
    childDeduction: 12400,               // Updated: CHF 12'400 (teuerungsbereinigt)
    childcareDeduction: 25000,           // Updated: CHF 25'000 Fremdbetreuungsabzug
    marriedDeduction: 6100,
    socialDeductions: {
      single: 11800,                     // Updated: Persönlicher Abzug
      married: 23600,                    // Updated: Persönlicher Abzug
    },
    // ZG-specific deductions
    rentDeduction: {
      maxAmount: 10800,                  // CHF 10'800 for 2025
      percentage: 30,                    // 30% of net rent
    },
    selfCareDeduction: 12200,            // Eigenbetreuungsabzug CHF 12'200 (2025) per child under 15
    educationDeduction: 12000,           // Weiterbildungskosten max
    childEducationDeduction: 12000,      // Kinderzusatzabzug for children 15+ in education
  },
};

// Zug Municipalities - 2025 Tax Rates
// Source: Steuerfüsse der Gemeinden des Kantons Zug 2025
// Protestant rate is canton-wide: 7.5%
export const zugMunicipalities: Municipality[] = [
  { id: 'zg-zug', name: 'Zug', cantonCode: 'ZG', taxMultiplier: 52.11, churchTaxMultipliers: { catholic: 7, protestant: 7.5, christCatholic: 7 } },
  { id: 'zg-baar', name: 'Baar', cantonCode: 'ZG', taxMultiplier: 51, churchTaxMultipliers: { catholic: 7.2, protestant: 7.5, christCatholic: 7.2 } },
  { id: 'zg-cham', name: 'Cham', cantonCode: 'ZG', taxMultiplier: 54, churchTaxMultipliers: { catholic: 7.2, protestant: 7.5, christCatholic: 7.2 } },
  { id: 'zg-steinhausen', name: 'Steinhausen', cantonCode: 'ZG', taxMultiplier: 54, churchTaxMultipliers: { catholic: 9, protestant: 7.5, christCatholic: 9 } },
  { id: 'zg-risch', name: 'Risch', cantonCode: 'ZG', taxMultiplier: 55, churchTaxMultipliers: { catholic: 8, protestant: 7.5, christCatholic: 8 } },
  { id: 'zg-huenenberg', name: 'Hünenberg', cantonCode: 'ZG', taxMultiplier: 54, churchTaxMultipliers: { catholic: 7.2, protestant: 7.5, christCatholic: 7.2 } },
  { id: 'zg-oberaegeri', name: 'Oberägeri', cantonCode: 'ZG', taxMultiplier: 54, churchTaxMultipliers: { catholic: 10, protestant: 7.5, christCatholic: 10 } },
  { id: 'zg-unteraegeri', name: 'Unterägeri', cantonCode: 'ZG', taxMultiplier: 54, churchTaxMultipliers: { catholic: 8, protestant: 7.5, christCatholic: 8 } },
  { id: 'zg-menzingen', name: 'Menzingen', cantonCode: 'ZG', taxMultiplier: 59, churchTaxMultipliers: { catholic: 9, protestant: 7.5, christCatholic: 9 } },
  { id: 'zg-neuheim', name: 'Neuheim', cantonCode: 'ZG', taxMultiplier: 65, churchTaxMultipliers: { catholic: 9.5, protestant: 7.5, christCatholic: 9.5 } },
  { id: 'zg-walchwil', name: 'Walchwil', cantonCode: 'ZG', taxMultiplier: 53, churchTaxMultipliers: { catholic: 11, protestant: 7.5, christCatholic: 11 } },
];
