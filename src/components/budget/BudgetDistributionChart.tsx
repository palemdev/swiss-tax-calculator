import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useBudget } from '../../context/BudgetContext';
import { Card } from '../common/Card';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { BUDGET_COLORS } from '../../types/budget';

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartDataItem }>;
  total: number;
}

function CustomTooltip({ active, payload, total }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;
    const percentage = (value / total) * 100;
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
        <p className="font-medium text-gray-900">{name}</p>
        <p className="text-gray-600">{formatCurrency(value)}/mo</p>
        <p className="text-sm text-gray-500">{formatPercentage(percentage)} of income</p>
      </div>
    );
  }
  return null;
}

interface LegendEntry {
  value?: string;
  color?: string;
}

interface LegendPropsCustom {
  payload?: readonly LegendEntry[];
}

function renderLegend(props: LegendPropsCustom) {
  const { payload } = props;
  if (!payload) return null;
  return (
    <ul className="flex flex-wrap justify-center gap-3 mt-4">
      {payload.map((entry, index: number) => (
        <li key={`legend-${index}`} className="flex items-center gap-1.5">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-gray-600">{entry.value}</span>
        </li>
      ))}
    </ul>
  );
}

export function BudgetDistributionChart() {
  const { results } = useBudget();

  if (!results || results.monthlyExpenses === 0) {
    return (
      <Card title="Budget Distribution">
        <div className="h-64 flex items-center justify-center text-gray-500">
          No budget data to display
        </div>
      </Card>
    );
  }

  const { categories, monthlyDisposableIncome } = results;

  // Build data array with only categories that have values
  const data: ChartDataItem[] = [
    { name: 'Housing', value: categories.housing.total, color: BUDGET_COLORS.housing },
    { name: 'Healthcare', value: categories.healthcare.total, color: BUDGET_COLORS.healthcare },
    { name: 'Children', value: categories.children.total, color: BUDGET_COLORS.children },
    { name: 'Transport', value: categories.transportation.total, color: BUDGET_COLORS.transportation },
    { name: 'Food', value: categories.food.total, color: BUDGET_COLORS.food },
    { name: 'Telecom', value: categories.telecommunications.total, color: BUDGET_COLORS.telecommunications },
    { name: 'Insurance', value: categories.insurance.total, color: BUDGET_COLORS.insurance },
    { name: 'Personal', value: categories.personal.total, color: BUDGET_COLORS.personal },
    { name: 'Savings', value: categories.savings.total, color: BUDGET_COLORS.savings },
    { name: 'Other', value: categories.other.total, color: BUDGET_COLORS.other },
  ].filter(item => item.value > 0);

  // Add disposable income if positive
  if (monthlyDisposableIncome > 0) {
    data.push({
      name: 'Remaining',
      value: monthlyDisposableIncome,
      color: BUDGET_COLORS.disposable,
    });
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card title="Budget Distribution" subtitle="How your income is allocated">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={1}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip total={total} />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center mt-2">
        <span className="text-2xl font-bold text-gray-900">
          {formatCurrency(results.monthlyExpenses)}
        </span>
        <span className="text-gray-500 ml-2">/ month</span>
      </div>
    </Card>
  );
}
