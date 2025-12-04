
import { useTax } from '../../context/TaxContext';
import { CurrencyInput } from '../common/Input';
import { Card } from '../common/Card';

export function IncomeForm() {
  const { income, updateIncome } = useTax();

  return (
    <Card title="Income" subtitle="Your annual gross income">
      <CurrencyInput
        label="Gross Income"
        value={income.grossIncome}
        onChange={(value) => updateIncome({ grossIncome: value })}
        tooltip="Your total annual gross income (before deductions)"
      />
    </Card>
  );
}
