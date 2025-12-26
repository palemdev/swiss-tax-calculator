import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useTax } from '../../context/TaxContext';
import { Card } from '../common/Card';
import { formatCurrency, formatChartCurrency } from '../../utils/formatters';
import { TAX_COLORS } from '../../data/constants';
import { calculateTax } from '../../services/taxCalculator';
import { TAX_YEAR } from '../../data/constants';

interface TooltipPayloadEntry {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: number;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="font-medium text-gray-900 dark:text-gray-100">
          Wealth: {formatCurrency(label ?? 0)}
        </p>
        {payload.map((entry, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value.toFixed(3)}‰
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function WealthTaxRateChart() {
  const { taxpayer, income, deductions, enableDeductions } = useTax();

  // Only show if there's wealth entered
  const hasWealth = income.wealth > 0;

  // Generate data points for the chart
  const chartData = useMemo(() => {
    const dataPoints: {
      wealth: number;
      effectiveRate: number;
      baseRate: number;
    }[] = [];

    const maxWealth = Math.max(2000000, (income.wealth || 500000) * 2);
    const step = maxWealth / 50;

    for (let w = 0; w <= maxWealth; w += step) {
      try {
        const result = calculateTax({
          year: TAX_YEAR,
          taxpayer,
          income: { grossIncome: income.grossIncome, wealth: w },
          deductions,
          enableDeductions,
        });

        // Calculate rates based on gross wealth (per mille)
        const effectiveRate = w > 0 ? (result.wealthTax.totalTax / w) * 1000 : 0;

        // Rate on taxable wealth (after allowance)
        const rateOnTaxable = result.wealthTax.taxableWealth > 0
          ? (result.wealthTax.totalTax / result.wealthTax.taxableWealth) * 1000
          : 0;

        dataPoints.push({
          wealth: w,
          effectiveRate,
          baseRate: rateOnTaxable,
        });
      } catch {
        // Skip invalid calculations
      }
    }

    return dataPoints;
  }, [taxpayer, income.grossIncome, income.wealth, deductions, enableDeductions]);

  const currentWealth = income.wealth || 0;

  if (!hasWealth) {
    return null; // Don't show chart if no wealth entered
  }

  return (
    <Card
      title="Wealth Tax Rate"
      subtitle="Effective rate including cantonal & municipal multipliers (per mille ‰)"
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="wealth"
              tickFormatter={formatChartCurrency}
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <YAxis
              tickFormatter={(v) => `${v.toFixed(1)}‰`}
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
              domain={[0, 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="effectiveRate"
              name="Effective Rate (on gross)"
              stroke={TAX_COLORS.wealth}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="baseRate"
              name="Rate on Taxable"
              stroke={TAX_COLORS.cantonal}
              strokeWidth={1.5}
              dot={false}
              strokeDasharray="5 5"
            />
            {currentWealth > 0 && (
              <ReferenceLine
                x={currentWealth}
                stroke="#dc2626"
                strokeWidth={2}
                strokeDasharray="3 3"
                label={{
                  value: 'Your wealth',
                  position: 'top',
                  fill: '#dc2626',
                  fontSize: 12,
                }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Rate shown is total tax (base rate × cantonal + municipal multipliers) divided by wealth.
        Starts at 0 due to tax-free allowance, then approaches the maximum effective rate.
      </p>
    </Card>
  );
}
