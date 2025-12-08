import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useTax } from '../../context/TaxContext';
import { Card } from '../common/Card';
import { formatCurrency } from '../../utils/formatters';
import type { DeductionBreakdown } from '../../types';

interface DeductionCategoryProps {
  title: string;
  total: number;
  items: { label: string; amount: number }[];
  marginalRate: number;
  defaultExpanded?: boolean;
}

function DeductionCategory({ title, total, items, marginalRate, defaultExpanded = false }: DeductionCategoryProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (total === 0) return null;

  const taxSavings = total * (marginalRate / 100);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between py-2 text-left hover:bg-gray-50 -mx-2 px-2 rounded"
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
          <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>
        <div className="text-right">
          <span className="text-sm font-medium text-green-600">{formatCurrency(total)}</span>
          <span className="text-xs text-gray-500 ml-2">(-{formatCurrency(taxSavings)})</span>
        </div>
      </button>

      {expanded && (
        <div className="pl-6 pb-2 space-y-1">
          {items.filter(item => item.amount > 0).map((item, index) => {
            const itemSavings = item.amount * (marginalRate / 100);
            return (
              <div key={index} className="flex justify-between text-xs text-gray-600">
                <span>{item.label}</span>
                <div>
                  <span>{formatCurrency(item.amount)}</span>
                  <span className="text-gray-400 ml-2">(-{formatCurrency(itemSavings)})</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface DeductionSectionProps {
  title: string;
  deductions: DeductionBreakdown;
  marginalRate: number;
  color: string;
}

function DeductionSection({ title, deductions, marginalRate, color }: DeductionSectionProps) {
  const totalTaxSavings = deductions.totalDeductions * (marginalRate / 100);

  return (
    <div className="mb-4">
      <div className={`text-sm font-semibold ${color} mb-2 pb-1 border-b`}>
        {title}
      </div>

      <DeductionCategory
        title="Social Security (AHV/IV/EO/ALV)"
        total={deductions.socialSecurity.total}
        items={[
          { label: 'AHV/IV/EO (5.3%)', amount: deductions.socialSecurity.ahvIvEo },
          { label: 'ALV (1.1%/0.5%)', amount: deductions.socialSecurity.alv },
        ]}
        marginalRate={marginalRate}
      />

      <DeductionCategory
        title="Professional Expenses"
        total={deductions.professionalExpenses.total}
        items={[
          { label: 'Commuting', amount: deductions.professionalExpenses.commuting },
          { label: 'Meals', amount: deductions.professionalExpenses.meals },
          { label: 'Other', amount: deductions.professionalExpenses.other },
        ]}
        marginalRate={marginalRate}
      />

      <DeductionCategory
        title="Insurance Premiums"
        total={deductions.insurancePremiums.total}
        items={[
          { label: 'Health Insurance', amount: deductions.insurancePremiums.health },
          { label: 'Other Insurance', amount: deductions.insurancePremiums.other },
        ]}
        marginalRate={marginalRate}
      />

      <DeductionCategory
        title="Pension Contributions"
        total={deductions.pensionContributions.total}
        items={[
          { label: 'Pillar 2 (BVG)', amount: deductions.pensionContributions.pillar2 },
          { label: 'Pillar 3a', amount: deductions.pensionContributions.pillar3a },
        ]}
        marginalRate={marginalRate}
      />

      <DeductionCategory
        title="Personal Deductions"
        total={deductions.personalDeductions.total}
        items={[
          { label: 'Married Deduction', amount: deductions.personalDeductions.married },
          { label: 'Dual-Earner Deduction', amount: deductions.personalDeductions.dualEarner },
          { label: 'Children', amount: deductions.personalDeductions.children },
          { label: 'Childcare', amount: deductions.personalDeductions.childcare },
          { label: 'Self-Care (Eigenbetreuung)', amount: deductions.personalDeductions.selfCare },
          { label: 'Child Education (15+)', amount: deductions.personalDeductions.childEducation },
          { label: 'Social Deduction', amount: deductions.personalDeductions.social },
        ]}
        marginalRate={marginalRate}
      />

      <DeductionCategory
        title="Other Deductions"
        total={deductions.otherDeductions.total}
        items={[
          { label: 'Rent Deduction', amount: deductions.otherDeductions.rent },
          { label: 'Education/Training', amount: deductions.otherDeductions.education },
          { label: 'Debt Interest', amount: deductions.otherDeductions.debtInterest },
          { label: 'Donations', amount: deductions.otherDeductions.donations },
          { label: 'Medical Expenses', amount: deductions.otherDeductions.medical },
          { label: 'Alimony Paid', amount: deductions.otherDeductions.alimony },
          { label: 'Other', amount: deductions.otherDeductions.other },
        ]}
        marginalRate={marginalRate}
      />

      <div className="flex justify-between text-sm mt-2 pt-2 border-t border-gray-100">
        <span className="text-gray-700 font-medium">Subtotal</span>
        <div>
          <span className="text-green-600 font-medium">{formatCurrency(deductions.totalDeductions)}</span>
          <span className="text-xs text-gray-500 ml-2">(-{formatCurrency(totalTaxSavings)})</span>
        </div>
      </div>
    </div>
  );
}

export function DeductionsSummary() {
  const { results } = useTax();

  if (!results) {
    return (
      <Card title="Deductions Summary">
        <p className="text-gray-500 text-center py-8">
          Enter your details to see deduction breakdown
        </p>
      </Card>
    );
  }

  const { deductions, deductionsFederal, marginalRate } = results;

  // Use overall marginal rate for tax savings estimate
  // This is a simplification - in reality federal and cantonal have different marginal rates
  const combinedDeductions = deductions.totalDeductions + deductionsFederal.totalDeductions;
  const totalTaxSavings = combinedDeductions * marginalRate / 100;

  return (
    <Card
      title="Deductions Summary"
      subtitle={`Marginal rate: ${marginalRate.toFixed(1)}%`}
    >
      <DeductionSection
        title="Federal Deductions"
        deductions={deductionsFederal}
        marginalRate={marginalRate}
        color="text-blue-600"
      />

      <DeductionSection
        title="Cantonal Deductions"
        deductions={deductions}
        marginalRate={marginalRate}
        color="text-purple-600"
      />

      <div className="pt-3 mt-2 border-t-2 border-gray-200 space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-700">Total Federal Deductions</span>
          <span className="text-green-600">{formatCurrency(deductionsFederal.totalDeductions)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700">Total Cantonal Deductions</span>
          <span className="text-green-600">{formatCurrency(deductions.totalDeductions)}</span>
        </div>
        <div className="flex justify-between font-semibold pt-2">
          <span className="text-gray-900">Estimated Tax Savings</span>
          <span className="text-green-600">-{formatCurrency(totalTaxSavings)}</span>
        </div>
      </div>
    </Card>
  );
}
