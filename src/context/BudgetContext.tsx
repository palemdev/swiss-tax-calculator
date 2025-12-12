/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type {
  BudgetInputs,
  BudgetBreakdown,
  BudgetComparisonResult,
} from '../types/budget';
import { DEFAULT_BUDGET_INPUTS } from '../types/budget';
import {
  calculateBudget,
  calculateBudgetComparison,
  getBudgetSuggestions,
} from '../services/budgetCalculator';
import { useTax } from './TaxContext';
import { TAX_YEAR } from '../data/constants';

// ============================================
// State Types
// ============================================

interface BudgetState {
  inputs: BudgetInputs;
  results: BudgetBreakdown | null;
  comparisonResults: BudgetComparisonResult[];
  suggestions: string[];
  isCalculating: boolean;
  showAdvancedInputs: boolean;
}

type BudgetAction =
  | { type: 'SET_INPUTS'; payload: Partial<BudgetInputs> }
  | { type: 'SET_RESULTS'; payload: BudgetBreakdown | null }
  | { type: 'SET_COMPARISON_RESULTS'; payload: BudgetComparisonResult[] }
  | { type: 'SET_SUGGESTIONS'; payload: string[] }
  | { type: 'SET_CALCULATING'; payload: boolean }
  | { type: 'TOGGLE_ADVANCED_INPUTS' }
  | { type: 'RESET' };

const initialState: BudgetState = {
  inputs: DEFAULT_BUDGET_INPUTS,
  results: null,
  comparisonResults: [],
  suggestions: [],
  isCalculating: false,
  showAdvancedInputs: false,
};

// ============================================
// Reducer
// ============================================

function budgetReducer(state: BudgetState, action: BudgetAction): BudgetState {
  switch (action.type) {
    case 'SET_INPUTS':
      return { ...state, inputs: { ...state.inputs, ...action.payload } };
    case 'SET_RESULTS':
      return { ...state, results: action.payload };
    case 'SET_COMPARISON_RESULTS':
      return { ...state, comparisonResults: action.payload };
    case 'SET_SUGGESTIONS':
      return { ...state, suggestions: action.payload };
    case 'SET_CALCULATING':
      return { ...state, isCalculating: action.payload };
    case 'TOGGLE_ADVANCED_INPUTS':
      return { ...state, showAdvancedInputs: !state.showAdvancedInputs };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// ============================================
// Context
// ============================================

interface BudgetContextValue extends BudgetState {
  updateInputs: (data: Partial<BudgetInputs>) => void;
  calculate: () => void;
  runComparison: () => void;
  toggleAdvancedInputs: () => void;
  reset: () => void;
}

const BudgetContext = createContext<BudgetContextValue | undefined>(undefined);

// ============================================
// Provider
// ============================================

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(budgetReducer, initialState);
  const { taxpayer, income, deductions, results: taxResults, enableDeductions } = useTax();

  const updateInputs = useCallback((data: Partial<BudgetInputs>) => {
    dispatch({ type: 'SET_INPUTS', payload: data });
  }, []);

  const calculate = useCallback(() => {
    if (!taxResults) {
      dispatch({ type: 'SET_RESULTS', payload: null });
      dispatch({ type: 'SET_SUGGESTIONS', payload: [] });
      return;
    }

    dispatch({ type: 'SET_CALCULATING', payload: true });

    try {
      const budgetResults = calculateBudget({
        taxpayer,
        taxResults,
        budgetInputs: state.inputs,
      });

      dispatch({ type: 'SET_RESULTS', payload: budgetResults });

      // Generate suggestions
      const suggestions = getBudgetSuggestions(budgetResults);
      dispatch({ type: 'SET_SUGGESTIONS', payload: suggestions });
    } catch (error) {
      console.error('Budget calculation error:', error);
      dispatch({ type: 'SET_RESULTS', payload: null });
      dispatch({ type: 'SET_SUGGESTIONS', payload: [] });
    } finally {
      dispatch({ type: 'SET_CALCULATING', payload: false });
    }
  }, [taxpayer, taxResults, state.inputs]);

  const runComparison = useCallback(() => {
    dispatch({ type: 'SET_CALCULATING', payload: true });

    try {
      const results = calculateBudgetComparison(
        {
          year: TAX_YEAR,
          taxpayer,
          income,
          deductions,
          enableDeductions,
        },
        state.inputs
      );

      dispatch({ type: 'SET_COMPARISON_RESULTS', payload: results });
    } catch (error) {
      console.error('Budget comparison error:', error);
      dispatch({ type: 'SET_COMPARISON_RESULTS', payload: [] });
    } finally {
      dispatch({ type: 'SET_CALCULATING', payload: false });
    }
  }, [taxpayer, income, deductions, enableDeductions, state.inputs]);

  const toggleAdvancedInputs = useCallback(() => {
    dispatch({ type: 'TOGGLE_ADVANCED_INPUTS' });
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
  }, [state.inputs, taxResults, calculate]);

  // Update childcare inputs when taxpayer children change
  useEffect(() => {
    if (taxpayer.childrenInChildcare !== state.inputs.childrenInDaycare) {
      dispatch({
        type: 'SET_INPUTS',
        payload: { childrenInDaycare: taxpayer.childrenInChildcare },
      });
    }
  }, [taxpayer.childrenInChildcare, state.inputs.childrenInDaycare]);

  const value: BudgetContextValue = {
    ...state,
    updateInputs,
    calculate,
    runComparison,
    toggleAdvancedInputs,
    reset,
  };

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
}

// ============================================
// Hook
// ============================================

export function useBudget() {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
}
