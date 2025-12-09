import type { CantonCostOfLiving } from '../../types/budget';

// Zürich Canton Cost of Living Data (2025)
// Sources: BFS, Comparis, Wüest Partner, BAG health insurance data

export const zurichCostOfLiving: CantonCostOfLiving = {
  cantonCode: 'ZH',
  cantonName: 'Zürich',

  rent: {
    // City of Zürich - one of Switzerland's most expensive rental markets
    urban: {
      studio: 1450,        // 1-room apartment
      twoRoom: 1850,       // 2-room apartment
      threeRoom: 2400,     // 3-room apartment
      fourPlusRoom: 3200,  // 4+ room apartment
    },
    // Suburban areas (Winterthur, Uster, Dübendorf, etc.)
    suburban: {
      studio: 1150,
      twoRoom: 1500,
      threeRoom: 1950,
      fourPlusRoom: 2600,
    },
  },

  // BAG health insurance premiums for Zürich (Region 1 - highest)
  // Based on 2025 premiums
  healthInsurance: {
    adultStandard: 452,        // Adult, 300 CHF franchise
    adultHighDeductible: 295,  // Adult, 2500 CHF franchise
    child: 118,                // Child (0-18)
    youngAdult: 384,           // Young adult (19-25)
  },

  // Childcare costs in Zürich area
  // Zürich has subsidized daycare but still expensive
  childcare: {
    daycareFullTime: 2200,     // Full-time daycare per child (before subsidies)
    daycarePartTime: 1200,     // Part-time (3 days/week)
    afterSchool: 650,          // After-school care
  },

  // Cost indices relative to Swiss average (100)
  // Zürich is above average in most categories
  costIndex: {
    overall: 112,
    housing: 125,
    groceries: 105,
    transport: 100,
    healthcare: 115,
  },

  referenceCities: {
    urban: 'Zürich',
    suburban: 'Winterthur',
  },
};
