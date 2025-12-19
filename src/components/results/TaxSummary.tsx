
import { Wallet, TrendingDown, Percent, PiggyBank, Home } from 'lucide-react';
import { useTax } from '../../context/TaxContext';
import { StatCard, CompactStatList } from '../common/Card';
import type { CompactStatItem } from '../common/Card';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

export function TaxSummary() {
  const { results, enableDeductions } = useTax();

  const gridCols = enableDeductions ? 'lg:grid-cols-5' : 'lg:grid-cols-4';

  // Build stats data for both layouts
  const buildStats = () => {
    if (!results) {
      const items: CompactStatItem[] = [
        { label: 'Net Income', value: '--', color: 'green' },
        { label: 'Total Costs', value: '--', color: 'red' },
        { label: 'Effective Rate', value: '--', color: 'blue' },
        { label: 'Max Rent', value: '--', color: 'amber' },
      ];
      if (enableDeductions) {
        items.push({ label: 'Total Deductions', value: '--', color: 'purple' });
      }
      return items;
    }

    const maxRent = (results.netIncome / 12) * 0.3;
    const totalMandatoryCosts = results.totalTax + results.socialContributions.total;
    const combinedDeductions = results.totalDeductions + results.totalDeductionsFederal;

    const items: CompactStatItem[] = [
      {
        label: 'Net Income',
        value: `${formatCurrency(results.netIncome / 12)} / mo`,
        color: 'green',
        icon: <PiggyBank className="w-4 h-4 text-green-500" />,
      },
      {
        label: 'Total Costs',
        value: formatCurrency(totalMandatoryCosts),
        color: 'red',
        icon: <Wallet className="w-4 h-4 text-red-500" />,
      },
      {
        label: 'Effective Rate',
        value: formatPercentage(results.effectiveRate),
        color: 'blue',
        icon: <Percent className="w-4 h-4 text-blue-500" />,
      },
      {
        label: 'Max Rent',
        value: `${formatCurrency(maxRent)} / mo`,
        color: 'amber',
        icon: <Home className="w-4 h-4 text-amber-500" />,
      },
    ];

    if (enableDeductions) {
      items.push({
        label: 'Total Deductions',
        value: formatCurrency(combinedDeductions),
        color: 'purple',
        icon: <TrendingDown className="w-4 h-4 text-purple-500" />,
      });
    }

    return items;
  };

  const stats = buildStats();
  const maxRent = results ? (results.netIncome / 12) * 0.3 : 0;
  const totalMandatoryCosts = results ? results.totalTax + results.socialContributions.total : 0;
  const combinedDeductions = results ? results.totalDeductions + results.totalDeductionsFederal : 0;

  return (
    <>
      {/* Mobile: Compact list */}
      <div className="md:hidden">
        <CompactStatList items={stats} />
      </div>

      {/* Desktop: Card grid */}
      <div className={`hidden md:grid grid-cols-2 ${gridCols} gap-4`}>
        <StatCard
          label="Net Income"
          value={results ? `${formatCurrency(results.netIncome / 12)} / mo` : '--'}
          subValue={results ? `${formatCurrency(results.netIncome)} / yr` : undefined}
          color="green"
          icon={results ? <PiggyBank className="w-5 h-5 text-green-500" /> : undefined}
        />
        <StatCard
          label="Total Costs"
          value={results ? formatCurrency(totalMandatoryCosts) : '--'}
          subValue={results ? 'Tax + AHV/ALV' : undefined}
          color="red"
          icon={results ? <Wallet className="w-5 h-5 text-red-500" /> : undefined}
        />
        <StatCard
          label="Effective Rate"
          value={results ? formatPercentage(results.effectiveRate) : '--'}
          subValue={results ? `Marginal: ${formatPercentage(results.marginalRate)}` : undefined}
          color="blue"
          icon={results ? <Percent className="w-5 h-5 text-blue-500" /> : undefined}
        />
        <StatCard
          label="Max Rent"
          value={results ? `${formatCurrency(maxRent)} / mo` : '--'}
          subValue={results ? '30% of net income' : undefined}
          color="amber"
          icon={results ? <Home className="w-5 h-5 text-amber-500" /> : undefined}
        />
        {enableDeductions && (
          <StatCard
            label="Total Deductions"
            value={results ? formatCurrency(combinedDeductions) : '--'}
            subValue={results ? `Saves ~${formatCurrency(combinedDeductions * results.marginalRate / 100)}` : undefined}
            color="purple"
            icon={results ? <TrendingDown className="w-5 h-5 text-purple-500" /> : undefined}
          />
        )}
      </div>
    </>
  );
}
