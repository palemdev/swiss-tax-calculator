import { Home, Building2 } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { useTax } from '../../context/TaxContext';
import { Card } from '../common/Card';
import { Select } from '../common/Select';
import { CurrencyInput } from '../common/Input';
import { Toggle } from '../common/Toggle';
import { getAverageRent, getEstimatedUtilities } from '../../data/costOfLiving';
import { formatCurrency } from '../../utils/formatters';

const APARTMENT_SIZE_OPTIONS = [
  { value: 'studio', label: 'Studio (1 room)' },
  { value: 'twoRoom', label: '2 rooms' },
  { value: 'threeRoom', label: '3 rooms' },
  { value: 'fourPlusRoom', label: '4+ rooms' },
];

const LOCATION_TYPE_OPTIONS = [
  { value: 'urban', label: 'City center' },
  { value: 'suburban', label: 'Suburban / rural' },
];

export function BudgetHousingForm() {
  const { inputs, updateInputs } = useBudget();
  const { taxpayer } = useTax();

  const estimatedRent = getAverageRent(
    taxpayer.canton,
    inputs.locationType,
    inputs.apartmentSize
  );
  const estimatedUtilities = getEstimatedUtilities(inputs.apartmentSize);

  const useCustomRent = inputs.customRent !== undefined && inputs.customRent > 0;

  return (
    <Card
      title="Housing"
      subtitle="Rent or mortgage costs"
      headerAction={<Home className="w-5 h-5 text-red-500" />}
    >
      <div className="space-y-4">
        <Select
          label="Apartment size"
          value={inputs.apartmentSize}
          onChange={(value) =>
            updateInputs({
              apartmentSize: value as 'studio' | 'twoRoom' | 'threeRoom' | 'fourPlusRoom',
            })
          }
          options={APARTMENT_SIZE_OPTIONS}
          tooltip="Number of rooms affects rent and utility estimates"
        />

        <Select
          label="Location type"
          value={inputs.locationType}
          onChange={(value) =>
            updateInputs({
              locationType: value as 'urban' | 'suburban',
            })
          }
          options={LOCATION_TYPE_OPTIONS}
          tooltip="City center rents are typically 20-30% higher"
        />

        {estimatedRent && !useCustomRent && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-700">
              <Building2 className="w-4 h-4 inline mr-1" />
              Estimated rent for {taxpayer.canton}:{' '}
              <span className="font-semibold">{formatCurrency(estimatedRent)}/mo</span>
            </p>
            <p className="text-xs text-blue-600 mt-1">
              + ~{formatCurrency(estimatedUtilities)}/mo utilities
            </p>
          </div>
        )}

        <Toggle
          label="Use custom rent amount"
          checked={useCustomRent}
          onChange={(checked) => {
            if (!checked) {
              updateInputs({ customRent: undefined });
            } else {
              updateInputs({ customRent: estimatedRent || 1800 });
            }
          }}
          description="Override the estimated rent with your actual rent"
        />

        {useCustomRent && (
          <CurrencyInput
            label="Monthly rent"
            value={inputs.customRent || 0}
            onChange={(value) => updateInputs({ customRent: value })}
            tooltip="Your actual monthly rent or mortgage payment"
          />
        )}
      </div>
    </Card>
  );
}
