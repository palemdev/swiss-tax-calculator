import { Wallet, TrendingUp, TrendingDown, PiggyBank, Home } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { StatCard, CompactStatList } from '../common/Card';
import type { CompactStatItem } from '../common/Card';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

export function BudgetSummary() {
  const { results } = useBudget();

  // Build stats data for both layouts
  const buildStats = (): CompactStatItem[] => {
    if (!results) {
      return [
        { label: 'Monthly Net', value: '--', color: 'blue' },
        { label: 'Expenses', value: '--', color: 'red' },
        { label: 'Disposable', value: '--', color: 'green' },
        { label: 'Housing %', value: '--', color: 'amber' },
        { label: 'Savings Rate', value: '--', color: 'purple' },
      ];
    }

    const isDeficit = results.monthlyDisposableIncome < 0;
    const effectiveSavings = results.categories.savings.total + Math.max(0, results.monthlyDisposableIncome);
    const effectiveSavingsRate = (effectiveSavings / results.monthlyNetIncome) * 100;

    return [
      {
        label: 'Monthly Net',
        value: formatCurrency(results.monthlyNetIncome),
        color: 'blue',
        icon: <Wallet className="w-4 h-4 text-blue-500" />,
      },
      {
        label: 'Expenses',
        value: formatCurrency(results.monthlyExpenses),
        color: 'red',
        icon: <TrendingDown className="w-4 h-4 text-red-500" />,
      },
      {
        label: 'Unallocated',
        value: `${formatCurrency(Math.abs(results.monthlyDisposableIncome))} / mo`,
        color: isDeficit ? 'red' : 'green',
        icon: isDeficit ? (
          <TrendingDown className="w-4 h-4 text-red-500" />
        ) : (
          <TrendingUp className="w-4 h-4 text-green-500" />
        ),
      },
      {
        label: 'Housing %',
        value: formatPercentage(results.housingRatio),
        color: results.housingRatio <= 30 ? 'amber' : 'red',
        icon: <Home className="w-4 h-4 text-amber-500" />,
      },
      {
        label: 'Savings Rate',
        value: formatPercentage(effectiveSavingsRate),
        color: effectiveSavingsRate >= 20 ? 'purple' : effectiveSavingsRate >= 10 ? 'green' : 'amber',
        icon: <PiggyBank className="w-4 h-4 text-purple-500" />,
      },
    ];
  };

  const stats = buildStats();

  // Calculate values for desktop cards (only when results exist)
  const isDeficit = results ? results.monthlyDisposableIncome < 0 : false;
  const effectiveSavings = results ? results.categories.savings.total + Math.max(0, results.monthlyDisposableIncome) : 0;
  const effectiveSavingsRate = results ? (effectiveSavings / results.monthlyNetIncome) * 100 : 0;

  return (
    <>
      {/* Mobile: Compact list */}
      <div className="md:hidden">
        <CompactStatList items={stats} />
      </div>

      {/* Desktop: Card grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Monthly Net Income"
          value={results ? formatCurrency(results.monthlyNetIncome) : '--'}
          subValue={results ? `${formatCurrency(results.netIncome)} / year` : undefined}
          color="blue"
          icon={results ? <Wallet className="w-5 h-5 text-blue-500" /> : undefined}
        />
        <StatCard
          label="Monthly Expenses"
          value={results ? formatCurrency(results.monthlyExpenses) : '--'}
          subValue={results ? `${formatCurrency(results.totalExpenses)} / year` : undefined}
          color="red"
          icon={results ? <TrendingDown className="w-5 h-5 text-red-500" /> : undefined}
        />
        <StatCard
          label="Unallocated"
          value={results ? `${formatCurrency(Math.abs(results.monthlyDisposableIncome))} / mo` : '--'}
          subValue={results ? (isDeficit ? 'Monthly deficit!' : 'Available for savings/goals') : undefined}
          color={isDeficit ? 'red' : 'green'}
          icon={
            results ? (
              isDeficit ? (
                <TrendingDown className="w-5 h-5 text-red-500" />
              ) : (
                <TrendingUp className="w-5 h-5 text-green-500" />
              )
            ) : undefined
          }
        />
        <StatCard
          label="Housing Ratio"
          value={results ? formatPercentage(results.housingRatio) : '--'}
          subValue={results ? (results.housingRatio <= 30 ? 'Within budget' : 'Above 30% limit') : undefined}
          color={results && results.housingRatio <= 30 ? 'amber' : 'red'}
          icon={results ? <Home className="w-5 h-5 text-amber-500" /> : undefined}
        />
        <StatCard
          label="Effective Savings"
          value={results ? formatPercentage(effectiveSavingsRate) : '--'}
          subValue={results ? `${formatCurrency(effectiveSavings)}/mo (budgeted + unallocated)` : undefined}
          color={effectiveSavingsRate >= 20 ? 'purple' : effectiveSavingsRate >= 10 ? 'green' : 'amber'}
          icon={results ? <PiggyBank className="w-5 h-5 text-purple-500" /> : undefined}
        />
      </div>
    </>
  );
}
