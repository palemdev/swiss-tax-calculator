import { User, Sparkles, PartyPopper, PiggyBank } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { Card } from '../common/Card';
import { CurrencyInput } from '../common/Input';

export function BudgetPersonalForm() {
  const { inputs, updateInputs, showAdvancedInputs } = useBudget();

  return (
    <Card
      title="Personal & Savings"
      subtitle="Lifestyle and financial goals"
      headerAction={<User className="w-5 h-5 text-purple-500" />}
    >
      <div className="space-y-6">
        {/* Personal spending */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Personal
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <CurrencyInput
              label="Clothing"
              value={inputs.clothingBudget}
              onChange={(value) => updateInputs({ clothingBudget: value })}
              tooltip="Monthly clothing budget"
            />
            <CurrencyInput
              label="Personal care"
              value={inputs.personalCare}
              onChange={(value) => updateInputs({ personalCare: value })}
              tooltip="Haircuts, cosmetics, toiletries"
            />
          </div>
        </div>

        {/* Entertainment */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <PartyPopper className="w-4 h-4" />
            Entertainment
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <CurrencyInput
              label="Entertainment"
              value={inputs.entertainmentBudget}
              onChange={(value) => updateInputs({ entertainmentBudget: value })}
              tooltip="Cinema, concerts, events, etc."
            />
            <CurrencyInput
              label="Hobbies"
              value={inputs.hobbies}
              onChange={(value) => updateInputs({ hobbies: value })}
              tooltip="Sports clubs, equipment, courses"
            />
          </div>
          {showAdvancedInputs && (
            <CurrencyInput
              label="Gym membership"
              value={inputs.gymMembership}
              onChange={(value) => updateInputs({ gymMembership: value })}
              tooltip="Fitness center subscription"
            />
          )}
        </div>

        {/* Savings */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <PiggyBank className="w-4 h-4" />
            Savings & Investments
          </h4>
          <CurrencyInput
            label="Monthly savings"
            value={inputs.savingsTarget}
            onChange={(value) => updateInputs({ savingsTarget: value })}
            tooltip="General savings goal (recommend 10% of income)"
          />
          {showAdvancedInputs && (
            <>
              <CurrencyInput
                label="Emergency fund"
                value={inputs.emergencyFund}
                onChange={(value) => updateInputs({ emergencyFund: value })}
                tooltip="Building emergency reserves (3-6 months expenses)"
              />
              <CurrencyInput
                label="Investments"
                value={inputs.investmentContribution}
                onChange={(value) => updateInputs({ investmentContribution: value })}
                tooltip="Monthly investment contributions (beyond Pillar 3a)"
              />
            </>
          )}
        </div>

        {/* Other */}
        {showAdvancedInputs && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Other</h4>
            <div className="grid grid-cols-2 gap-4">
              <CurrencyInput
                label="Vacation budget"
                value={inputs.vacationBudget}
                onChange={(value) => updateInputs({ vacationBudget: value })}
                tooltip="Monthly allocation for annual vacation"
              />
              <CurrencyInput
                label="Gifts"
                value={inputs.giftsBudget}
                onChange={(value) => updateInputs({ giftsBudget: value })}
                tooltip="Birthday gifts, Christmas, etc."
              />
            </div>
            <CurrencyInput
              label="Other expenses"
              value={inputs.otherExpenses}
              onChange={(value) => updateInputs({ otherExpenses: value })}
              tooltip="Any other regular monthly expenses"
            />
          </div>
        )}
      </div>
    </Card>
  );
}
