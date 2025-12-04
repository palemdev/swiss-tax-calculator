
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTax } from '../../context/TaxContext';
import { Card } from '../common/Card';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { TAX_COLORS } from '../../data/constants';

export function TaxDistributionPie() {
  const { results, taxpayer } = useTax();

  if (!results || results.totalTax === 0) {
    return (
      <Card title="Tax Distribution">
        <div className="h-64 flex items-center justify-center text-gray-500">
          No tax data to display
        </div>
      </Card>
    );
  }

  const showChurchTax = taxpayer.religion !== 'none' && taxpayer.religion !== 'other';

  const data = [
    {
      name: 'Federal',
      value: results.federalTax.taxAmount,
      color: TAX_COLORS.federal,
    },
    {
      name: 'Cantonal',
      value: results.cantonalTax.taxAmount,
      color: TAX_COLORS.cantonal,
    },
    {
      name: 'Municipal',
      value: results.municipalTax.taxAmount,
      color: TAX_COLORS.municipal,
    },
  ];

  if (showChurchTax && results.churchTax.taxAmount > 0) {
    data.push({
      name: 'Church',
      value: results.churchTax.taxAmount,
      color: TAX_COLORS.church,
    });
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload;
      const percentage = (value / results.totalTax) * 100;
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
          <p className="font-medium text-gray-900">{name} Tax</p>
          <p className="text-gray-600">{formatCurrency(value)}</p>
          <p className="text-sm text-gray-500">{formatPercentage(percentage)} of total</p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <li key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card title="Tax Distribution" subtitle="How your tax is split">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center mt-2">
        <span className="text-2xl font-bold text-gray-900">
          {formatCurrency(results.totalTax)}
        </span>
        <span className="text-gray-500 ml-2">total tax</span>
      </div>
    </Card>
  );
}
