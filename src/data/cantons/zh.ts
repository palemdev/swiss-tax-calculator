import type { CantonalTaxConfig, Municipality } from '../../types';

// Zürich Canton Tax Configuration 2025
// Source: Kantonsblatt Zürich (ESTV), September 2025
// Steuergesetz vom 8. Juni 1997 (StG)
export const zurichConfig: CantonalTaxConfig = {
  cantonCode: 'ZH',
  cantonName: 'Zürich',
  cantonNameDe: 'Zürich',
  cantonNameFr: 'Zurich',
  year: 2025,
  taxMultiplier: 98, // Staatssteuerfuss 2025

  // Wealth Tax (Vermögenssteuer) - §47 StG
  // Grundtarif: 0‰ for first 80k, Verheiratetentarif: 0‰ for first 159k
  // Brackets are applied after subtracting the allowance
  wealthTax: {
    allowances: {
      single: 80000,
      married: 159000,
      perChild: 0,
    },
    brackets: [
      { minWealth: 0, maxWealth: 238000, rate: 0.05 },      // 0.5‰
      { minWealth: 238000, maxWealth: 637000, rate: 0.1 },  // 1‰
      { minWealth: 637000, maxWealth: 1273000, rate: 0.15 }, // 1.5‰
      { minWealth: 1273000, maxWealth: 2229000, rate: 0.2 }, // 2‰
      { minWealth: 2229000, maxWealth: 3182000, rate: 0.25 }, // 2.5‰
      { minWealth: 3182000, maxWealth: null, rate: 0.3 },   // 3‰
    ],
  },

  // Income Tax - Grundtarif (Single) - §35 Abs. 1 StG
  // Progressive tariff with 13 brackets
  tariffs: {
    single: [
      { minIncome: 0, maxIncome: 6900, baseAmount: 0, rate: 0 },
      { minIncome: 6900, maxIncome: 11800, baseAmount: 0, rate: 2 },
      { minIncome: 11800, maxIncome: 16600, baseAmount: 98, rate: 3 },
      { minIncome: 16600, maxIncome: 24500, baseAmount: 242, rate: 4 },
      { minIncome: 24500, maxIncome: 34100, baseAmount: 558, rate: 5 },
      { minIncome: 34100, maxIncome: 45100, baseAmount: 1038, rate: 6 },
      { minIncome: 45100, maxIncome: 58000, baseAmount: 1698, rate: 7 },
      { minIncome: 58000, maxIncome: 75400, baseAmount: 2601, rate: 8 },
      { minIncome: 75400, maxIncome: 109000, baseAmount: 3993, rate: 9 },
      { minIncome: 109000, maxIncome: 142200, baseAmount: 7017, rate: 10 },
      { minIncome: 142200, maxIncome: 194900, baseAmount: 10337, rate: 11 },
      { minIncome: 194900, maxIncome: 263300, baseAmount: 16134, rate: 12 },
      { minIncome: 263300, maxIncome: null, baseAmount: 24342, rate: 13 },
    ],
    // Income Tax - Verheiratetentarif (Married) - §35 Abs. 2 StG
    // Also applies to single parents living with children
    married: [
      { minIncome: 0, maxIncome: 13900, baseAmount: 0, rate: 0 },
      { minIncome: 13900, maxIncome: 20200, baseAmount: 0, rate: 2 },
      { minIncome: 20200, maxIncome: 28200, baseAmount: 126, rate: 3 },
      { minIncome: 28200, maxIncome: 37900, baseAmount: 366, rate: 4 },
      { minIncome: 37900, maxIncome: 49000, baseAmount: 754, rate: 5 },
      { minIncome: 49000, maxIncome: 63300, baseAmount: 1309, rate: 6 },
      { minIncome: 63300, maxIncome: 95100, baseAmount: 2167, rate: 7 },
      { minIncome: 95100, maxIncome: 127000, baseAmount: 4393, rate: 8 },
      { minIncome: 127000, maxIncome: 174900, baseAmount: 6945, rate: 9 },
      { minIncome: 174900, maxIncome: 232100, baseAmount: 11256, rate: 10 },
      { minIncome: 232100, maxIncome: 294200, baseAmount: 16976, rate: 11 },
      { minIncome: 294200, maxIncome: 365800, baseAmount: 23807, rate: 12 },
      { minIncome: 365800, maxIncome: null, baseAmount: 32399, rate: 13 },
    ],
  },

  // Deduction Limits - Various sections of StG
  deductionLimits: {
    professionalExpenses: {
      flatRate: 2000,           // §26: 3% of net income, min 2000, max 4000
      maxCommuting: 5200,       // §26 Abs. 1 lit. a: max CHF 5'200
      maxMeals: 3200,           // Standard meal deduction
      maxOther: 4000,           // §26: max professional expenses
    },
    insurancePremiums: {
      single: 2900,             // §31 Abs. 1 lit. g: CHF 2'900 single
      married: 5800,            // §31 Abs. 1 lit. g: CHF 5'800 married
      perChild: 1300,           // §31 Abs. 1 lit. g: CHF 1'300 per child
    },
    pillar3a: {
      withPension: 7056,        // Federal limit 2025
      withoutPension: 35280,    // Federal limit 2025
    },
    childDeduction: 9300,       // §34 Abs. 1 lit. a: CHF 9'300 per child
    childcareDeduction: 25000,  // §31 Abs. 1 lit. j: max CHF 25'000
    marriedDeduction: 0,        // ZH uses Verheiratetentarif instead
    socialDeductions: {
      single: 0,                // ZH doesn't have explicit social deductions
      married: 0,               // Built into the tariff structure
    },
    // ZH-specific deductions
    dualEarnerDeduction: 6100,  // §31 Abs. 2: Sonderabzug bei Erwerbstätigkeit beider Ehegatten
    educationDeduction: 12400,  // §31 Abs. 1 lit. k: Weiterbildungskosten max
  },
};

