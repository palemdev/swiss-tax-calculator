
import { Wallet, TrendingDown, Percent, PiggyBank } from 'lucide-react';
import { useTax } from '../../context/TaxContext';
import { StatCard } from '../common/Card';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

export function TaxSummary() {
  const { results } = useTax();

  if (!results) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tax" value="--" color="red" />
        <StatCard label="Net Income" value="--" color="green" />
        <StatCard label="Effective Rate" value="--" color="blue" />
        <StatCard label="Total Deductions" value="--" color="purple" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Tax"
        value={formatCurrency(results.totalTax)}
        subValue={`${formatPercentage(results.effectiveRate)} of gross`}
        color="red"
        icon={<Wallet className="w-5 h-5 text-red-500" />}
      />
      <StatCard
        label="Net Income"
        value={formatCurrency(results.netIncome)}
        subValue={`After all taxes`}
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
        label="Total Deductions"
        value={formatCurrency(results.totalDeductions)}
        subValue="Tax savings applied"
        color="purple"
        icon={<TrendingDown className="w-5 h-5 text-purple-500" />}
      />
    </div>
  );
}
