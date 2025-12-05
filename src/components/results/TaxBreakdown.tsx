
import { useTax } from '../../context/TaxContext';
import { Card } from '../common/Card';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { TAX_COLORS } from '../../data/constants';

interface TaxRowProps {
  label: string;
  amount: number;
  rate?: number;
  multiplier?: number;
  color: string;
  isTotal?: boolean;
}

function TaxRow({ label, amount, rate, multiplier, color, isTotal }: TaxRowProps) {
  return (
    <div
      className={`flex items-center justify-between py-3 ${
        isTotal ? 'border-t-2 border-gray-200 mt-2 pt-4 font-semibold' : 'border-b border-gray-100'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        <span className={isTotal ? 'text-gray-900' : 'text-gray-700'}>{label}</span>
        {multiplier !== undefined && multiplier !== 100 && (
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
            {multiplier}%
          </span>
        )}
      </div>
      <div className="text-right">
        <span className={`font-medium ${isTotal ? 'text-lg' : ''}`}>
          {formatCurrency(amount, true)}
        </span>
        {rate !== undefined && (
          <span className="text-xs text-gray-500 ml-2">({formatPercentage(rate)})</span>
        )}
      </div>
    </div>
  );
}

export function TaxBreakdown() {
  const { results, taxpayer, enableDeductions } = useTax();

  if (!results) {
    return (
      <Card title="Tax Breakdown">
        <p className="text-gray-500 text-center py-8">
          Enter your income details to see the tax breakdown
        </p>
      </Card>
    );
  }

  const showChurchTax = taxpayer.religion !== 'none' && taxpayer.religion !== 'other';
  const showWealthTax = results.wealthTax.grossWealth > 0;

  return (
    <Card title="Tax Breakdown" subtitle="Detailed tax by level">
      <div className="mb-4 pb-4 border-b border-gray-200">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Gross Income</span>
          <span className="font-medium">{formatCurrency(results.grossIncome, true)}</span>
        </div>
        {enableDeductions && (
          <>
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>Federal Deductions</span>
              <span className="font-medium text-green-600">-{formatCurrency(results.totalDeductionsFederal, true)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-900 mt-2 pt-2 border-t border-gray-100">
              <span>Federal Taxable Income</span>
              <span>{formatCurrency(results.taxableIncomeFederal, true)}</span>
            </div>
            {results.taxableIncomeCantonal !== results.taxableIncomeFederal && (
              <>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>Cantonal Deductions</span>
                  <span className="font-medium text-green-600">-{formatCurrency(results.totalDeductions, true)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-900 mt-1">
                  <span>Cantonal Taxable Income</span>
                  <span>{formatCurrency(results.taxableIncomeCantonal, true)}</span>
                </div>
              </>
            )}
          </>
        )}
        {showWealthTax && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Net Wealth</span>
              <span className="font-medium">{formatCurrency(results.wealthTax.grossWealth, true)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>Wealth Allowance</span>
              <span className="font-medium text-green-600">-{formatCurrency(results.wealthTax.allowance, true)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-900 mt-1">
              <span>Taxable Wealth</span>
              <span>{formatCurrency(results.wealthTax.taxableWealth, true)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Income Tax</div>
      <TaxRow
        label="Federal Tax"
        amount={results.federalTax.taxAmount}
        rate={results.federalTax.effectiveRate}
        color={TAX_COLORS.federal}
      />
      <TaxRow
        label="Cantonal Tax"
        amount={results.cantonalTax.taxAmount}
        rate={results.cantonalTax.effectiveRate}
        multiplier={results.cantonalTax.multiplier}
        color={TAX_COLORS.cantonal}
      />
      <TaxRow
        label="Municipal Tax"
        amount={results.municipalTax.taxAmount}
        rate={results.municipalTax.effectiveRate}
        multiplier={results.municipalTax.multiplier}
        color={TAX_COLORS.municipal}
      />
      {showChurchTax && (
        <TaxRow
          label="Church Tax"
          amount={results.churchTax.taxAmount}
          rate={results.churchTax.effectiveRate}
          multiplier={results.churchTax.multiplier}
          color={TAX_COLORS.church}
        />
      )}

      {showWealthTax && (
        <>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-4 mb-2">Wealth Tax</div>
          <TaxRow
            label="Wealth Tax"
            amount={results.wealthTax.totalTax}
            rate={results.wealthTax.effectiveRate}
            color={TAX_COLORS.wealth}
          />
        </>
      )}

      <TaxRow
        label="Total Tax"
        amount={results.totalTax}
        rate={results.effectiveRate}
        color="#111827"
        isTotal
      />
    </Card>
  );
}
