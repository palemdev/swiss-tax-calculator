
import { Wallet, TrendingDown, Percent, PiggyBank, Home } from 'lucide-react';
import { useTax } from '../../context/TaxContext';
import { StatCard } from '../common/Card';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

export function TaxSummary() {
  const { results, enableDeductions } = useTax();

  if (!results) {
    return (
      <div className={`grid grid-cols-2 ${enableDeductions ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-4`}>
        <StatCard label="Total Tax" value="--" color="red" />
        <StatCard label="Net Income" value="--" color="green" />
        <StatCard label="Effective Rate" value="--" color="blue" />
        <StatCard label="Max Rent" value="--" color="amber" />
        {enableDeductions && <StatCard label="Total Deductions" value="--" color="purple" />}
      </div>
    );
  }

  const maxRent = (results.netIncome / 12) * 0.3;

  return (
    <div className={`grid grid-cols-2 ${enableDeductions ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-4`}>
      <StatCard
        label="Total Tax"
        value={formatCurrency(results.totalTax)}
        subValue={`${formatPercentage(results.effectiveRate)} of gross`}
        color="red"
        icon={<Wallet className="w-5 h-5 text-red-500" />}
      />
      <StatCard
        label="Net Income"
        value={`${formatCurrency(results.netIncome / 12)} / mo`}
        subValue={`${formatCurrency(results.netIncome)} / year`}
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
      {enableDeductions && (
        <StatCard
          label="Total Deductions"
          value={formatCurrency(results.totalDeductions)}
          subValue="Tax savings applied"
          color="purple"
          icon={<TrendingDown className="w-5 h-5 text-purple-500" />}
        />
      )}
    </div>
  );
}
