import { useMemo, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { useBudget } from '../../context/BudgetContext';
import { useTax } from '../../context/TaxContext';
import { Card } from '../common/Card';
import { formatCurrency, formatChartCurrency } from '../../utils/formatters';
import { BUDGET_COLORS } from '../../types/budget';

export function BudgetComparisonChart() {
  const { comparisonResults } = useBudget();
  const { taxpayer } = useTax();

  // Get top 15 by disposable income and add current location if not in top 15
  const chartData = useMemo(() => {
    if (comparisonResults.length === 0) return [];

    const top15 = comparisonResults.slice(0, 15);

    const currentInTop = top15.some(
      (r) => r.cantonCode === taxpayer.canton && r.municipalityId === taxpayer.municipality
    );

    if (!currentInTop) {
      const current = comparisonResults.find(
        (r) => r.cantonCode === taxpayer.canton && r.municipalityId === taxpayer.municipality
      );
      if (current) {
        top15.push(current);
        // Re-sort to maintain order
        top15.sort((a, b) => b.monthlyDisposableIncome - a.monthlyDisposableIncome);
      }
    }

    return top15.map((r) => ({
      name: `${r.municipalityName} (${r.cantonCode})`,
      disposable: r.monthlyDisposableIncome,
      tax: r.totalTax / 12,
      livingCost: r.totalMonthlyCost,
      isCurrent: r.cantonCode === taxpayer.canton && r.municipalityId === taxpayer.municipality,
    }));
  }, [comparisonResults, taxpayer]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderTooltip = useCallback(({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          <p className="text-sm text-green-600">
            Disposable: {formatCurrency(data.disposable)}/mo
          </p>
          <p className="text-sm text-blue-600">
            Tax: {formatCurrency(data.tax)}/mo
          </p>
          <p className="text-sm text-amber-600">
            Living cost: {formatCurrency(data.livingCost)}/mo
          </p>
        </div>
      );
    }
    return null;
  }, []);

  if (comparisonResults.length === 0) {
    return null;
  }

  const averageDisposable =
    comparisonResults.reduce((sum, r) => sum + r.monthlyDisposableIncome, 0) /
    comparisonResults.length;

  return (
    <Card
      title="Disposable Income by Location"
      subtitle="Net income after taxes and living costs"
    >
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={formatChartCurrency}
              tick={{ fontSize: 11 }}
              stroke="#9ca3af"
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11 }}
              stroke="#9ca3af"
              width={110}
            />
            <Tooltip content={renderTooltip} />
            <ReferenceLine
              x={averageDisposable}
              stroke="#6b7280"
              strokeDasharray="5 5"
              label={{
                value: 'Average',
                position: 'top',
                fill: '#6b7280',
                fontSize: 11,
              }}
            />
            <Bar dataKey="disposable" name="Disposable Income" fill={BUDGET_COLORS.disposable}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.disposable >= 0 ? BUDGET_COLORS.disposable : '#ef4444'}
                  fillOpacity={entry.isCurrent ? 1 : 0.8}
                  stroke={entry.isCurrent ? '#dc2626' : 'none'}
                  strokeWidth={entry.isCurrent ? 2 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-gray-500 text-center mt-4">
        Disposable income = Net income - Taxes - Estimated living costs
      </p>
    </Card>
  );
}
