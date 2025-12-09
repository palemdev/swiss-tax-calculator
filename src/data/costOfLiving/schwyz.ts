import type { CantonCostOfLiving } from '../../types/budget';

// Schwyz Canton Cost of Living Data (2025)
// Sources: BFS, Comparis, Wüest Partner, BAG health insurance data
// Note: Schwyz has low taxes and moderate cost of living

export const schwyzCostOfLiving: CantonCostOfLiving = {
  cantonCode: 'SZ',
  cantonName: 'Schwyz',

  rent: {
    // Schwyz town and surroundings
    urban: {
      studio: 1200,        // 1-room apartment
      twoRoom: 1550,       // 2-room apartment
      threeRoom: 1950,     // 3-room apartment
      fourPlusRoom: 2600,  // 4+ room apartment
    },
    // Smaller municipalities (Arth, Küssnacht, etc.)
    suburban: {
      studio: 1050,
      twoRoom: 1350,
      threeRoom: 1700,
      fourPlusRoom: 2250,
    },
  },

  // BAG health insurance premiums for Schwyz
  // Inner Switzerland region - moderate premiums
  healthInsurance: {
    adultStandard: 365,        // Adult, 300 CHF franchise
    adultHighDeductible: 238,  // Adult, 2500 CHF franchise
    child: 92,                 // Child (0-18)
    youngAdult: 310,           // Young adult (19-25)
  },

  // Childcare costs in Schwyz
  // More affordable than Zürich/Zug
  childcare: {
    daycareFullTime: 1800,     // Full-time daycare per child
    daycarePartTime: 1000,     // Part-time (3 days/week)
    afterSchool: 550,          // After-school care
  },

  // Cost indices relative to Swiss average (100)
  // Schwyz is slightly below average overall
  costIndex: {
    overall: 98,
    housing: 105,
    groceries: 100,
    transport: 102,
    healthcare: 92,
  },

  referenceCities: {
    urban: 'Schwyz',
    suburban: 'Arth',
  },
};
