// ============================================
// Cost of Living Types
// ============================================

export interface RentBySize {
  studio: number;        // 1-room apartment
  twoRoom: number;       // 2-room apartment
  threeRoom: number;     // 3-room apartment
  fourPlusRoom: number;  // 4+ room apartment
}

export interface HealthInsurancePremiums {
  adultStandard: number;     // Adult with standard deductible (300 CHF)
  adultHighDeductible: number; // Adult with max deductible (2500 CHF)
  child: number;              // Child (0-18)
  youngAdult: number;         // Young adult (19-25)
}

export interface ChildcareCosts {
  daycareFullTime: number;    // Monthly full-time daycare (per child)
  daycarePartTime: number;    // Monthly part-time daycare (per child)
  afterSchool: number;        // After-school care (per child)
}

export interface CantonCostOfLiving {
  cantonCode: string;
  cantonName: string;

  // Housing costs (monthly median rents)
  rent: {
    urban: RentBySize;       // Major city in canton
    suburban: RentBySize;    // Suburban/smaller towns
  };

  // Health insurance (monthly premiums)
  healthInsurance: HealthInsurancePremiums;

  // Childcare costs (monthly)
  childcare: ChildcareCosts;

  // Cost index relative to Swiss average (100 = average)
  costIndex: {
    overall: number;
    housing: number;
    groceries: number;
    transport: number;
    healthcare: number;
  };

  // Representative municipalities for cost data
  referenceCities: {
    urban: string;      // Main city used for urban costs
    suburban: string;   // Representative suburban area
  };
}

// ============================================
// Budget Input Types
// ============================================

export type HousingSituation = 'rent' | 'own';
export type ApartmentSize = 'studio' | 'twoRoom' | 'threeRoom' | 'fourPlusRoom';
export type LocationType = 'urban' | 'suburban';
export type HealthInsuranceModel = 'standard' | 'highDeductible';
export type ChildcareType = 'none' | 'fullTime' | 'partTime' | 'afterSchool';

export interface BudgetInputs {
  // Housing
  housingSituation: HousingSituation;
  apartmentSize: ApartmentSize;
  locationType: LocationType;
  customRent?: number;           // Override automatic calculation

  // Health Insurance
  healthInsuranceModel: HealthInsuranceModel;
  customHealthInsurance?: number; // Override automatic calculation

  // Childcare (uses numberOfChildren from TaxpayerProfile)
  childcareType: ChildcareType;
  childrenInDaycare: number;
  customChildcare?: number;       // Override automatic calculation

  // Transportation
  hasPublicTransportPass: boolean;
  publicTransportCost: number;    // Monthly GA/regional pass cost
  hasCar: boolean;
  carCosts: number;               // Monthly car costs (lease/fuel/insurance)

  // Food & Groceries
  groceriesCost: number;          // Monthly groceries
  diningOutCost: number;          // Monthly restaurants/takeout

  // Other regular expenses
  phonePlan: number;
  internetCost: number;
  streamingServices: number;
  gymMembership: number;
  otherSubscriptions: number;

  // Insurance (non-health)
  liabilityInsurance: number;
  householdInsurance: number;
  otherInsurance: number;

  // Personal spending
  clothingBudget: number;
  personalCare: number;
  entertainmentBudget: number;
  hobbies: number;

  // Financial goals
  savingsTarget: number;          // Monthly savings goal
  emergencyFund: number;          // Monthly contribution to emergency fund
  investmentContribution: number; // Monthly investments (beyond pillar 3a)

  // Miscellaneous
  vacationBudget: number;         // Annual vacation budget / 12
  giftsBudget: number;            // Annual gifts budget / 12
  otherExpenses: number;
}

// ============================================
// Budget Calculation Result Types
// ============================================

export interface BudgetCategoryBreakdown {
  housing: {
    rent: number;
    utilities: number;  // Estimated based on apartment size
    total: number;
  };
  healthcare: {
    insurance: number;
    outOfPocket: number;  // Estimated deductible/franchise costs
    total: number;
  };
  children: {
    healthInsurance: number;   // Child health insurance premiums
    childcare: number;         // Daycare/after-school
    food: number;              // Additional food costs
    clothing: number;          // Children's clothing
    education: number;         // School supplies, activities
    total: number;
  };
  transportation: {
    publicTransport: number;
    car: number;
    total: number;
  };
  food: {
    groceries: number;
    diningOut: number;
    total: number;
  };
  telecommunications: {
    phone: number;
    internet: number;
    streaming: number;
    total: number;
  };
  insurance: {
    liability: number;
    household: number;
    other: number;
    total: number;
  };
  personal: {
    clothing: number;
    care: number;
    entertainment: number;
    hobbies: number;
    total: number;
  };
  savings: {
    general: number;
    emergency: number;
    investments: number;
    total: number;
  };
  other: {
    vacation: number;
    gifts: number;
    miscellaneous: number;
    total: number;
  };
}

