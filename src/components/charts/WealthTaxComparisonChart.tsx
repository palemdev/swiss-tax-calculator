import { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Plus, X } from 'lucide-react';
import { useTax } from '../../context/TaxContext';
import { Card } from '../common/Card';
import { formatCurrency, formatChartCurrency } from '../../utils/formatters';
import { calculateTax } from '../../services/taxCalculator';
import { TAX_YEAR } from '../../data/constants';
import { cantonList, getMunicipalitiesByCantonCode, getMunicipalityById } from '../../data/cantons';

// Colors for comparison lines
const LINE_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
];

interface SelectedLocation {
  cantonCode: string;
  municipalityId: string;
}

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
    // Sort by value to show cheapest first
    const sorted = [...payload].sort((a, b) => a.value - b.value);
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200 max-w-xs">
        <p className="font-medium text-gray-900 mb-2">
          Wealth: {formatCurrency(label ?? 0)}
        </p>
        {sorted.map((entry, index: number) => (
          <p key={index} className="text-sm flex justify-between gap-4" style={{ color: entry.color }}>
            <span>{entry.name}:</span>
            <span className="font-medium">{formatCurrency(entry.value)}</span>
          </p>
        ))}
        {sorted.length >= 2 && (
          <p className="text-xs text-gray-500 mt-2 pt-2 border-t">
            Difference: {formatCurrency(sorted[sorted.length - 1].value - sorted[0].value)}
          </p>
        )}
      </div>
    );
  }
  return null;
}

export function WealthTaxComparisonChart() {
  const { taxpayer, income, deductions, enableDeductions } = useTax();

  // State for selected locations to compare
  const [selectedLocations, setSelectedLocations] = useState<SelectedLocation[]>([
    { cantonCode: 'ZG', municipalityId: 'zg-zug' },
    { cantonCode: 'SZ', municipalityId: 'sz-arth' },
  ]);

  // State for adding new location
  const [newCanton, setNewCanton] = useState('');
  const [newMunicipality, setNewMunicipality] = useState('');

  const availableMunicipalities = newCanton ? getMunicipalitiesByCantonCode(newCanton) : [];

  const addLocation = () => {
    if (newCanton && newMunicipality && selectedLocations.length < 6) {
      // Check if already added
      const exists = selectedLocations.some(
        (loc) => loc.cantonCode === newCanton && loc.municipalityId === newMunicipality
      );
      if (!exists) {
        setSelectedLocations([...selectedLocations, { cantonCode: newCanton, municipalityId: newMunicipality }]);
      }
      setNewCanton('');
      setNewMunicipality('');
    }
  };

  const removeLocation = (index: number) => {
    if (selectedLocations.length > 1) {
      setSelectedLocations(selectedLocations.filter((_, i) => i !== index));
    }
  };

  // Generate data points for all selected locations
  const chartData = useMemo(() => {
    const dataPoints: Record<string, number>[] = [];
    const maxWealth = Math.max(3000000, (income.wealth || 1000000) * 2);
    const step = maxWealth / 50;

    for (let w = 0; w <= maxWealth; w += step) {
      const point: Record<string, number> = { wealth: w };

      for (const loc of selectedLocations) {
        try {
          const result = calculateTax({
            year: TAX_YEAR,
            taxpayer: { ...taxpayer, canton: loc.cantonCode, municipality: loc.municipalityId },
            income: { grossIncome: income.grossIncome, wealth: w },
            deductions,
            enableDeductions,
          });
          const municipality = getMunicipalityById(loc.municipalityId);
          const key = `${municipality?.name || loc.municipalityId} (${loc.cantonCode})`;
          point[key] = result.wealthTax.totalTax;
        } catch {
          // Skip
        }
      }

      dataPoints.push(point);
    }

    return dataPoints;
  }, [taxpayer, income.grossIncome, income.wealth, deductions, enableDeductions, selectedLocations]);

  // Get location names for legend
  const locationNames = selectedLocations.map((loc) => {
    const municipality = getMunicipalityById(loc.municipalityId);
    return `${municipality?.name || loc.municipalityId} (${loc.cantonCode})`;
  });

  const currentWealth = income.wealth || 0;

  return (
    <Card
      title="Wealth Tax Comparison"
      subtitle="Compare wealth tax across different municipalities"
    >
      {/* Location selector */}
      <div className="mb-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {selectedLocations.map((loc, index) => {
            const municipality = getMunicipalityById(loc.municipalityId);
            return (
              <div
                key={`${loc.cantonCode}-${loc.municipalityId}`}
                className="flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                style={{ backgroundColor: `${LINE_COLORS[index]}20`, color: LINE_COLORS[index] }}
              >
                <span className="font-medium">{municipality?.name} ({loc.cantonCode})</span>
                {selectedLocations.length > 1 && (
                  <button
                    onClick={() => removeLocation(index)}
                    className="ml-1 hover:opacity-70"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {selectedLocations.length < 6 && (
          <div className="flex gap-2 items-center flex-wrap">
            <select
              value={newCanton}
              onChange={(e) => {
                setNewCanton(e.target.value);
                setNewMunicipality('');
              }}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select canton...</option>
              {cantonList.map((canton) => (
                <option key={canton.code} value={canton.code}>
                  {canton.name} ({canton.code})
                </option>
              ))}
            </select>

            <select
              value={newMunicipality}
              onChange={(e) => setNewMunicipality(e.target.value)}
              disabled={!newCanton}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            >
              <option value="">Select municipality...</option>
              {availableMunicipalities.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            <button
              onClick={addLocation}
              disabled={!newCanton || !newMunicipality}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="wealth"
              tickFormatter={formatChartCurrency}
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <YAxis
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toString()}
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {locationNames.map((name, index) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                name={name}
                stroke={LINE_COLORS[index]}
                strokeWidth={2}
                dot={false}
              />
            ))}
            {currentWealth > 0 && (
              <ReferenceLine
                x={currentWealth}
                stroke="#6b7280"
                strokeWidth={2}
                strokeDasharray="3 3"
                label={{
                  value: 'Your wealth',
                  position: 'top',
                  fill: '#6b7280',
                  fontSize: 11,
                }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        Shows total wealth tax (cantonal + municipal) at different wealth levels.
        Add up to 6 locations to compare. Hover over the chart to see exact values.
      </p>
    </Card>
  );
}
