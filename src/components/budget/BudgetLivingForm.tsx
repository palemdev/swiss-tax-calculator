import { ShoppingCart, Utensils, Wifi, Shield } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { Card } from '../common/Card';
import { CurrencyInput } from '../common/Input';

export function BudgetLivingForm() {
  const { inputs, updateInputs, showAdvancedInputs, toggleAdvancedInputs } = useBudget();

  return (
    <Card
      title="Living Expenses"
      subtitle="Food, telecom, and insurance"
      headerAction={<ShoppingCart className="w-5 h-5 text-teal-500" />}
    >
      <div className="space-y-6">
        {/* Food */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Utensils className="w-4 h-4" />
            Food & Dining
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <CurrencyInput
              label="Groceries"
              value={inputs.groceriesCost}
              onChange={(value) => updateInputs({ groceriesCost: value })}
              tooltip="Monthly grocery shopping (Migros, Coop, Aldi, etc.)"
            />
            <CurrencyInput
              label="Dining out"
              value={inputs.diningOutCost}
              onChange={(value) => updateInputs({ diningOutCost: value })}
              tooltip="Restaurants, takeout, coffee shops"
            />
          </div>
        </div>

        {/* Telecommunications */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Wifi className="w-4 h-4" />
            Telecommunications
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <CurrencyInput
              label="Phone plan"
              value={inputs.phonePlan}
              onChange={(value) => updateInputs({ phonePlan: value })}
              tooltip="Monthly mobile phone plan"
            />
            <CurrencyInput
              label="Internet"
              value={inputs.internetCost}
              onChange={(value) => updateInputs({ internetCost: value })}
              tooltip="Home internet connection"
            />
          </div>
          {showAdvancedInputs && (
            <CurrencyInput
              label="Streaming services"
              value={inputs.streamingServices}
              onChange={(value) => updateInputs({ streamingServices: value })}
              tooltip="Netflix, Spotify, Disney+, etc."
            />
          )}
        </div>

        {/* Insurance */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Insurance (non-health)
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <CurrencyInput
              label="Liability insurance"
              value={inputs.liabilityInsurance}
              onChange={(value) => updateInputs({ liabilityInsurance: value })}
              tooltip="Privathaftpflicht - typically CHF 10-20/mo"
            />
            <CurrencyInput
              label="Household insurance"
              value={inputs.householdInsurance}
              onChange={(value) => updateInputs({ householdInsurance: value })}
              tooltip="Hausratversicherung - typically CHF 15-40/mo"
            />
          </div>
          {showAdvancedInputs && (
            <CurrencyInput
              label="Other insurance"
              value={inputs.otherInsurance}
              onChange={(value) => updateInputs({ otherInsurance: value })}
              tooltip="Legal protection, travel insurance, etc."
            />
          )}
        </div>

        {/* Toggle for advanced inputs */}
        <button
          type="button"
          onClick={toggleAdvancedInputs}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          {showAdvancedInputs ? '− Show less' : '+ Show more options'}
        </button>
      </div>
    </Card>
  );
}
