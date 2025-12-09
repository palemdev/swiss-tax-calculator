import { RefreshCw } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import { useTax } from '../context/TaxContext';
import {
  BudgetSummary,
  BudgetHousingForm,
  BudgetHealthcareForm,
  BudgetChildcareForm,
  BudgetTransportForm,
  BudgetLivingForm,
  BudgetPersonalForm,
  BudgetBreakdownCard,
  BudgetGuidelinesCard,
  BudgetDistributionChart,
  BudgetComparisonChart,
  BudgetComparisonTable,
} from '../components/budget';
import { StatCard } from '../components/common/Card';

export function BudgetPage() {
  const { results: taxResults } = useTax();
  const { comparisonResults, isCalculating, runComparison } = useBudget();

  // Show message if no tax calculation yet
  if (!taxResults) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold text-amber-800 mb-2">
            Calculate your taxes first
          </h2>
          <p className="text-amber-700">
            The budget calculator uses your net income from the tax calculation.
            Please enter your income details on the Calculator tab first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Summary Cards */}
      <div className="mb-8">
        <BudgetSummary />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Forms */}
        <div className="space-y-6">
          <BudgetHousingForm />
          <BudgetHealthcareForm />
          <BudgetChildcareForm />
          <BudgetTransportForm />
          <BudgetLivingForm />
          <BudgetPersonalForm />
        </div>

        {/* Right Column - Results & Charts */}
        <div className="space-y-6">
          <BudgetBreakdownCard />
          <BudgetDistributionChart />
          <BudgetGuidelinesCard />
        </div>
      </div>

      {/* Comparison Section */}
      <div className="mt-12 border-t border-gray-200 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Compare Locations
            </h2>
            <p className="text-gray-600 mt-1">
              See how your budget changes across different cantons and municipalities
            </p>
          </div>
          <button
            onClick={runComparison}
            disabled={isCalculating}
            className="
              flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg
              hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            "
          >
            <RefreshCw className={`w-4 h-4 ${isCalculating ? 'animate-spin' : ''}`} />
            {isCalculating ? 'Calculating...' : 'Run Comparison'}
          </button>
        </div>

        {comparisonResults.length > 0 ? (
          <div className="space-y-8">
            {/* Comparison Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(() => {
                const best = comparisonResults[0];
                const worst = comparisonResults[comparisonResults.length - 1];

                return (
                  <>
                    <StatCard
                      label="Best Location"
                      value={`${best.municipalityName} (${best.cantonCode})`}
                      subValue={`CHF ${Math.round(best.monthlyDisposableIncome)}/mo disposable`}
                      color="green"
                    />
                    <StatCard
                      label="Potential Savings"
                      value={`CHF ${Math.round(best.monthlyDisposableIncome - worst.monthlyDisposableIncome)}/mo`}
                      subValue="Between best and worst location"
                      color="blue"
                    />
                    <StatCard
                      label="Most Expensive"
                      value={`${worst.municipalityName} (${worst.cantonCode})`}
                      subValue={`CHF ${Math.round(worst.monthlyDisposableIncome)}/mo disposable`}
                      color="red"
                    />
                  </>
                );
              })()}
            </div>

            <BudgetComparisonChart />
            <BudgetComparisonTable />
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-600">
              Click "Run Comparison" to compare your budget across all available locations.
              This considers both taxes and local cost of living differences.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
