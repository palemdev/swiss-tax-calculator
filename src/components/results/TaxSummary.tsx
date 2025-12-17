
import { Wallet, TrendingDown, Percent, PiggyBank, Home } from 'lucide-react';
import { useTax } from '../../context/TaxContext';
import { StatCard } from '../common/Card';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

export function TaxSummary() {
  const { results, enableDeductions } = useTax();

  const gridCols = enableDeductions ? 'lg:grid-cols-5' : 'lg:grid-cols-4';

  if (!results) {
    return (
      <div className={`grid grid-cols-2 ${gridCols} gap-4`}>
        <StatCard label="Total Costs" value="--" color="red" />
        <StatCard label="Net Income" value="--" color="green" />
        <StatCard label="Effective Rate" value="--" color="blue" />
        <StatCard label="Max Rent" value="--" color="amber" />
        {enableDeductions && <StatCard label="Total Deductions" value="--" color="purple" />}
      </div>
    );
  }

  const maxRent = (results.netIncome / 12) * 0.3;
  const totalMandatoryCosts = results.totalTax + results.socialContributions.total;

  return (
    <div className={`grid grid-cols-2 ${gridCols} gap-4`}>
      <StatCard
        label="Total Costs"
        value={formatCurrency(totalMandatoryCosts)}
        subValue={`Tax + AHV/ALV`}
        color="red"
        icon={<Wallet className="w-5 h-5 text-red-500" />}
      />
      <StatCard
        label="Net Income"
        value={`${formatCurrency(results.netIncome / 12)} / mo`}
        subValue={`${formatCurrency(results.netIncome)} / yr`}
        color="green"
        icon={<PiggyBank className="w-5 h-5 text-green-500" />}
      />
      <StatCard
        label="Effective Rate"
        value={formatPercentage(results.effectiveRate)}
        subValue={`Marginal: ${formatPercentage(results.marginalRate)}`}
        color="blue"
        icon={<Percent className="w-5 h-5 text-blue-500" />}
      />
      <StatCard
        label="Max Rent"
        value={`${formatCurrency(maxRent)} / mo`}
        subValue="30% of net income"
        color="amber"
        icon={<Home className="w-5 h-5 text-amber-500" />}
      />
      {enableDeductions && (() => {
        const combinedDeductions = results.totalDeductions + results.totalDeductionsFederal;
        return (
          <StatCard
            label="Total Deductions"
            value={formatCurrency(combinedDeductions)}
            subValue={`Saves ~${formatCurrency(combinedDeductions * results.marginalRate / 100)}`}
            color="purple"
            icon={<TrendingDown className="w-5 h-5 text-purple-500" />}
          />
        );
      })()}
    </div>
  );
}
