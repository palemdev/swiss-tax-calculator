import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import { useTax } from '../../context/TaxContext';
import { Card } from '../common/Card';
import { formatCurrency, formatChartCurrency } from '../../utils/formatters';

export function IncomeBreakdownChart() {
  const { results } = useTax();

  if (!results) {
    return (
      <Card title="Income Breakdown">
        <div className="h-48 flex items-center justify-center text-gray-500">
          No data to display
        </div>
      </Card>
    );
  }

  const data = [
    {
      name: 'Gross Income',
      value: results.grossIncome,
      color: '#3b82f6',
    },
    {
      name: 'Deductions',
      value: results.totalDeductions,
      color: '#22c55e',
    },
    {
      name: 'Taxable Income',
      value: results.taxableIncomeFederal,
      color: '#8b5cf6',
    },
    {
      name: 'Total Tax',
      value: results.totalTax,
      color: '#ef4444',
    },
    {
      name: 'Social Contributions',
      value: results.socialContributions.total,
      color: '#f97316',
    },
    {
      name: 'Net Income',
      value: results.netIncome,
      color: '#10b981',
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload;
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
          <p className="font-medium text-gray-900">{name}</p>
          <p className="text-gray-600">{formatCurrency(value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card title="Income Breakdown" subtitle="From gross to net income">
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 80, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={formatChartCurrency}
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
              width={90}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                formatter={(value) => formatCurrency(Number(value))}
                style={{ fontSize: 11, fill: '#6b7280' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
