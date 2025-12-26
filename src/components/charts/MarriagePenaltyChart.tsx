import { useMemo, useState } from 'react';
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
  Area,
  ComposedChart,
} from 'recharts';
import { Card } from '../common/Card';
import { formatCurrency, formatChartCurrency } from '../../utils/formatters';
import { calculateFederalTax } from '../../services/taxCalculator';

interface ChartDataPoint {
  income: number;
  singleTax: number;
  marriedTax: number;
  penalty: number;
  penaltyPercent: number;
}

type IncomeDistribution = '50-50' | '70-30' | '100-0';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartDataPoint }>;
  label?: number;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isPenalty = data.penalty > 0;
    const isBonus = data.penalty < 0;

    return (
      <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 min-w-[200px]">
        <p className="font-medium text-gray-900 dark:text-gray-100 border-b dark:border-gray-700 pb-2 mb-2">
          Household income: {formatCurrency(label ?? 0)}
        </p>
        <div className="space-y-1 text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
            2 Singles: {formatCurrency(data.singleTax)}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
            Married: {formatCurrency(data.marriedTax)}
          </p>
          <div className="border-t dark:border-gray-700 pt-2 mt-2">
            {isPenalty && (
              <p className="text-red-600 dark:text-red-400 font-medium">
                Marriage penalty: +{formatCurrency(data.penalty)}
                <span className="text-xs ml-1">({data.penaltyPercent.toFixed(1)}% more)</span>
              </p>
            )}
            {isBonus && (
              <p className="text-green-600 dark:text-green-400 font-medium">
                Marriage bonus: {formatCurrency(data.penalty)}
                <span className="text-xs ml-1">({Math.abs(data.penaltyPercent).toFixed(1)}% less)</span>
              </p>
            )}
            {!isPenalty && !isBonus && (
              <p className="text-gray-500 dark:text-gray-400 font-medium">No difference</p>
            )}
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export function MarriagePenaltyChart() {
  const [distribution, setDistribution] = useState<IncomeDistribution>('50-50');

  const chartData = useMemo(() => {
    const dataPoints: ChartDataPoint[] = [];
    const maxIncome = 500000;
    const step = 5000;

    for (let totalIncome = 0; totalIncome <= maxIncome; totalIncome += step) {
      // Calculate individual incomes based on distribution
      let income1: number, income2: number;
      switch (distribution) {
        case '50-50':
          income1 = totalIncome / 2;
          income2 = totalIncome / 2;
          break;
        case '70-30':
          income1 = totalIncome * 0.7;
          income2 = totalIncome * 0.3;
          break;
        case '100-0':
          income1 = totalIncome;
          income2 = 0;
          break;
      }

      // Calculate tax for two singles
      const single1Tax = calculateFederalTax(income1, false, 0).taxAmount;
      const single2Tax = calculateFederalTax(income2, false, 0).taxAmount;
      const totalSingleTax = single1Tax + single2Tax;

      // Calculate tax for married couple (combined income)
      const marriedTax = calculateFederalTax(totalIncome, true, 0).taxAmount;

      // Marriage penalty = married tax - single tax (positive = penalty, negative = bonus)
      const penalty = marriedTax - totalSingleTax;
      const penaltyPercent = totalSingleTax > 0 ? (penalty / totalSingleTax) * 100 : 0;

      dataPoints.push({
        income: totalIncome,
        singleTax: totalSingleTax,
        marriedTax: marriedTax,
        penalty: penalty,
        penaltyPercent: penaltyPercent,
      });
    }

    return dataPoints;
  }, [distribution]);

  // Find the crossover point and max penalty
  const stats = useMemo(() => {
    let maxPenalty = 0;
    let maxPenaltyIncome = 0;
    let maxBonus = 0;
    let maxBonusIncome = 0;
    let crossoverIncome = 0;

    for (const point of chartData) {
      if (point.penalty > maxPenalty) {
        maxPenalty = point.penalty;
        maxPenaltyIncome = point.income;
      }
      if (point.penalty < maxBonus) {
        maxBonus = point.penalty;
        maxBonusIncome = point.income;
      }
      if (point.penalty > 0 && crossoverIncome === 0) {
        crossoverIncome = point.income;
      }
    }

    return { maxPenalty, maxPenaltyIncome, maxBonus, maxBonusIncome, crossoverIncome };
  }, [chartData]);

  return (
    <Card
      title="Marriage Penalty (Federal Tax)"
      subtitle="Comparison: 2 singles vs. married couple with the same household income"
    >
      {/* Distribution selector */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400 self-center mr-2">Income distribution:</span>
        {(['50-50', '70-30', '100-0'] as IncomeDistribution[]).map((dist) => (
          <button
            key={dist}
            onClick={() => setDistribution(dist)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              distribution === dist
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {dist}
          </button>
        ))}
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {stats.maxBonus < 0 && (
          <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3">
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">Max. marriage bonus</p>
            <p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(Math.abs(stats.maxBonus))}</p>
            <p className="text-xs text-green-600 dark:text-green-400">at {formatCurrency(stats.maxBonusIncome)}</p>
          </div>
        )}
        {stats.maxPenalty > 0 && (
          <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-3">
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">Max. marriage penalty</p>
            <p className="text-lg font-bold text-red-700 dark:text-red-400">{formatCurrency(stats.maxPenalty)}</p>
            <p className="text-xs text-red-600 dark:text-red-400">at {formatCurrency(stats.maxPenaltyIncome)}</p>
          </div>
        )}
      </div>

      {/* Tax comparison chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="income"
              tickFormatter={formatChartCurrency}
              tick={{ fontSize: 11 }}
              stroke="#9ca3af"
            />
            <YAxis
              tickFormatter={formatChartCurrency}
              tick={{ fontSize: 11 }}
              stroke="#9ca3af"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="singleTax"
              name="2 Singles"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="marriedTax"
              name="Married"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Penalty/Bonus chart */}
      <div className="border-t dark:border-gray-700 pt-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Difference (Penalty / Bonus)</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="income"
                tickFormatter={formatChartCurrency}
                tick={{ fontSize: 11 }}
                stroke="#9ca3af"
              />
              <YAxis
                tickFormatter={(v) => `${v >= 0 ? '+' : ''}${formatChartCurrency(v)}`}
                tick={{ fontSize: 11 }}
                stroke="#9ca3af"
              />
              <Tooltip
                formatter={(value: number) => [
                  `${value >= 0 ? '+' : ''}${formatCurrency(value)}`,
                  value >= 0 ? 'Penalty' : 'Bonus'
                ]}
                labelFormatter={(label) => `Income: ${formatCurrency(label)}`}
              />
              <ReferenceLine y={0} stroke="#6b7280" strokeWidth={1} />
              <defs>
                <linearGradient id="penaltyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="50%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="bonusGradient" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="50%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="penalty"
                fill="url(#penaltyGradient)"
                stroke="none"
              />
              <Line
                type="monotone"
                dataKey="penalty"
                name="Difference"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <strong>Marriage penalty:</strong> Married couples pay more federal tax than two singles with the same total income.
          This occurs especially when both partners have similar incomes (dual earners).
          With unequal distribution (e.g., single earner), married couples often benefit from the more favorable tariff.
        </p>
      </div>
    </Card>
  );
}
