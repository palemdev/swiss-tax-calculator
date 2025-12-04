import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type {
  TaxpayerProfile,
  IncomeDetails,
  DeductionInputs,
  TaxBreakdown,
  TaxCalculationInput,
  TaxComparisonResult,
} from '../types';
import { calculateTax, calculateTaxForComparison } from '../services/taxCalculator';
import { allMunicipalities, cantonList } from '../data/cantons';
import { TAX_YEAR } from '../data/constants';

// Initial state values
const initialTaxpayer: TaxpayerProfile = {
  civilStatus: 'single',
  canton: 'ZH',
  municipality: 'zh-zurich',
  religion: 'none',
  partnerReligion: 'none',
  numberOfChildren: 0,
  childrenInChildcare: 0,
};

const initialIncome: IncomeDetails = {
  primaryIncome: 100000,
  secondaryIncome: 0,
  selfEmploymentIncome: 0,
  investmentIncome: 0,
  rentalIncome: 0,
  otherIncome: 0,
};

const initialDeductions: DeductionInputs = {
  actualCommutingCosts: 0,
  usesFlatRateProfessional: true,
  mealExpenses: 0,
  professionalExpenses: 0,
  healthInsurancePremiums: 3600,
  otherInsurancePremiums: 0,
  pillar2Contributions: 0,
  pillar3aContributions: 0,
  hasEmployerPension: true,
  childcareExpenses: 0,
  alimonyPaid: 0,
  debtInterest: 0,
  charitableDonations: 0,
  medicalExpenses: 0,
  otherDeductions: 0,
};

interface TaxState {
  taxpayer: TaxpayerProfile;
  income: IncomeDetails;
  deductions: DeductionInputs;
  results: TaxBreakdown | null;
  comparisonResults: TaxComparisonResult[];
  isCalculating: boolean;
  enableDeductions: boolean;
  showAdvancedDeductions: boolean;
}

type TaxAction =
  | { type: 'SET_TAXPAYER'; payload: Partial<TaxpayerProfile> }
  | { type: 'SET_INCOME'; payload: Partial<IncomeDetails> }
  | { type: 'SET_DEDUCTIONS'; payload: Partial<DeductionInputs> }
  | { type: 'SET_RESULTS'; payload: TaxBreakdown | null }
  | { type: 'SET_COMPARISON_RESULTS'; payload: TaxComparisonResult[] }
  | { type: 'SET_CALCULATING'; payload: boolean }
  | { type: 'TOGGLE_DEDUCTIONS' }
  | { type: 'TOGGLE_ADVANCED_DEDUCTIONS' }
  | { type: 'RESET' };

const initialState: TaxState = {
  taxpayer: initialTaxpayer,
  income: initialIncome,
  deductions: initialDeductions,
  results: null,
  comparisonResults: [],
  isCalculating: false,
  enableDeductions: false,
  showAdvancedDeductions: false,
};