// Zürich Municipalities - 2025 Tax Rates
// Source: Kanton Zürich Statistisches Amt
// Church tax rates are approximate averages (vary by parish)
export const zurichMunicipalities: Municipality[] = [
  // Major cities
  { id: 'zh-zuerich', name: 'Zürich', cantonCode: 'ZH', taxMultiplier: 119, churchTaxMultipliers: { catholic: 10, protestant: 10, christCatholic: 10 } },
  { id: 'zh-winterthur', name: 'Winterthur', cantonCode: 'ZH', taxMultiplier: 125, churchTaxMultipliers: { catholic: 14, protestant: 14, christCatholic: 14 } },
  { id: 'zh-uster', name: 'Uster', cantonCode: 'ZH', taxMultiplier: 112, churchTaxMultipliers: { catholic: 11, protestant: 11, christCatholic: 11 } },
  { id: 'zh-duebendorf', name: 'Dübendorf', cantonCode: 'ZH', taxMultiplier: 96, churchTaxMultipliers: { catholic: 11, protestant: 11, christCatholic: 11 } },
  { id: 'zh-dietikon', name: 'Dietikon', cantonCode: 'ZH', taxMultiplier: 114, churchTaxMultipliers: { catholic: 10, protestant: 10, christCatholic: 10 } },
  { id: 'zh-wetzikon', name: 'Wetzikon', cantonCode: 'ZH', taxMultiplier: 112, churchTaxMultipliers: { catholic: 12, protestant: 12, christCatholic: 12 } },
  { id: 'zh-waedenswil', name: 'Wädenswil', cantonCode: 'ZH', taxMultiplier: 103, churchTaxMultipliers: { catholic: 11, protestant: 11, christCatholic: 11 } },
  { id: 'zh-horgen', name: 'Horgen', cantonCode: 'ZH', taxMultiplier: 86, churchTaxMultipliers: { catholic: 10, protestant: 10, christCatholic: 10 } },
  { id: 'zh-kloten', name: 'Kloten', cantonCode: 'ZH', taxMultiplier: 106, churchTaxMultipliers: { catholic: 11, protestant: 11, christCatholic: 11 } },
  { id: 'zh-buelach', name: 'Bülach', cantonCode: 'ZH', taxMultiplier: 102, churchTaxMultipliers: { catholic: 11, protestant: 11, christCatholic: 11 } },

  // Low-tax municipalities (Zürichsee "Gold Coast")
  { id: 'zh-kilchberg', name: 'Kilchberg', cantonCode: 'ZH', taxMultiplier: 72, churchTaxMultipliers: { catholic: 8, protestant: 8, christCatholic: 8 } },
  { id: 'zh-kuesnacht', name: 'Küsnacht', cantonCode: 'ZH', taxMultiplier: 73, churchTaxMultipliers: { catholic: 8, protestant: 8, christCatholic: 8 } },
  { id: 'zh-herrliberg', name: 'Herrliberg', cantonCode: 'ZH', taxMultiplier: 75, churchTaxMultipliers: { catholic: 9, protestant: 9, christCatholic: 9 } },
  { id: 'zh-rueschlikon', name: 'Rüschlikon', cantonCode: 'ZH', taxMultiplier: 75, churchTaxMultipliers: { catholic: 9, protestant: 9, christCatholic: 9 } },
  { id: 'zh-zollikon', name: 'Zollikon', cantonCode: 'ZH', taxMultiplier: 79, churchTaxMultipliers: { catholic: 9, protestant: 9, christCatholic: 9 } },
  { id: 'zh-zumikon', name: 'Zumikon', cantonCode: 'ZH', taxMultiplier: 77, churchTaxMultipliers: { catholic: 9, protestant: 9, christCatholic: 9 } },
  { id: 'zh-meilen', name: 'Meilen', cantonCode: 'ZH', taxMultiplier: 80, churchTaxMultipliers: { catholic: 9, protestant: 9, christCatholic: 9 } },
  { id: 'zh-erlenbach', name: 'Erlenbach', cantonCode: 'ZH', taxMultiplier: 77, churchTaxMultipliers: { catholic: 9, protestant: 9, christCatholic: 9 } },
  { id: 'zh-maennedorf', name: 'Männedorf', cantonCode: 'ZH', taxMultiplier: 87, churchTaxMultipliers: { catholic: 10, protestant: 10, christCatholic: 10 } },
  { id: 'zh-staefa', name: 'Stäfa', cantonCode: 'ZH', taxMultiplier: 85, churchTaxMultipliers: { catholic: 10, protestant: 10, christCatholic: 10 } },

  // Other notable municipalities
  { id: 'zh-thalwil', name: 'Thalwil', cantonCode: 'ZH', taxMultiplier: 79, churchTaxMultipliers: { catholic: 10, protestant: 10, christCatholic: 10 } },
  { id: 'zh-adliswil', name: 'Adliswil', cantonCode: 'ZH', taxMultiplier: 97, churchTaxMultipliers: { catholic: 10, protestant: 10, christCatholic: 10 } },
  { id: 'zh-richterswil', name: 'Richterswil', cantonCode: 'ZH', taxMultiplier: 98, churchTaxMultipliers: { catholic: 11, protestant: 11, christCatholic: 11 } },
  { id: 'zh-opfikon', name: 'Opfikon', cantonCode: 'ZH', taxMultiplier: 99, churchTaxMultipliers: { catholic: 10, protestant: 10, christCatholic: 10 } },
  { id: 'zh-wallisellen', name: 'Wallisellen', cantonCode: 'ZH', taxMultiplier: 89, churchTaxMultipliers: { catholic: 10, protestant: 10, christCatholic: 10 } },
  { id: 'zh-regensdorf', name: 'Regensdorf', cantonCode: 'ZH', taxMultiplier: 103, churchTaxMultipliers: { catholic: 11, protestant: 11, christCatholic: 11 } },
  { id: 'zh-schlieren', name: 'Schlieren', cantonCode: 'ZH', taxMultiplier: 109, churchTaxMultipliers: { catholic: 11, protestant: 11, christCatholic: 11 } },
  { id: 'zh-illnau-effretikon', name: 'Illnau-Effretikon', cantonCode: 'ZH', taxMultiplier: 109, churchTaxMultipliers: { catholic: 12, protestant: 12, christCatholic: 12 } },
  { id: 'zh-volketswil', name: 'Volketswil', cantonCode: 'ZH', taxMultiplier: 93, churchTaxMultipliers: { catholic: 10, protestant: 10, christCatholic: 10 } },
  { id: 'zh-faellanden', name: 'Fällanden', cantonCode: 'ZH', taxMultiplier: 99, churchTaxMultipliers: { catholic: 10, protestant: 10, christCatholic: 10 } },
  { id: 'zh-maur', name: 'Maur', cantonCode: 'ZH', taxMultiplier: 85, churchTaxMultipliers: { catholic: 9, protestant: 9, christCatholic: 9 } },
  { id: 'zh-greifensee', name: 'Greifensee', cantonCode: 'ZH', taxMultiplier: 96, churchTaxMultipliers: { catholic: 10, protestant: 10, christCatholic: 10 } },

  // Limmattal
  { id: 'zh-oberengstringen', name: 'Oberengstringen', cantonCode: 'ZH', taxMultiplier: 97, churchTaxMultipliers: { catholic: 10, protestant: 10, christCatholic: 10 } },
  { id: 'zh-unterengstringen', name: 'Unterengstringen', cantonCode: 'ZH', taxMultiplier: 89, churchTaxMultipliers: { catholic: 10, protestant: 10, christCatholic: 10 } },
  { id: 'zh-urdorf', name: 'Urdorf', cantonCode: 'ZH', taxMultiplier: 100, churchTaxMultipliers: { catholic: 10, protestant: 10, christCatholic: 10 } },
  { id: 'zh-birmensdorf', name: 'Birmensdorf', cantonCode: 'ZH', taxMultiplier: 92, churchTaxMultipliers: { catholic: 10, protestant: 10, christCatholic: 10 } },
  { id: 'zh-uitikon', name: 'Uitikon', cantonCode: 'ZH', taxMultiplier: 80, churchTaxMultipliers: { catholic: 9, protestant: 9, christCatholic: 9 } },

  // Unterland
  { id: 'zh-niederglatt', name: 'Niederglatt', cantonCode: 'ZH', taxMultiplier: 108, churchTaxMultipliers: { catholic: 11, protestant: 11, christCatholic: 11 } },
  { id: 'zh-oberglatt', name: 'Oberglatt', cantonCode: 'ZH', taxMultiplier: 105, churchTaxMultipliers: { catholic: 11, protestant: 11, christCatholic: 11 } },
  { id: 'zh-rumlang', name: 'Rümlang', cantonCode: 'ZH', taxMultiplier: 100, churchTaxMultipliers: { catholic: 10, protestant: 10, christCatholic: 10 } },

  // Weinland
  { id: 'zh-andelfingen', name: 'Andelfingen', cantonCode: 'ZH', taxMultiplier: 115, churchTaxMultipliers: { catholic: 12, protestant: 12, christCatholic: 12 } },

  // Oberland
  { id: 'zh-hinwil', name: 'Hinwil', cantonCode: 'ZH', taxMultiplier: 113, churchTaxMultipliers: { catholic: 11, protestant: 11, christCatholic: 11 } },
  { id: 'zh-rueti', name: 'Rüti', cantonCode: 'ZH', taxMultiplier: 105, churchTaxMultipliers: { catholic: 11, protestant: 11, christCatholic: 11 } },
  { id: 'zh-duernten', name: 'Dürnten', cantonCode: 'ZH', taxMultiplier: 102, churchTaxMultipliers: { catholic: 11, protestant: 11, christCatholic: 11 } },
  { id: 'zh-pfaeffikon', name: 'Pfäffikon', cantonCode: 'ZH', taxMultiplier: 101, churchTaxMultipliers: { catholic: 11, protestant: 11, christCatholic: 11 } },

  // Knonaueramt
  { id: 'zh-affoltern-am-albis', name: 'Affoltern am Albis', cantonCode: 'ZH', taxMultiplier: 107, churchTaxMultipliers: { catholic: 11, protestant: 11, christCatholic: 11 } },
  { id: 'zh-mettmenstetten', name: 'Mettmenstetten', cantonCode: 'ZH', taxMultiplier: 103, churchTaxMultipliers: { catholic: 11, protestant: 11, christCatholic: 11 } },
];
