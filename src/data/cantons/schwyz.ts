import type { CantonalTaxConfig, Municipality } from '../../types';

// Schwyz Canton Tax Configuration (valid from 2015)
// Source: Schwyzer Steuerbuch 90.10, Einkommenssteuertarif gemäss § 36 Abs. 1 StG
// This is the "einfache Steuer" (simple tax) before cantonal/municipal multipliers
// For married couples: income is divided by 1.9 to get rate, then applied to full income
// Above CHF 230,400: flat rate of 3.65% applies
export const schwyzConfig: CantonalTaxConfig = {
  cantonCode: 'SZ',
  cantonName: 'Schwyz',
  cantonNameDe: 'Schwyz',
  cantonNameFr: 'Schwytz',
  year: 2025,
  // Cantonal tax multiplier is 115% (source: official PDF "Steuerfüsse Kanton 115*")
  taxMultiplier: 115,

  // Wealth Tax (Vermögenssteuer) - Linear/flat rate of 0.6‰
  // Source: § 47 Steuergesetz Kanton Schwyz
  // Sozialabzüge: Single 125k, Married 250k, per child 30k
  wealthTax: {
    allowances: {
      single: 125000,
      married: 250000,
      perChild: 30000,
    },
    // Flat rate of 0.6‰ = 0.06% (single bracket covers all wealth)
    brackets: [
      { minWealth: 0, maxWealth: null, rate: 0.06 },
    ],
  },

  // Note: Schwyz uses a detailed lookup table. These brackets approximate the official tariff.
  // Source: Schwyzer Steuerbuch 90.10 - Einkommenssteuertarif gemäss § 36 Abs. 1 StG (gültig ab 2015)
  // Verified against official calculator: CHF 150,000 -> 5,273.90 (rate 3.5159%)
  // Key reference points from official table (einfache Steuer):
  // CHF 10,000 -> 127.50, CHF 20,000 -> 390.75, CHF 30,000 -> 698.50
  // CHF 50,000 -> 1,387.15, CHF 100,000 -> 3,323.90, CHF 150,000 -> 5,273.90, CHF 200,000 -> 7,223.90
  // Above CHF 230,400 -> 3.65% flat rate of total income
  tariffs: {
    single: [
      // Brackets derived from official lookup table
      // Rate = (tax at end - tax at start) / (end - start) * 100
      { minIncome: 0, maxIncome: 10000, baseAmount: 0, rate: 1.275 },
      // 10k-20k: (390.75-127.50)/10000 = 2.6325%
      { minIncome: 10000, maxIncome: 20000, baseAmount: 127.50, rate: 2.6325 },
      // 20k-30k: (698.50-390.75)/10000 = 3.0775%
      { minIncome: 20000, maxIncome: 30000, baseAmount: 390.75, rate: 3.0775 },
      // 30k-40k: (1032.50-698.50)/10000 = 3.34%
      { minIncome: 30000, maxIncome: 40000, baseAmount: 698.50, rate: 3.34 },
      // 40k-50k: (1387.15-1032.50)/10000 = 3.5465%
      { minIncome: 40000, maxIncome: 50000, baseAmount: 1032.50, rate: 3.5465 },
      // 50k-60k: (1763.90-1387.15)/10000 = 3.7675%
      { minIncome: 50000, maxIncome: 60000, baseAmount: 1387.15, rate: 3.7675 },
      // 60k-80k: (2543.90-1763.90)/20000 = 3.90%
      { minIncome: 60000, maxIncome: 80000, baseAmount: 1763.90, rate: 3.90 },
      // 80k-100k: (3323.90-2543.90)/20000 = 3.90%
      { minIncome: 80000, maxIncome: 100000, baseAmount: 2543.90, rate: 3.90 },
      // 100k-150k: (5273.90-3323.90)/50000 = 3.90%
      { minIncome: 100000, maxIncome: 150000, baseAmount: 3323.90, rate: 3.90 },
      // 150k-200k: (7223.90-5273.90)/50000 = 3.90%
      { minIncome: 150000, maxIncome: 200000, baseAmount: 5273.90, rate: 3.90 },
      // 200k-230.4k: (8409.50-7223.90)/30400 = 3.90%
      { minIncome: 200000, maxIncome: 230400, baseAmount: 7223.90, rate: 3.90 },
      // Above 230,400: flat 3.65% of total income (special rule from PDF)
      // baseAmount set to 230400 * 0.0365 = 8409.60 so that baseAmount + (X-230400)*0.0365 = X*0.0365
      { minIncome: 230400, maxIncome: null, baseAmount: 8409.60, rate: 3.65 },
    ],
    // For married couples: income divided by 1.9 to find rate, then rate applied to full income
    // This effectively widens the brackets by factor of 1.9
    married: [
      { minIncome: 0, maxIncome: 19000, baseAmount: 0, rate: 1.275 },
      { minIncome: 19000, maxIncome: 38000, baseAmount: 242.25, rate: 2.6325 },
      { minIncome: 38000, maxIncome: 57000, baseAmount: 742.43, rate: 3.0775 },
      { minIncome: 57000, maxIncome: 76000, baseAmount: 1327.15, rate: 3.34 },
      { minIncome: 76000, maxIncome: 95000, baseAmount: 1961.75, rate: 3.5465 },
      { minIncome: 95000, maxIncome: 114000, baseAmount: 2635.59, rate: 3.7675 },
      { minIncome: 114000, maxIncome: 152000, baseAmount: 3351.41, rate: 3.90 },
      { minIncome: 152000, maxIncome: 190000, baseAmount: 4833.41, rate: 3.90 },
      { minIncome: 190000, maxIncome: 285000, baseAmount: 6315.41, rate: 3.90 },
      { minIncome: 285000, maxIncome: 380000, baseAmount: 10020.91, rate: 3.90 },
      { minIncome: 380000, maxIncome: 437760, baseAmount: 13725.41, rate: 3.90 },
      // Above 437,760 (230,400 * 1.9): flat 3.65% of total income
      // baseAmount = 437760 * 0.0365 = 15978.24
      { minIncome: 437760, maxIncome: null, baseAmount: 15978.24, rate: 3.65 },
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
      single: 2800,
      married: 5600,
      perChild: 1400,
    },
    pillar3a: {
      withPension: 7056,
      withoutPension: 35280,
    },
    childDeduction: 9200,
    childcareDeduction: 6000,
    marriedDeduction: 4400,
    socialDeductions: {
      single: 3500,
      married: 7000,
    },
  },
};

