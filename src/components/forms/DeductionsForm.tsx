
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTax } from '../../context/TaxContext';
import { CurrencyInput } from '../common/Input';
import { Toggle } from '../common/Toggle';
import { Card } from '../common/Card';
import { PILLAR_3A_LIMITS } from '../../data/constants';

export function DeductionsForm() {
  const { deductions, updateDeductions, enableDeductions, toggleDeductions, showAdvancedDeductions, toggleAdvancedDeductions } = useTax();

  const maxPillar3a = deductions.hasEmployerPension
    ? PILLAR_3A_LIMITS.withPension
    : PILLAR_3A_LIMITS.withoutPension;

  return (
    <Card
      title="Deductions"
      subtitle="Reduce your taxable income"
      headerAction={
        enableDeductions && (
          <button
            onClick={toggleAdvancedDeductions}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            {showAdvancedDeductions ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Less options
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                More options
              </>
            )}
          </button>
        )
      }
    >
      <div className="mb-6">
        <Toggle
          label="Enable deductions"
          checked={enableDeductions}
          onChange={() => toggleDeductions()}
          description="Apply tax deductions to reduce taxable income"
        />
      </div>

      {!enableDeductions && (
        <p className="text-sm text-gray-500 italic">
          Enable deductions above to configure tax deductions.
        </p>
      )}

      {enableDeductions && (
        <>
      {/* Professional Expenses */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">
          Professional Expenses
        </h4>
        <Toggle
          label="Use flat-rate deduction"
          checked={deductions.usesFlatRateProfessional}
          onChange={(checked) => updateDeductions({ usesFlatRateProfessional: checked })}
          description="Standard deduction of CHF 2,000-3,000 depending on canton"
        />

        {!deductions.usesFlatRateProfessional && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mt-3">
            <CurrencyInput
              label="Commuting Costs"
              value={deductions.actualCommutingCosts}
              onChange={(value) => updateDeductions({ actualCommutingCosts: value })}
              tooltip="Public transport or limited car expenses"
            />
            <CurrencyInput
              label="Meal Expenses"
              value={deductions.mealExpenses}
              onChange={(value) => updateDeductions({ mealExpenses: value })}
              tooltip="If you cannot eat at home due to work"
            />
            <CurrencyInput
              label="Other Professional Expenses"
              value={deductions.professionalExpenses}
              onChange={(value) => updateDeductions({ professionalExpenses: value })}
              tooltip="Work tools, professional clothing, etc."
            />
          </div>
        )}
      </div>

      {/* Insurance Premiums */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">
          Insurance Premiums
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <CurrencyInput
            label="Health Insurance Premiums"
            value={deductions.healthInsurancePremiums}
            onChange={(value) => updateDeductions({ healthInsurancePremiums: value })}
            tooltip="Annual health insurance premiums (basic + supplementary)"
          />
          {showAdvancedDeductions && (
            <CurrencyInput
              label="Other Insurance Premiums"
              value={deductions.otherInsurancePremiums}
              onChange={(value) => updateDeductions({ otherInsurancePremiums: value })}
              tooltip="Life insurance, accident insurance (private)"
            />
          )}
        </div>
      </div>

      {/* Pension Contributions */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">
          Pension Contributions
        </h4>
        <Toggle
          label="I have an employer pension (Pillar 2/BVG)"
          checked={deductions.hasEmployerPension}
          onChange={(checked) => updateDeductions({ hasEmployerPension: checked })}
          description="Affects Pillar 3a maximum contribution"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mt-3">
          {showAdvancedDeductions && (
            <CurrencyInput
              label="Pillar 2 Buy-in"
              value={deductions.pillar2Contributions}
              onChange={(value) => updateDeductions({ pillar2Contributions: value })}
              tooltip="Voluntary contributions to employer pension"
            />
          )}
          <CurrencyInput
            label={`Pillar 3a (max CHF ${maxPillar3a.toLocaleString()})`}
            value={deductions.pillar3aContributions}
            onChange={(value) => updateDeductions({ pillar3aContributions: Math.min(value, maxPillar3a) })}
            tooltip="Private pension contributions (tax-deductible)"
          />
        </div>
      </div>

      {/* Advanced Deductions */}
      {showAdvancedDeductions && (
        <>
          {/* Personal Deductions */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">
              Family & Personal
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <CurrencyInput
                label="Childcare Expenses"
                value={deductions.childcareExpenses}
                onChange={(value) => updateDeductions({ childcareExpenses: value })}
                tooltip="Daycare, nanny, after-school care costs"
              />
              <CurrencyInput
                label="Alimony Paid"
                value={deductions.alimonyPaid}
                onChange={(value) => updateDeductions({ alimonyPaid: value })}
                tooltip="Court-ordered alimony/child support payments"
              />
            </div>
          </div>

          {/* Other Deductions */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">
              Other Deductions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <CurrencyInput
                label="Debt Interest"
                value={deductions.debtInterest}
                onChange={(value) => updateDeductions({ debtInterest: value })}
                tooltip="Interest on loans (mortgage interest, etc.)"
              />
              <CurrencyInput
                label="Charitable Donations"
                value={deductions.charitableDonations}
                onChange={(value) => updateDeductions({ charitableDonations: value })}
                tooltip="Donations to registered charities (max 20% of net income)"
              />
              <CurrencyInput
                label="Medical Expenses"
                value={deductions.medicalExpenses}
                onChange={(value) => updateDeductions({ medicalExpenses: value })}
                tooltip="Unreimbursed medical costs above threshold"
              />
              <CurrencyInput
                label="Other Deductions"
                value={deductions.otherDeductions}
                onChange={(value) => updateDeductions({ otherDeductions: value })}
                tooltip="Any other eligible deductions"
              />
            </div>
          </div>
        </>
      )}
        </>
      )}
    </Card>
  );
}
