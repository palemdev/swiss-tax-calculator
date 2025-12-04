import { useEffect } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { useTax } from '../context/TaxContext';
import { TaxSummary } from '../components/results/TaxSummary';
import { ComparisonTable } from '../components/comparison/ComparisonTable';
import { ComparisonChart } from '../components/comparison/ComparisonChart';
import { Card } from '../components/common/Card';
import { formatCurrency, formatPercentage } from '../utils/formatters';

export function ComparisonPage() {
  const { comparisonResults, runComparison, isCalculating, results } = useTax();

  // Run comparison when page loads or results change
  useEffect(() => {
    if (results && comparisonResults.length === 0) {
      runComparison();
    }
  }, [results]);

  const handleRefresh = () => {
    runComparison();
  };

  // Find best and worst
  const bestLocation = comparisonResults[0];
  const worstLocation = comparisonResults[comparisonResults.length - 1];
  const currentLocation = comparisonResults.find(
    (r) => r.taxBreakdown.totalTax === results?.totalTax
  );
  const potentialSavings = currentLocation && bestLocation
    ? currentLocation.taxBreakdown.totalTax - bestLocation.taxBreakdown.totalTax
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Summary Cards */}
      <div className="mb-8">
        <TaxSummary />
      </div>

      {/* Comparison Stats */}
      {comparisonResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-green-50 border-green-200">
            <div className="text-center">
              <p className="text-sm font-medium text-green-800">Cheapest Location</p>
              <p className="text-2xl font-bold text-green-700 mt-1">
                {bestLocation?.municipalityName} ({bestLocation?.canton})
              </p>
              <p className="text-lg text-green-600 mt-1">
                {formatCurrency(bestLocation?.taxBreakdown.totalTax || 0)}
              </p>
              <p className="text-sm text-green-600">
                {formatPercentage(bestLocation?.taxBreakdown.effectiveRate || 0)} effective rate
              </p>
            </div>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <div className="text-center">
              <p className="text-sm font-medium text-blue-800">Potential Savings</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">
                {formatCurrency(potentialSavings)}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                per year by moving to {bestLocation?.municipalityName}
              </p>
              {currentLocation && (
                <p className="text-sm text-blue-600">
                  Your current rank: #{currentLocation.ranking} of {comparisonResults.length}
                </p>
              )}
            </div>
          </Card>

          <Card className="bg-red-50 border-red-200">
            <div className="text-center">
              <p className="text-sm font-medium text-red-800">Most Expensive</p>
              <p className="text-2xl font-bold text-red-700 mt-1">
                {worstLocation?.municipalityName} ({worstLocation?.canton})
              </p>
              <p className="text-lg text-red-600 mt-1">
                {formatCurrency(worstLocation?.taxBreakdown.totalTax || 0)}
              </p>
              <p className="text-sm text-red-600">
                +{formatCurrency(
                  (worstLocation?.taxBreakdown.totalTax || 0) - (bestLocation?.taxBreakdown.totalTax || 0)
                )} vs cheapest
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Refresh Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleRefresh}
          disabled={isCalculating}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isCalculating ? 'animate-spin' : ''}`} />
          {isCalculating ? 'Calculating...' : 'Refresh Comparison'}
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium">About this comparison</p>
          <p className="mt-1">
            This comparison uses your current income and deduction settings to calculate taxes
            across all available municipalities. Click "Select" on any row to switch to that
            location and see the full breakdown.
          </p>
        </div>
      </div>

      {/* Comparison Chart */}
      {comparisonResults.length > 0 && (
        <div className="mb-8">
          <ComparisonChart />
        </div>
      )}

      {/* Comparison Table */}
      <ComparisonTable />
    </div>
  );
}
