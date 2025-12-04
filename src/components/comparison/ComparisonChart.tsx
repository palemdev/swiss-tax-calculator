import { useMemo } from 'react';
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
import { useTax } from '../../context/TaxContext';
import { Card } from '../common/Card';
import { formatCurrency, formatChartCurrency } from '../../utils/formatters';
import { TAX_COLORS } from '../../data/constants';

export function ComparisonChart() {
  const { comparisonResults, taxpayer } = useTax();

  // Get top 15 cheapest and add current location if not in top 15
  const chartData = useMemo(() => {
    const top15 = comparisonResults.slice(0, 15);

    const currentInTop = top15.some(
      (r) => r.canton === taxpayer.canton && r.municipality === taxpayer.municipality
    );

    if (!currentInTop) {
      const current = comparisonResults.find(
        (r) => r.canton === taxpayer.canton && r.municipality === taxpayer.municipality
      );
      if (current) {
        top15.push(current);
      }
    }

    return top15.map((r) => ({
      name: `${r.municipalityName} (${r.canton})`,
      federal: r.taxBreakdown.federalTax.taxAmount,
      cantonal: r.taxBreakdown.cantonalTax.taxAmount,
      municipal: r.taxBreakdown.municipalTax.taxAmount,
      church: r.taxBreakdown.churchTax.taxAmount,
      total: r.taxBreakdown.totalTax,
      isCurrent: r.canton === taxpayer.canton && r.municipality === taxpayer.municipality,
    }));
  }, [comparisonResults, taxpayer]);

  if (comparisonResults.length === 0) {
    return null;
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, p: any) => sum + p.value, 0);
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
          <p className="text-sm font-medium text-gray-900 mt-2 pt-2 border-t">
            Total: {formatCurrency(total)}
          </p>
        </div>
      );
    }
    return null;
  };

  const averageTax =
    comparisonResults.reduce((sum, r) => sum + r.taxBreakdown.totalTax, 0) /
    comparisonResults.length;

  return (
    <Card
      title="Tax Comparison by Location"
      subtitle="Comparing municipalities (stacked by tax type)"
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
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              x={averageTax}
              stroke="#dc2626"
              strokeDasharray="5 5"
              label={{
                value: 'Average',
                position: 'top',
                fill: '#dc2626',
                fontSize: 11,
              }}
            />
            <Bar dataKey="federal" name="Federal" stackId="a" fill={TAX_COLORS.federal}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-federal-${index}`}
                  fillOpacity={entry.isCurrent ? 1 : 0.8}
                  stroke={entry.isCurrent ? '#dc2626' : 'none'}
                  strokeWidth={entry.isCurrent ? 2 : 0}
                />
              ))}
            </Bar>
            <Bar dataKey="cantonal" name="Cantonal" stackId="a" fill={TAX_COLORS.cantonal} />
            <Bar dataKey="municipal" name="Municipal" stackId="a" fill={TAX_COLORS.municipal} />
            <Bar dataKey="church" name="Church" stackId="a" fill={TAX_COLORS.church} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: TAX_COLORS.federal }} />
          <span className="text-sm text-gray-600">Federal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: TAX_COLORS.cantonal }} />
          <span className="text-sm text-gray-600">Cantonal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: TAX_COLORS.municipal }} />
          <span className="text-sm text-gray-600">Municipal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: TAX_COLORS.church }} />
          <span className="text-sm text-gray-600">Church</span>
        </div>
      </div>
    </Card>
  );
}
