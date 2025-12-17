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
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
        <p className="font-medium text-gray-900">
          Income: {formatCurrency(label ?? 0)}
        </p>
        {payload.map((entry, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {formatPercentage(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function MarginalRateChart() {
  const { results, taxpayer, deductions, enableDeductions } = useTax();

  const employmentStatus = taxpayer.employmentStatus ?? 'employed';
  const isSelfEmployed = employmentStatus === 'self-employed';
  const isMixed = employmentStatus === 'mixed';

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
        // Build income object based on employment status
        const incomeForCalc = isSelfEmployed
          ? {
              grossIncome: 0,
              wealth: 0,
              selfEmployedIncome: { netBusinessIncome: inc },
            }
          : isMixed
          ? {
              grossIncome: inc / 2, // Split evenly for mixed
              wealth: 0,
              selfEmployedIncome: { netBusinessIncome: inc / 2 },
            }
          : {
              grossIncome: inc,
              wealth: 0,
            };

        const result = calculateTax({
          year: TAX_YEAR,
          taxpayer,
          income: incomeForCalc,
          deductions,
          enableDeductions,
        });

        // Calculate income-only effective rate (exclude wealth tax but include social contributions)
        const totalIncomeCosts = result.totalIncomeTax + result.socialContributions.total;
        const incomeEffectiveRate = inc > 0 ? (totalIncomeCosts / inc) * 100 : 0;

        dataPoints.push({
          income: inc,
          effectiveRate: incomeEffectiveRate,
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
  }, [taxpayer, deductions, enableDeductions, results, isSelfEmployed, isMixed]);

  const currentIncome = results?.grossIncome || 0;

  return (
    <Card
      title="Income Tax Rate"
      subtitle="How income tax rates change with income (excludes wealth tax)"
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
