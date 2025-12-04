// Currency formatting for Swiss Francs
export function formatCurrency(value: number, showDecimals: boolean = false): string {
  const formatter = new Intl.NumberFormat('de-CH', {
    style: 'decimal',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });

  return `CHF ${formatter.format(value)}`;
}

// Format percentage
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// Format number with thousands separator
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('de-CH').format(value);
}

// Parse currency input (removes formatting)
export function parseCurrencyInput(value: string): number {
  // Remove all non-numeric characters except decimal point and minus
  const cleaned = value.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

// Format for chart labels
export function formatChartCurrency(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k`;
  }
  return value.toString();
}

// Format canton name
export function formatCantonName(code: string, name: string): string {
  return `${name} (${code})`;
}
