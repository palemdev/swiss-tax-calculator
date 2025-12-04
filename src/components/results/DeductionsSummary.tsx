import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useTax } from '../../context/TaxContext';
import { Card } from '../common/Card';
import { formatCurrency } from '../../utils/formatters';

interface DeductionCategoryProps {
  title: string;
  total: number;
  items: { label: string; amount: number }[];
  defaultExpanded?: boolean;
}

function DeductionCategory({ title, total, items, defaultExpanded = false }: DeductionCategoryProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (total === 0) return null;

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between py-3 text-left hover:bg-gray-50 -mx-2 px-2 rounded"
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
          <span className="font-medium text-gray-700">{title}</span>
        </div>
        <span className="font-medium text-green-600">{formatCurrency(total)}</span>
      </button>

      {expanded && (
        <div className="pl-6 pb-3 space-y-1">
          {items.filter(item => item.amount > 0).map((item, index) => (
            <div key={index} className="flex justify-between text-sm text-gray-600">
              <span>{item.label}</span>
              <span>{formatCurrency(item.amount)}</span>
            </div>
          ))}
        </div>
      )}
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

  const { deductions } = results;

  return (
    <Card title="Deductions Summary" subtitle="Applied deductions">
      <DeductionCategory
        title="Professional Expenses"
        total={deductions.professionalExpenses.total}
        items={[
          { label: 'Commuting', amount: deductions.professionalExpenses.commuting },
          { label: 'Meals', amount: deductions.professionalExpenses.meals },
          { label: 'Other', amount: deductions.professionalExpenses.other },
        ]}
        defaultExpanded
      />

      <DeductionCategory
        title="Insurance Premiums"
        total={deductions.insurancePremiums.total}
        items={[
          { label: 'Health Insurance', amount: deductions.insurancePremiums.health },
          { label: 'Other Insurance', amount: deductions.insurancePremiums.other },
        ]}
      />

      <DeductionCategory
        title="Pension Contributions"
        total={deductions.pensionContributions.total}
        items={[
          { label: 'Pillar 2 (BVG)', amount: deductions.pensionContributions.pillar2 },
          { label: 'Pillar 3a', amount: deductions.pensionContributions.pillar3a },
        ]}
      />

      <DeductionCategory
        title="Personal Deductions"
        total={deductions.personalDeductions.total}
        items={[
          { label: 'Married Deduction', amount: deductions.personalDeductions.married },
          { label: 'Children', amount: deductions.personalDeductions.children },
          { label: 'Childcare', amount: deductions.personalDeductions.childcare },
          { label: 'Social Deduction', amount: deductions.personalDeductions.social },
        ]}
      />

      <DeductionCategory
        title="Other Deductions"
        total={deductions.otherDeductions.total}
        items={[
          { label: 'Debt Interest', amount: deductions.otherDeductions.debtInterest },
          { label: 'Donations', amount: deductions.otherDeductions.donations },
          { label: 'Medical Expenses', amount: deductions.otherDeductions.medical },
          { label: 'Alimony Paid', amount: deductions.otherDeductions.alimony },
          { label: 'Other', amount: deductions.otherDeductions.other },
        ]}
      />

      <div className="flex justify-between pt-4 mt-2 border-t-2 border-gray-200 font-semibold">
        <span className="text-gray-900">Total Deductions</span>
        <span className="text-green-600">{formatCurrency(deductions.totalDeductions)}</span>
      </div>
    </Card>
  );
}
