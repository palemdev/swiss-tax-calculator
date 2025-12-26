
import { useTax } from '../../context/TaxContext';
import { CurrencyInput } from '../common/Input';
import { Card } from '../common/Card';
import { getSelfEmployedAHVRate } from '../../services/selfEmployedCalculator';
import { formatCurrency } from '../../utils/formatters';

export function IncomeForm() {
  const { income, updateIncome, taxpayer } = useTax();

  const employmentStatus = taxpayer.employmentStatus ?? 'employed';
  const showEmployedIncome = employmentStatus === 'employed' || employmentStatus === 'mixed';
  const showSelfEmployedIncome = employmentStatus === 'self-employed' || employmentStatus === 'mixed';

  // Calculate self-employed AHV rate for display
  const selfEmployedNetIncome = income.selfEmployedIncome?.netBusinessIncome ?? 0;
  const selfEmployedAHVRate = getSelfEmployedAHVRate(selfEmployedNetIncome);

  return (
    <Card title="Income & Wealth" subtitle="Your annual income and net wealth">
      <div className="space-y-4">
        {showEmployedIncome && (
          <CurrencyInput
            label={employmentStatus === 'mixed' ? 'Gross Salary (Employment)' : 'Gross Income'}
            value={income.grossIncome}
            onChange={(value) => updateIncome({ grossIncome: value })}
            tooltip="Your total annual gross salary from employment (before deductions)"
          />
        )}

        {showSelfEmployedIncome && (
          <div>
            <CurrencyInput
              label="Net Business Income (Self-Employment)"
              value={selfEmployedNetIncome}
              onChange={(value) =>
                updateIncome({
                  selfEmployedIncome: { netBusinessIncome: value },
                })
              }
              tooltip="Your annual net income from self-employment after business expenses (gross revenue minus costs)"
            />
            {selfEmployedNetIncome > 0 && (
              <div className="mt-2 p-3 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg text-sm">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Self-employed AHV/IV/EO rate:</span>
                  <span className="font-medium">{selfEmployedAHVRate.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300 mt-1">
                  <span>Estimated annual AHV contribution:</span>
                  <span className="font-medium">
                    {formatCurrency(selfEmployedNetIncome * (selfEmployedAHVRate / 100))}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Self-employed pay the full AHV/IV/EO rate (no employer contribution).
                  A degressive scale applies for incomes below CHF 58,800.
                </p>
              </div>
            )}
          </div>
        )}

        <CurrencyInput
          label="Net Wealth"
          value={income.wealth}
          onChange={(value) => updateIncome({ wealth: value })}
          tooltip="Your total net wealth (assets minus liabilities) as of December 31st"
        />
      </div>
    </Card>
  );
}