// Schwyz Municipalities 2025
// Source: "Die Steuerbelastung in den Gemeinden des Kantons Schwyz" (13. Februar 2025)
// Municipal multiplier = "ohne Kultussteuern" - 115 (cantonal)
// Church tax = difference between religious and non-religious total
export const schwyzMunicipalities: Municipality[] = [
  // Lowest tax municipalities (March/Höfe district)
  { id: 'sz-wollerau', name: 'Wollerau', cantonCode: 'SZ', taxMultiplier: 69, churchTaxMultipliers: { catholic: 8, protestant: 8, christCatholic: 8 } }, // 184-115=69
  { id: 'sz-freienbach', name: 'Freienbach (Pfäffikon)', cantonCode: 'SZ', taxMultiplier: 64, churchTaxMultipliers: { catholic: 9, protestant: 8, christCatholic: 9 } }, // 179-115=64
  { id: 'sz-feusisberg', name: 'Feusisberg', cantonCode: 'SZ', taxMultiplier: 74, churchTaxMultipliers: { catholic: 15, protestant: 8, christCatholic: 15 } }, // 189-115=74

  // Altendorf/Lachen area
  { id: 'sz-altendorf', name: 'Altendorf', cantonCode: 'SZ', taxMultiplier: 121, churchTaxMultipliers: { catholic: 15, protestant: 14, christCatholic: 15 } }, // 236-115=121
  { id: 'sz-lachen', name: 'Lachen', cantonCode: 'SZ', taxMultiplier: 131, churchTaxMultipliers: { catholic: 12, protestant: 14, christCatholic: 12 } }, // 246-115=131

  // Küssnacht area
  { id: 'sz-kuesnacht', name: 'Küssnacht', cantonCode: 'SZ', taxMultiplier: 145, churchTaxMultipliers: { catholic: 18, protestant: 16, christCatholic: 18 } }, // 260-115=145

  // Oberiberg
  { id: 'sz-oberiberg', name: 'Oberiberg', cantonCode: 'SZ', taxMultiplier: 125, churchTaxMultipliers: { catholic: 28, protestant: 26, christCatholic: 28 } }, // 240-115=125

  // Riemenstalden
  { id: 'sz-riemenstalden', name: 'Riemenstalden', cantonCode: 'SZ', taxMultiplier: 135, churchTaxMultipliers: { catholic: 26, protestant: 25, christCatholic: 26 } }, // 250-115=135

  // Schübelbach area
  { id: 'sz-schuebelbach', name: 'Schübelbach', cantonCode: 'SZ', taxMultiplier: 206, churchTaxMultipliers: { catholic: 38, protestant: 14, christCatholic: 38 } }, // 321-115=206

  // Gersau
  { id: 'sz-gersau', name: 'Gersau', cantonCode: 'SZ', taxMultiplier: 145, churchTaxMultipliers: { catholic: 25, protestant: 25, christCatholic: 25 } }, // 260-115=145

  // Arth
  { id: 'sz-arth', name: 'Arth', cantonCode: 'SZ', taxMultiplier: 145, churchTaxMultipliers: { catholic: 27, protestant: 31, christCatholic: 27 } }, // 260-115=145

  // Muotathal
  { id: 'sz-muotathal', name: 'Muotathal', cantonCode: 'SZ', taxMultiplier: 150, churchTaxMultipliers: { catholic: 25, protestant: 25, christCatholic: 25 } }, // 265-115=150

  // Innerthal
  { id: 'sz-innerthal', name: 'Innerthal', cantonCode: 'SZ', taxMultiplier: 146, churchTaxMultipliers: { catholic: 32, protestant: 14, christCatholic: 32 } }, // 261-115=146

  // Galgenen
  { id: 'sz-galgenen', name: 'Galgenen', cantonCode: 'SZ', taxMultiplier: 161, churchTaxMultipliers: { catholic: 16, protestant: 14, christCatholic: 16 } }, // 276-115=161

  // Rothenthurm
  { id: 'sz-rothenthurm', name: 'Rothenthurm', cantonCode: 'SZ', taxMultiplier: 155, churchTaxMultipliers: { catholic: 25, protestant: 26, christCatholic: 25 } }, // 270-115=155

  // Tuggen
  { id: 'sz-tuggen', name: 'Tuggen', cantonCode: 'SZ', taxMultiplier: 160, churchTaxMultipliers: { catholic: 25, protestant: 14, christCatholic: 25 } }, // 275-115=160

  // Ingenbohl (Brunnen)
  { id: 'sz-ingenbohl', name: 'Ingenbohl (Brunnen)', cantonCode: 'SZ', taxMultiplier: 165, churchTaxMultipliers: { catholic: 18, protestant: 25, christCatholic: 18 } }, // 280-115=165

  // Unteriberg
  { id: 'sz-unteriberg', name: 'Unteriberg', cantonCode: 'SZ', taxMultiplier: 155, churchTaxMultipliers: { catholic: 30, protestant: 26, christCatholic: 30 } }, // 270-115=155

  // Sattel
  { id: 'sz-sattel', name: 'Sattel', cantonCode: 'SZ', taxMultiplier: 155, churchTaxMultipliers: { catholic: 31, protestant: 31, christCatholic: 31 } }, // 270-115=155

  // Steinerberg
  { id: 'sz-steinerberg', name: 'Steinerberg', cantonCode: 'SZ', taxMultiplier: 155, churchTaxMultipliers: { catholic: 31, protestant: 31, christCatholic: 31 } }, // 270-115=155

  // Alpthal
  { id: 'sz-alpthal', name: 'Alpthal', cantonCode: 'SZ', taxMultiplier: 170, churchTaxMultipliers: { catholic: 25, protestant: 26, christCatholic: 25 } }, // 285-115=170

  // Schwyz (main town)
  { id: 'sz-schwyz', name: 'Schwyz', cantonCode: 'SZ', taxMultiplier: 175, churchTaxMultipliers: { catholic: 26, protestant: 25, christCatholic: 26 } }, // 290-115=175

  // Vorderthal
  { id: 'sz-vorderthal', name: 'Vorderthal', cantonCode: 'SZ', taxMultiplier: 171, churchTaxMultipliers: { catholic: 32, protestant: 14, christCatholic: 32 } }, // 286-115=171

  // Wangen
  { id: 'sz-wangen', name: 'Wangen', cantonCode: 'SZ', taxMultiplier: 186, churchTaxMultipliers: { catholic: 30, protestant: 14, christCatholic: 30 } }, // 301-115=186

  // Morschach
  { id: 'sz-morschach', name: 'Morschach', cantonCode: 'SZ', taxMultiplier: 175, churchTaxMultipliers: { catholic: 36, protestant: 25, christCatholic: 36 } }, // 290-115=175

  // Reichenburg
  { id: 'sz-reichenburg', name: 'Reichenburg', cantonCode: 'SZ', taxMultiplier: 186, churchTaxMultipliers: { catholic: 30, protestant: 14, christCatholic: 30 } }, // 301-115=186

  // Einsiedeln
  { id: 'sz-einsiedeln', name: 'Einsiedeln', cantonCode: 'SZ', taxMultiplier: 190, churchTaxMultipliers: { catholic: 26, protestant: 26, christCatholic: 26 } }, // 305-115=190

  // Steinen
  { id: 'sz-steinen', name: 'Steinen', cantonCode: 'SZ', taxMultiplier: 195, churchTaxMultipliers: { catholic: 29, protestant: 25, christCatholic: 29 } }, // 310-115=195

  // Lauerz
  { id: 'sz-lauerz', name: 'Lauerz', cantonCode: 'SZ', taxMultiplier: 195, churchTaxMultipliers: { catholic: 29, protestant: 31, christCatholic: 29 } }, // 310-115=195

  // Illgau
  { id: 'sz-illgau', name: 'Illgau', cantonCode: 'SZ', taxMultiplier: 195, churchTaxMultipliers: { catholic: 32, protestant: 25, christCatholic: 32 } }, // 310-115=195
];
