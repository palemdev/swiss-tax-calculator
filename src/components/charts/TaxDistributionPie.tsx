import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTax } from '../../context/TaxContext';
import { Card } from '../common/Card';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { TAX_COLORS } from '../../data/constants';

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartDataItem }>;
  totalTax: number;
}

function CustomTooltip({ active, payload, totalTax }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;
    const percentage = (value / totalTax) * 100;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="font-medium text-gray-900 dark:text-gray-100">{name} Tax</p>
        <p className="text-gray-600 dark:text-gray-300">{formatCurrency(value)}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{formatPercentage(percentage)} of total</p>
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
    <ul className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry, index: number) => (
        <li key={`legend-${index}`} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">{entry.value}</span>
        </li>
      ))}
    </ul>
  );
}

export function TaxDistributionPie() {
  const { results, taxpayer } = useTax();

  if (!results || results.totalTax === 0) {
    return (
      <Card title="Tax Distribution">
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          No tax data to display
        </div>
      </Card>
    );
  }

  const showChurchTax = taxpayer.religion !== 'none' && taxpayer.religion !== 'other';

  const data: ChartDataItem[] = [
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
            <Tooltip content={<CustomTooltip totalTax={results.totalTax} />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center mt-2">
        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {formatCurrency(results.totalTax)}
        </span>
        <span className="text-gray-500 dark:text-gray-400 ml-2">total tax</span>
      </div>
    </Card>
  );
}
