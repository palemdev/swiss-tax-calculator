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
  Legend,
} from 'recharts';
import { useTax } from '../../context/TaxContext';
import { Card } from '../common/Card';
import { formatCurrency, formatPercentage, formatChartCurrency } from '../../utils/formatters';
import { TAX_COLORS } from '../../data/constants';
import { calculateTax } from '../../services/taxCalculator';
import { TAX_YEAR } from '../../data/constants';

export function MarginalRateChart() {
  const { results, taxpayer, income, deductions, enableDeductions } = useTax();

  // Generate data points for the chart
  const chartData = useMemo(() => {
    const dataPoints: {
      income: number;
      effectiveRate: number;
      federalRate: number;
      cantonalRate: number;
    }[] = [];

    const maxIncome = Math.max(500000, (results?.grossIncome || 100000) * 1.5);
    const step = maxIncome / 50;

    for (let inc = 0; inc <= maxIncome; inc += step) {
      try {
        const result = calculateTax({
          year: TAX_YEAR,
          taxpayer,
          income: { grossIncome: inc },
          deductions,
          enableDeductions,
        });

        dataPoints.push({
          income: inc,
          effectiveRate: result.effectiveRate,
          federalRate: result.federalTax.effectiveRate,
          cantonalRate:
            result.cantonalTax.effectiveRate +
            result.municipalTax.effectiveRate +
            result.churchTax.effectiveRate,
        });
      } catch {
        // Skip invalid calculations
      }
    }

    return dataPoints;
  }, [taxpayer, income, deductions, enableDeductions, results]);

  const currentIncome = results?.grossIncome || 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
          <p className="font-medium text-gray-900">
            Income: {formatCurrency(label)}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatPercentage(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      title="Tax Rate by Income"
      subtitle="How tax rates change with income"
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="income"
              tickFormatter={formatChartCurrency}
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <YAxis
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
              domain={[0, 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="effectiveRate"
              name="Total Rate"
              stroke="#111827"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="federalRate"
              name="Federal"
              stroke={TAX_COLORS.federal}
              strokeWidth={1.5}
              dot={false}
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="cantonalRate"
              name="Canton + Municipal"
              stroke={TAX_COLORS.cantonal}
              strokeWidth={1.5}
              dot={false}
              strokeDasharray="5 5"
            />
            {currentIncome > 0 && (
              <ReferenceLine
                x={currentIncome}
                stroke="#dc2626"
                strokeWidth={2}
                strokeDasharray="3 3"
                label={{
                  value: 'Your income',
                  position: 'top',
                  fill: '#dc2626',
                  fontSize: 12,
                }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
