
import { TaxpayerForm } from '../components/forms/TaxpayerForm';
import { IncomeForm } from '../components/forms/IncomeForm';
import { DeductionsForm } from '../components/forms/DeductionsForm';
import { TaxSummary } from '../components/results/TaxSummary';
import { TaxBreakdown } from '../components/results/TaxBreakdown';
import { DeductionsSummary } from '../components/results/DeductionsSummary';
import { TaxDistributionPie } from '../components/charts/TaxDistributionPie';
import { MarginalRateChart } from '../components/charts/MarginalRateChart';
import { WealthTaxRateChart } from '../components/charts/WealthTaxRateChart';
import { IncomeBreakdownChart } from '../components/charts/IncomeBreakdownChart';

export function CalculatorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Summary Cards */}
      <div className="mb-8">
        <TaxSummary />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Forms */}
        <div className="space-y-6">
          <TaxpayerForm />
          <IncomeForm />
          <DeductionsForm />
        </div>

        {/* Right Column - Results & Charts */}
        <div className="space-y-6">
          <TaxBreakdown />
          <TaxDistributionPie />
          <DeductionsSummary />
        </div>
      </div>

      {/* Full Width Charts */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Tax Rate Charts */}
        <div className="space-y-6">
          <MarginalRateChart />
          <WealthTaxRateChart />
        </div>

        {/* Right Column - Income Breakdown */}
        <div>
          <IncomeBreakdownChart />
        </div>
      </div>
    </div>
  );
}
