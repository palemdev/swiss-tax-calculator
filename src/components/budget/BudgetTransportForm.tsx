import { Car, Train } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { Card } from '../common/Card';
import { CurrencyInput } from '../common/Input';
import { Toggle } from '../common/Toggle';

export function BudgetTransportForm() {
  const { inputs, updateInputs } = useBudget();

  return (
    <Card
      title="Transportation"
      subtitle="Public transport and car costs"
      headerAction={<Car className="w-5 h-5 text-green-500" />}
    >
      <div className="space-y-4">
        <Toggle
          label="Public transport pass"
          checked={inputs.hasPublicTransportPass}
          onChange={(checked) => updateInputs({ hasPublicTransportPass: checked })}
          description="GA, regional pass, or monthly subscription"
        />

        {inputs.hasPublicTransportPass && (
          <CurrencyInput
            label="Monthly transport cost"
            value={inputs.publicTransportCost}
            onChange={(value) => updateInputs({ publicTransportCost: value })}
            tooltip="GA Travelcard: ~CHF 340/mo, Half-fare + zones: varies"
          />
        )}

        <Toggle
          label="Car ownership"
          checked={inputs.hasCar}
          onChange={(checked) => updateInputs({ hasCar: checked })}
          description="Includes lease, fuel, insurance, maintenance"
        />

        {inputs.hasCar && (
          <CurrencyInput
            label="Monthly car costs"
            value={inputs.carCosts}
            onChange={(value) => updateInputs({ carCosts: value })}
            tooltip="Average: CHF 500-800/mo including all costs"
          />
        )}

        {!inputs.hasPublicTransportPass && !inputs.hasCar && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-100">
            <p className="text-sm text-green-700">
              <Train className="w-4 h-4 inline mr-1" />
              No regular transport costs. Consider if you need occasional tickets.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
