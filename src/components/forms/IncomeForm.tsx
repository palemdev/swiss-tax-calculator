
import { useTax } from '../../context/TaxContext';
import { CurrencyInput } from '../common/Input';
import { Card } from '../common/Card';

export function IncomeForm() {
  const { income, updateIncome, taxpayer } = useTax();
  const isMarried = taxpayer.civilStatus === 'married';

  return (
    <Card title="Income" subtitle="Your annual gross income">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <CurrencyInput
          label="Primary Employment Income"
          value={income.primaryIncome}
          onChange={(value) => updateIncome({ primaryIncome: value })}
          tooltip="Your main employment gross salary (before deductions)"
        />

        {isMarried && (
          <CurrencyInput
            label="Spouse's Employment Income"
            value={income.secondaryIncome}
            onChange={(value) => updateIncome({ secondaryIncome: value })}
            tooltip="Your spouse's gross employment income"
          />
        )}

        <CurrencyInput
          label="Self-Employment Income"
          value={income.selfEmploymentIncome}
          onChange={(value) => updateIncome({ selfEmploymentIncome: value })}
          tooltip="Net income from self-employment activities"
        />

        <CurrencyInput
          label="Investment Income"
          value={income.investmentIncome}
          onChange={(value) => updateIncome({ investmentIncome: value })}
          tooltip="Dividends, interest, and capital gains"
        />

        <CurrencyInput
          label="Rental Income"
          value={income.rentalIncome}
          onChange={(value) => updateIncome({ rentalIncome: value })}
          tooltip="Net income from renting property"
        />

        <CurrencyInput
          label="Other Income"
          value={income.otherIncome}
          onChange={(value) => updateIncome({ otherIncome: value })}
          tooltip="Pensions, alimony received, other taxable income"
        />
      </div>
    </Card>
  );
}