function taxReducer(state: TaxState, action: TaxAction): TaxState {
  switch (action.type) {
    case 'SET_TAXPAYER':
      return { ...state, taxpayer: { ...state.taxpayer, ...action.payload } };
    case 'SET_INCOME':
      return { ...state, income: { ...state.income, ...action.payload } };
    case 'SET_DEDUCTIONS':
      return { ...state, deductions: { ...state.deductions, ...action.payload } };
    case 'SET_RESULTS':
      return { ...state, results: action.payload };
    case 'SET_COMPARISON_RESULTS':
      return { ...state, comparisonResults: action.payload };
    case 'SET_CALCULATING':
      return { ...state, isCalculating: action.payload };
    case 'TOGGLE_DEDUCTIONS':
      return { ...state, enableDeductions: !state.enableDeductions };
    case 'TOGGLE_ADVANCED_DEDUCTIONS':
      return { ...state, showAdvancedDeductions: !state.showAdvancedDeductions };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface TaxContextValue extends TaxState {
  updateTaxpayer: (data: Partial<TaxpayerProfile>) => void;
  updateIncome: (data: Partial<IncomeDetails>) => void;
  updateDeductions: (data: Partial<DeductionInputs>) => void;
  calculate: () => void;
  runComparison: () => void;
  toggleDeductions: () => void;
  toggleAdvancedDeductions: () => void;
  reset: () => void;
}

const TaxContext = createContext<TaxContextValue | undefined>(undefined);

export function TaxProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(taxReducer, initialState);

  const updateTaxpayer = useCallback((data: Partial<TaxpayerProfile>) => {
    dispatch({ type: 'SET_TAXPAYER', payload: data });
  }, []);

  const updateIncome = useCallback((data: Partial<IncomeDetails>) => {
    dispatch({ type: 'SET_INCOME', payload: data });
  }, []);

  const updateDeductions = useCallback((data: Partial<DeductionInputs>) => {
    dispatch({ type: 'SET_DEDUCTIONS', payload: data });
  }, []);

  const calculate = useCallback(() => {
    dispatch({ type: 'SET_CALCULATING', payload: true });

    try {
      const input: TaxCalculationInput = {
        year: TAX_YEAR,
        taxpayer: state.taxpayer,
        income: state.income,
        deductions: state.deductions,
        enableDeductions: state.enableDeductions,
      };

      const results = calculateTax(input);
      dispatch({ type: 'SET_RESULTS', payload: results });
    } catch (error) {
      console.error('Tax calculation error:', error);
      dispatch({ type: 'SET_RESULTS', payload: null });
    } finally {
      dispatch({ type: 'SET_CALCULATING', payload: false });
    }
  }, [state.taxpayer, state.income, state.deductions, state.enableDeductions]);

  const runComparison = useCallback(() => {
    dispatch({ type: 'SET_CALCULATING', payload: true });

    try {
      const input: TaxCalculationInput = {
        year: TAX_YEAR,
        taxpayer: state.taxpayer,
        income: state.income,
        deductions: state.deductions,
        enableDeductions: state.enableDeductions,
      };

      const results: TaxComparisonResult[] = [];

      // Calculate for all available municipalities
      for (const municipality of allMunicipalities) {
        const taxBreakdown = calculateTaxForComparison(
          input,
          municipality.cantonCode,
          municipality.id
        );

        if (taxBreakdown) {
          results.push({
            canton: municipality.cantonCode,
            cantonName: cantonList.find(c => c.code === municipality.cantonCode)?.name || municipality.cantonCode,
            municipality: municipality.id,
            municipalityName: municipality.name,
            taxBreakdown,
            ranking: 0,
            differenceFromCheapest: 0,
            differenceFromAverage: 0,
          });
        }
      }

      // Sort by total tax and calculate rankings/differences
      results.sort((a, b) => a.taxBreakdown.totalTax - b.taxBreakdown.totalTax);

      const cheapest = results[0]?.taxBreakdown.totalTax || 0;
      const average = results.reduce((sum, r) => sum + r.taxBreakdown.totalTax, 0) / results.length;

      results.forEach((result, index) => {
        result.ranking = index + 1;
        result.differenceFromCheapest = result.taxBreakdown.totalTax - cheapest;
        result.differenceFromAverage = result.taxBreakdown.totalTax - average;
      });

      dispatch({ type: 'SET_COMPARISON_RESULTS', payload: results });
    } catch (error) {
      console.error('Comparison error:', error);
      dispatch({ type: 'SET_COMPARISON_RESULTS', payload: [] });
    } finally {
      dispatch({ type: 'SET_CALCULATING', payload: false });
    }
  }, [state.taxpayer, state.income, state.deductions, state.enableDeductions]);

  const toggleDeductions = useCallback(() => {
    dispatch({ type: 'TOGGLE_DEDUCTIONS' });
  }, []);

  const toggleAdvancedDeductions = useCallback(() => {
    dispatch({ type: 'TOGGLE_ADVANCED_DEDUCTIONS' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // Auto-calculate when inputs change
  useEffect(() => {
    const timer = setTimeout(() => {
      calculate();
    }, 300);

    return () => clearTimeout(timer);
  }, [state.taxpayer, state.income, state.deductions, state.enableDeductions, calculate]);

  const value: TaxContextValue = {
    ...state,
    updateTaxpayer,
    updateIncome,
    updateDeductions,
    calculate,
    runComparison,
    toggleDeductions,
    toggleAdvancedDeductions,
    reset,
  };

  return <TaxContext.Provider value={value}>{children}</TaxContext.Provider>;
}

export function useTax() {
  const context = useContext(TaxContext);
  if (context === undefined) {
    throw new Error('useTax must be used within a TaxProvider');
  }
  return context;
}
