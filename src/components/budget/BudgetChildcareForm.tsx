import { Baby } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { useTax } from '../../context/TaxContext';
import { Card } from '../common/Card';
import { Select } from '../common/Select';
import { CurrencyInput, NumberInput } from '../common/Input';
import { Toggle } from '../common/Toggle';
import { getChildcareCost } from '../../data/costOfLiving';
import { formatCurrency } from '../../utils/formatters';

const CHILDCARE_TYPE_OPTIONS = [
  { value: 'none', label: 'No childcare needed' },
  { value: 'fullTime', label: 'Full-time daycare (5 days)' },
  { value: 'partTime', label: 'Part-time daycare (2-3 days)' },
  { value: 'afterSchool', label: 'After-school care' },
];

export function BudgetChildcareForm() {
  const { inputs, updateInputs } = useBudget();
  const { taxpayer } = useTax();

  // Only show if there are children
  if (taxpayer.numberOfChildren === 0) {
    return null;
  }

  const estimatedCost =
    inputs.childcareType !== 'none'
      ? getChildcareCost(
          taxpayer.canton,
          inputs.childcareType === 'afterSchool' ? 'afterSchool' : inputs.childcareType
        )
      : 0;

  const useCustomChildcare =
    inputs.customChildcare !== undefined && inputs.customChildcare > 0;

  return (
    <Card
      title="Childcare"
      subtitle={`For ${taxpayer.numberOfChildren} child${taxpayer.numberOfChildren > 1 ? 'ren' : ''}`}
      headerAction={<Baby className="w-5 h-5 text-yellow-500" />}
    >
      <div className="space-y-4">
        <Select
          label="Childcare type"
          value={inputs.childcareType}
          onChange={(value) =>
            updateInputs({
              childcareType: value as 'none' | 'fullTime' | 'partTime' | 'afterSchool',
            })
          }
          options={CHILDCARE_TYPE_OPTIONS}
          tooltip="Select the type of childcare you use"
        />

        {inputs.childcareType !== 'none' && (
          <>
            <NumberInput
              label="Children in childcare"
              value={inputs.childrenInDaycare}
              onChange={(value) => updateInputs({ childrenInDaycare: value })}
              min={0}
              max={taxpayer.numberOfChildren}
              tooltip="Number of children currently in childcare"
            />

            {estimatedCost && !useCustomChildcare && inputs.childrenInDaycare > 0 && (
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                <p className="text-sm text-yellow-700">
                  Estimated cost for {taxpayer.canton}:{' '}
                  <span className="font-semibold">
                    {formatCurrency(estimatedCost)}/mo per child
                  </span>
                </p>
                {inputs.childrenInDaycare > 1 && (
                  <p className="text-xs text-yellow-600 mt-1">
                    Total: {formatCurrency(estimatedCost * inputs.childrenInDaycare)}/mo
                    (some daycares offer sibling discounts)
                  </p>
                )}
              </div>
            )}

            <Toggle
              label="Use custom childcare cost"
              checked={useCustomChildcare}
              onChange={(checked) => {
                if (!checked) {
                  updateInputs({ customChildcare: undefined });
                } else {
                  updateInputs({ customChildcare: estimatedCost || 1500 });
                }
              }}
              description="Override with your actual childcare costs"
            />

            {useCustomChildcare && (
              <CurrencyInput
                label="Monthly childcare (per child)"
                value={inputs.customChildcare || 0}
                onChange={(value) => updateInputs({ customChildcare: value })}
                tooltip="Your actual monthly childcare cost per child"
              />
            )}
          </>
        )}
      </div>
    </Card>
  );
}
