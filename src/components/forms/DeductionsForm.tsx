
import { useTax } from '../../context/TaxContext';
import { CurrencyInput, NumberInput } from '../common/Input';
import { Toggle } from '../common/Toggle';
import { Card } from '../common/Card';
import { PILLAR_3A_LIMITS } from '../../data/constants';
import { getCantonConfig } from '../../data/cantons';

export function DeductionsForm() {
  const { deductions, updateDeductions, enableDeductions, toggleDeductions, taxpayer } = useTax();

  const maxPillar3a = deductions.hasEmployerPension
    ? PILLAR_3A_LIMITS.withPension
    : PILLAR_3A_LIMITS.withoutPension;

  // Get canton-specific deduction limits
  const cantonConfig = getCantonConfig(taxpayer.canton);
  const hasRentDeduction = !!cantonConfig?.deductionLimits.rentDeduction;
  const hasSelfCareDeduction = !!cantonConfig?.deductionLimits.selfCareDeduction;
  const hasDualEarnerDeduction = !!cantonConfig?.deductionLimits.dualEarnerDeduction;
  const hasEducationDeduction = !!cantonConfig?.deductionLimits.educationDeduction;
  const hasChildEducationDeduction = !!cantonConfig?.deductionLimits.childEducationDeduction;
  const isMarried = taxpayer.civilStatus === 'married';

  return (
    <Card
      title="Deductions"
      subtitle="Reduce your taxable income"
      headerAction={
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleDeductions()}
            className="flex items-center gap-1.5"
          >
            <span className="text-xs text-gray-500 dark:text-gray-400">{enableDeductions ? 'On' : 'Off'}</span>
            <div
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                enableDeductions ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`absolute h-3.5 w-3.5 rounded-full bg-white shadow transition-all ${
                  enableDeductions ? 'left-[18px]' : 'left-[3px]'
                }`}
              />
            </div>
          </button>
        </div>
      }
    >
      {!enableDeductions && (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          Enable deductions to configure tax deductions and reduce taxable income.
        </p>
      )}

      {enableDeductions && (
        <>
      {/* Professional Expenses */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
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
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
          Insurance Premiums
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <CurrencyInput
            label="Health Insurance Premiums"
            value={deductions.healthInsurancePremiums}
            onChange={(value) => updateDeductions({ healthInsurancePremiums: value })}
            tooltip="Annual health insurance premiums (basic + supplementary)"
          />
          <CurrencyInput
            label="Other Insurance Premiums"
            value={deductions.otherInsurancePremiums}
            onChange={(value) => updateDeductions({ otherInsurancePremiums: value })}
            tooltip="Life insurance, accident insurance (private)"
          />
        </div>
      </div>

      {/* Pension Contributions */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
          Pension Contributions
        </h4>
        <Toggle
          label="I have an employer pension (Pillar 2/BVG)"
          checked={deductions.hasEmployerPension}
          onChange={(checked) => updateDeductions({ hasEmployerPension: checked })}
          description="Affects Pillar 3a maximum contribution"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mt-3">
          <CurrencyInput
            label="Pillar 2 Buy-in"
            value={deductions.pillar2Contributions}
            onChange={(value) => updateDeductions({ pillar2Contributions: value })}
            tooltip="Voluntary contributions to employer pension"
          />
          <CurrencyInput
            label={`Pillar 3a (max CHF ${maxPillar3a.toLocaleString()})`}
            value={deductions.pillar3aContributions}
            onChange={(value) => updateDeductions({ pillar3aContributions: Math.min(value, maxPillar3a) })}
            tooltip="Private pension contributions (tax-deductible)"
          />
        </div>
      </div>

      {/* Family & Personal Deductions */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
          Family & Personal
        </h4>
        {hasSelfCareDeduction && taxpayer.childrenInChildcare > 0 && (
          <div className="mb-3">
            <Toggle
              label="Use self-care deduction (Eigenbetreuungsabzug)"
              checked={deductions.usesSelfCareDeduction}
              onChange={(checked) => updateDeductions({ usesSelfCareDeduction: checked })}
              description={`CHF ${cantonConfig?.deductionLimits.selfCareDeduction?.toLocaleString()} per child - alternative to childcare expenses`}
            />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          {!deductions.usesSelfCareDeduction && (
            <CurrencyInput
              label="Childcare Expenses"
              value={deductions.childcareExpenses}
              onChange={(value) => updateDeductions({ childcareExpenses: value })}
              tooltip={`Daycare, nanny, after-school care costs (max CHF ${cantonConfig?.deductionLimits.childcareDeduction.toLocaleString()} per child)`}
              disabled={taxpayer.childrenInChildcare === 0}
            />
          )}
          {hasChildEducationDeduction && (
            <NumberInput
              label="Children 15+ in Education"
              value={deductions.childrenInEducation}
              onChange={(value) => updateDeductions({ childrenInEducation: value })}
              min={0}
              max={10}
              tooltip={`Additional CHF ${cantonConfig?.deductionLimits.childEducationDeduction?.toLocaleString()} per child aged 15+ still in education`}
              disabled={taxpayer.numberOfChildren === 0}
            />
          )}
          <CurrencyInput
            label="Alimony Paid"
            value={deductions.alimonyPaid}
            onChange={(value) => updateDeductions({ alimonyPaid: value })}
            tooltip="Court-ordered alimony/child support payments"
          />
          {hasDualEarnerDeduction && isMarried && (
            <div className="col-span-full">
              <Toggle
                label="Dual-earner couple (Zweiverdienerabzug)"
                checked={deductions.isDualEarnerCouple}
                onChange={(checked) => updateDeductions({ isDualEarnerCouple: checked })}
                description={`Both spouses work - CHF ${cantonConfig?.deductionLimits.dualEarnerDeduction?.toLocaleString()} deduction`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Other Deductions */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
          Other Deductions
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          {hasRentDeduction && (
            <CurrencyInput
              label="Annual Rent (Mietzinsabzug)"
              value={deductions.rentExpenses}
              onChange={(value) => updateDeductions({ rentExpenses: value })}
              tooltip={`${cantonConfig?.deductionLimits.rentDeduction?.percentage}% of rent deductible, max CHF ${cantonConfig?.deductionLimits.rentDeduction?.maxAmount.toLocaleString()}`}
            />
          )}
          {hasEducationDeduction && (
            <CurrencyInput
              label="Education/Training Costs"
              value={deductions.educationExpenses}
              onChange={(value) => updateDeductions({ educationExpenses: value })}
              tooltip={`Professional training costs, max CHF ${cantonConfig?.deductionLimits.educationDeduction?.toLocaleString()}`}
            />
          )}
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
    </Card>
  );
}
