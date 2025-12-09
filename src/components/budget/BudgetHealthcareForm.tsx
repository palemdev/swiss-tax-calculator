import { Heart } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { useTax } from '../../context/TaxContext';
import { Card } from '../common/Card';
import { Select } from '../common/Select';
import { CurrencyInput } from '../common/Input';
import { Toggle } from '../common/Toggle';
import { getHealthInsurancePremium } from '../../data/costOfLiving';
import { formatCurrency } from '../../utils/formatters';

const INSURANCE_MODEL_OPTIONS = [
  { value: 'standard', label: 'Standard (CHF 300 deductible)' },
  { value: 'highDeductible', label: 'High deductible (CHF 2,500)' },
];

export function BudgetHealthcareForm() {
  const { inputs, updateInputs } = useBudget();
  const { taxpayer } = useTax();

  const estimatedPremium = getHealthInsurancePremium(
    taxpayer.canton,
    inputs.healthInsuranceModel
  );

  const childPremium = taxpayer.numberOfChildren > 0
    ? getHealthInsurancePremium(taxpayer.canton, 'standard', true)
    : 0;

  const useCustomInsurance =
    inputs.customHealthInsurance !== undefined && inputs.customHealthInsurance > 0;

  return (
    <Card
      title="Healthcare"
      subtitle="Health insurance premiums"
      headerAction={<Heart className="w-5 h-5 text-orange-500" />}
    >
      <div className="space-y-4">
        <Select
          label="Insurance model"
          value={inputs.healthInsuranceModel}
          onChange={(value) =>
            updateInputs({
              healthInsuranceModel: value as 'standard' | 'highDeductible',
            })
          }
          options={INSURANCE_MODEL_OPTIONS}
          tooltip="Higher deductible = lower monthly premium but more out-of-pocket costs if you need care"
        />

        {estimatedPremium && !useCustomInsurance && (
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
            <p className="text-sm text-orange-700">
              Estimated premium for {taxpayer.canton}:{' '}
              <span className="font-semibold">{formatCurrency(estimatedPremium)}/mo</span>
            </p>
            {taxpayer.numberOfChildren > 0 && childPremium && (
              <p className="text-xs text-orange-600 mt-1">
                + {formatCurrency(childPremium)}/mo per child (
                {taxpayer.numberOfChildren} child
                {taxpayer.numberOfChildren > 1 ? 'ren' : ''})
              </p>
            )}
          </div>
        )}

        <Toggle
          label="Use custom premium amount"
          checked={useCustomInsurance}
          onChange={(checked) => {
            if (!checked) {
              updateInputs({ customHealthInsurance: undefined });
            } else {
              updateInputs({ customHealthInsurance: estimatedPremium || 400 });
            }
          }}
          description="Override with your actual health insurance premium"
        />

        {useCustomInsurance && (
          <CurrencyInput
            label="Monthly premium (adults)"
            value={inputs.customHealthInsurance || 0}
            onChange={(value) => updateInputs({ customHealthInsurance: value })}
            tooltip="Your actual monthly health insurance premium"
          />
        )}
      </div>
    </Card>
  );
}
