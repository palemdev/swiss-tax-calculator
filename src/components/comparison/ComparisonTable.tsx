import { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, MapPin, Info } from 'lucide-react';
import { useTax } from '../../context/TaxContext';
import { Card } from '../common/Card';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

type SortKey = 'ranking' | 'municipality' | 'canton' | 'totalTax' | 'effectiveRate';
type SortDirection = 'asc' | 'desc';

interface SortHeaderProps {
  label: string;
  sortKeyName: SortKey;
  currentSortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (key: SortKey) => void;
}

function SortHeader({ label, sortKeyName, currentSortKey, sortDirection, onSort }: SortHeaderProps) {
  return (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
      onClick={() => onSort(sortKeyName)}
    >
      <div className="flex items-center gap-1">
        {label}
        {currentSortKey === sortKeyName ? (
          sortDirection === 'asc' ? (
            <ArrowUp className="w-3 h-3" />
          ) : (
            <ArrowDown className="w-3 h-3" />
          )
        ) : (
          <ArrowUpDown className="w-3 h-3 text-gray-300" />
        )}
      </div>
    </th>
  );
}

export function ComparisonTable() {
  const { comparisonResults, taxpayer, updateTaxpayer, results } = useTax();
  const [sortKey, setSortKey] = useState<SortKey>('ranking');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filter, setFilter] = useState('');

  const isSelfEmployed = taxpayer.employmentStatus === 'self-employed' || taxpayer.employmentStatus === 'mixed';
  const socialContributions = results?.socialContributions.total ?? 0;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedResults = useMemo(() => {
    const filterLower = filter.toLowerCase();
    const filtered = comparisonResults.filter(
      (r) =>
        r.municipalityName.toLowerCase().includes(filterLower) ||
        r.cantonName.toLowerCase().includes(filterLower) ||
        r.canton.toLowerCase() === filterLower
    );

    return [...filtered].sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      switch (sortKey) {
        case 'municipality':
          aVal = a.municipalityName;
          bVal = b.municipalityName;
          break;
        case 'canton':
          aVal = a.cantonName;
          bVal = b.cantonName;
          break;
        case 'totalTax':
          aVal = a.taxBreakdown.totalTax;
          bVal = b.taxBreakdown.totalTax;
          break;
        case 'effectiveRate':
          aVal = a.taxBreakdown.effectiveRate;
          bVal = b.taxBreakdown.effectiveRate;
          break;
        default:
          aVal = a.ranking;
          bVal = b.ranking;
      }

      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal);
      }
      return sortDirection === 'asc' ? aVal - (bVal as number) : (bVal as number) - aVal;
    });
  }, [comparisonResults, sortKey, sortDirection, filter]);

  // Find the currently selected location's tax
  const currentLocationTax = useMemo(() => {
    const current = comparisonResults.find(
      (r) => r.canton === taxpayer.canton && r.municipality === taxpayer.municipality
    );
    return current?.taxBreakdown.totalTax ?? 0;
  }, [comparisonResults, taxpayer.canton, taxpayer.municipality]);

  const handleSelectLocation = (cantonCode: string, municipalityId: string) => {
    updateTaxpayer({
      canton: cantonCode,
      municipality: municipalityId,
    });
  };

  if (comparisonResults.length === 0) {
    return null;
  }

  return (
    <Card title="Tax Comparison" subtitle={`Comparing ${comparisonResults.length} locations`}>
      {isSelfEmployed && socialContributions > 0 && (
        <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg flex items-start gap-2">
          <Info className="w-5 h-5 text-orange-500 dark:text-orange-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">Note:</span> Social contributions (AHV/IV/EO) of{' '}
            <span className="font-medium">{formatCurrency(socialContributions)}</span> are the same
            regardless of location. The comparison below shows only location-dependent taxes.
          </div>
        </div>
      )}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by municipality or canton..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <SortHeader label="Rank" sortKeyName="ranking" currentSortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
              <SortHeader label="Municipality" sortKeyName="municipality" currentSortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
              <SortHeader label="Canton" sortKeyName="canton" currentSortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
              <SortHeader label="Total Tax" sortKeyName="totalTax" currentSortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
              <SortHeader label="Effective Rate" sortKeyName="effectiveRate" currentSortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Difference
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedResults.slice(0, 50).map((result) => {
              const isCurrentLocation =
                result.canton === taxpayer.canton && result.municipality === taxpayer.municipality;

              return (
                <tr
                  key={result.municipality}
                  className={`
                    ${isCurrentLocation ? 'bg-red-50 dark:bg-red-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}
                    transition-colors
                  `}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`
                        inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                        ${result.ranking <= 3 ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-400' : ''}
                        ${result.ranking > 3 && result.ranking <= 10 ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-400' : ''}
                        ${result.ranking > 10 ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400' : ''}
                      `}
                    >
                      {result.ranking}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {result.municipalityName}
                      </span>
                      {isCurrentLocation && (
                        <MapPin className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-400">
                    {result.cantonName} ({result.canton})
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(result.taxBreakdown.totalTax)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-400">
                    {formatPercentage(result.taxBreakdown.effectiveRate)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {(() => {
                      const diff = result.taxBreakdown.totalTax - currentLocationTax;
                      const monthlyDiff = diff / 12;
                      if (isCurrentLocation) {
                        return <span className="text-gray-500 dark:text-gray-400 font-medium">Current</span>;
                      } else if (diff < 0) {
                        return (
                          <div className="text-green-600 dark:text-green-400">
                            <div>{formatCurrency(monthlyDiff)}/mo</div>
                            <div className="text-xs">{formatCurrency(diff)}/yr</div>
                          </div>
                        );
                      } else {
                        return (
                          <div className="text-red-600 dark:text-red-400">
                            <div>+{formatCurrency(monthlyDiff)}/mo</div>
                            <div className="text-xs">+{formatCurrency(diff)}/yr</div>
                          </div>
                        );
                      }
                    })()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {!isCurrentLocation && (
                      <button
                        onClick={() => handleSelectLocation(result.canton, result.municipality)}
                        className="text-sm text-red-600 hover:text-red-800 font-medium"
                      >
                        Select
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedResults.length > 50 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
          Showing top 50 of {sortedResults.length} results
        </p>
      )}
    </Card>
  );
}
