import { Wallet, TrendingUp, TrendingDown, PiggyBank, Home } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { StatCard } from '../common/Card';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

export function BudgetSummary() {
  const { results } = useBudget();

  if (!results) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Monthly Net" value="--" color="blue" />
        <StatCard label="Expenses" value="--" color="red" />
        <StatCard label="Disposable" value="--" color="green" />
        <StatCard label="Housing %" value="--" color="amber" />
        <StatCard label="Savings Rate" value="--" color="purple" />
      </div>
    );
  }

  const isDeficit = results.monthlyDisposableIncome < 0;

  // Calculate effective savings rate (budgeted savings + unallocated disposable income)
  const effectiveSavings = results.categories.savings.total + Math.max(0, results.monthlyDisposableIncome);
  const effectiveSavingsRate = (effectiveSavings / results.monthlyNetIncome) * 100;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        label="Monthly Net Income"
        value={formatCurrency(results.monthlyNetIncome)}
        subValue={`${formatCurrency(results.netIncome)} / year`}
        color="blue"
        icon={<Wallet className="w-5 h-5 text-blue-500" />}
      />
      <StatCard
        label="Monthly Expenses"
        value={formatCurrency(results.monthlyExpenses)}
        subValue={`${formatCurrency(results.totalExpenses)} / year`}
        color="red"
        icon={<TrendingDown className="w-5 h-5 text-red-500" />}
      />
      <StatCard
        label="Unallocated"
        value={`${formatCurrency(Math.abs(results.monthlyDisposableIncome))} / mo`}
        subValue={isDeficit ? 'Monthly deficit!' : 'Available for savings/goals'}
        color={isDeficit ? 'red' : 'green'}
        icon={
          isDeficit ? (
            <TrendingDown className="w-5 h-5 text-red-500" />
          ) : (
            <TrendingUp className="w-5 h-5 text-green-500" />
          )
        }
      />
      <StatCard
        label="Housing Ratio"
        value={formatPercentage(results.housingRatio)}
        subValue={results.housingRatio <= 30 ? 'Within budget' : 'Above 30% limit'}
        color={results.housingRatio <= 30 ? 'amber' : 'red'}
        icon={<Home className="w-5 h-5 text-amber-500" />}
      />
      <StatCard
        label="Effective Savings"
        value={formatPercentage(effectiveSavingsRate)}
        subValue={`${formatCurrency(effectiveSavings)}/mo (budgeted + unallocated)`}
        color={effectiveSavingsRate >= 20 ? 'purple' : effectiveSavingsRate >= 10 ? 'green' : 'amber'}
        icon={<PiggyBank className="w-5 h-5 text-purple-500" />}
      />
    </div>
  );
}
