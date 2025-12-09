import type { CantonCostOfLiving } from '../../types/budget';

// Zug Canton Cost of Living Data (2025)
// Sources: BFS, Comparis, Wüest Partner, BAG health insurance data
// Note: Zug has low taxes but very high cost of living, especially housing

export const zugCostOfLiving: CantonCostOfLiving = {
  cantonCode: 'ZG',
  cantonName: 'Zug',

  rent: {
    // City of Zug - Switzerland's most expensive rental market
    urban: {
      studio: 1650,        // 1-room apartment
      twoRoom: 2200,       // 2-room apartment
      threeRoom: 2900,     // 3-room apartment
      fourPlusRoom: 3800,  // 4+ room apartment
    },
    // Smaller municipalities (Baar, Cham, etc.)
    suburban: {
      studio: 1400,
      twoRoom: 1850,
      threeRoom: 2400,
      fourPlusRoom: 3200,
    },
  },

  // BAG health insurance premiums for Zug
  // Zug has moderate health insurance costs despite high income levels
  healthInsurance: {
    adultStandard: 378,        // Adult, 300 CHF franchise
    adultHighDeductible: 248,  // Adult, 2500 CHF franchise
    child: 95,                 // Child (0-18)
    youngAdult: 320,           // Young adult (19-25)
  },

  // Childcare costs in Zug
  // High costs reflecting affluent area
  childcare: {
    daycareFullTime: 2500,     // Full-time daycare per child
    daycarePartTime: 1400,     // Part-time (3 days/week)
    afterSchool: 750,          // After-school care
  },

  // Cost indices relative to Swiss average (100)
  // Zug is Switzerland's most expensive canton for housing
  costIndex: {
    overall: 118,
    housing: 140,
    groceries: 105,
    transport: 98,
    healthcare: 95,
  },

  referenceCities: {
    urban: 'Zug',
    suburban: 'Baar',
  },
};
