
import { useTax } from '../../context/TaxContext';
import { CurrencyInput } from '../common/Input';
import { Card } from '../common/Card';

export function IncomeForm() {
  const { income, updateIncome } = useTax();

  return (
    <Card title="Income & Wealth" subtitle="Your annual income and net wealth">
      <div className="space-y-4">
        <CurrencyInput
          label="Gross Income"
          value={income.grossIncome}
          onChange={(value) => updateIncome({ grossIncome: value })}
          tooltip="Your total annual gross income (before deductions)"
        />
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