export interface BudgetGuideline {
  category: string;
  recommendedPercentage: number;  // Swiss budget guidelines
  actualPercentage: number;
  actualAmount: number;
  status: 'good' | 'warning' | 'over';
  message: string;
}

export interface BudgetBreakdown {
  // Income (from tax calculation)
  grossIncome: number;
  netIncome: number;
  monthlyNetIncome: number;

  // Expenses by category
  categories: BudgetCategoryBreakdown;
  totalExpenses: number;
  monthlyExpenses: number;

  // Disposable income
  disposableIncome: number;          // Annual
  monthlyDisposableIncome: number;   // Monthly

  // Budget health indicators
  savingsRate: number;               // Percentage of net income saved
  housingRatio: number;              // Housing as % of net income
  guidelines: BudgetGuideline[];

  // Status
  isBalanced: boolean;               // Expenses <= Net income
  surplus: number;                   // Positive = surplus, negative = deficit
}

export interface BudgetComparisonResult {
  cantonCode: string;
  cantonName: string;
  municipalityId: string;
  municipalityName: string;

  // Tax comparison
  totalTax: number;
  netIncome: number;

  // Cost of living
  estimatedRent: number;
  estimatedHealthInsurance: number;
  estimatedChildcare: number;
  totalMonthlyCost: number;

  // Final disposable income
  monthlyDisposableIncome: number;
  annualDisposableIncome: number;

  // Rankings
  ranking: number;
  differenceFromBest: number;
}

// ============================================
// Budget Constants
// ============================================

export const SWISS_BUDGET_GUIDELINES = {
  housing: 25,           // Max 25-30% of net income
  healthcare: 10,        // Including insurance premiums
  food: 10,              // Groceries + dining
  transportation: 8,     // Public transport or car
  insurance: 3,          // Non-health insurance
  savings: 10,           // Minimum recommended savings
  personal: 5,           // Clothing, care, etc.
  entertainment: 5,      // Hobbies, entertainment
  other: 10,             // Miscellaneous
  buffer: 14,            // Unallocated for flexibility
} as const;

export const DEFAULT_BUDGET_INPUTS: BudgetInputs = {
  housingSituation: 'rent',
  apartmentSize: 'threeRoom',
  locationType: 'urban',

  healthInsuranceModel: 'standard',

  childcareType: 'none',
  childrenInDaycare: 0,

  hasPublicTransportPass: true,
  publicTransportCost: 200,
  hasCar: false,
  carCosts: 0,

  groceriesCost: 600,
  diningOutCost: 200,

  phonePlan: 50,
  internetCost: 60,
  streamingServices: 30,
  gymMembership: 60,
  otherSubscriptions: 20,

  liabilityInsurance: 15,
  householdInsurance: 25,
  otherInsurance: 0,

  clothingBudget: 100,
  personalCare: 50,
  entertainmentBudget: 150,
  hobbies: 100,

  savingsTarget: 500,
  emergencyFund: 200,
  investmentContribution: 0,

  vacationBudget: 250,
  giftsBudget: 50,
  otherExpenses: 100,
};

// Utility estimates
export const UTILITY_ESTIMATES = {
  studio: 80,
  twoRoom: 120,
  threeRoom: 150,
  fourPlusRoom: 200,
} as const;

// Monthly child cost estimates (per child, based on Swiss averages)
// Source: Budget-Beratung Schweiz, Pro Juventute
export const CHILD_COST_ESTIMATES = {
  // Age groups affect costs - we use averages
  food: 300,              // Additional food per child
  clothing: 80,           // Clothing per child
  education: 100,         // School supplies, extracurriculars, activities
  pocket: 30,             // Pocket money (older children)
} as const;

// Chart colors for budget categories
export const BUDGET_COLORS = {
  housing: '#ef4444',      // Red
  healthcare: '#f97316',   // Orange
  children: '#eab308',     // Yellow
  transportation: '#22c55e', // Green
  food: '#14b8a6',         // Teal
  telecommunications: '#3b82f6', // Blue
  insurance: '#6366f1',    // Indigo
  personal: '#8b5cf6',     // Purple
  savings: '#10b981',      // Emerald
  other: '#6b7280',        // Gray
  disposable: '#22c55e',   // Green
} as const;
