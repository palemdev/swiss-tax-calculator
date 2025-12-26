import {
  Home,
  Heart,
  Baby,
  Car,
  ShoppingCart,
  Wifi,
  Shield,
  User,
  PiggyBank,
  MoreHorizontal,
} from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { Card } from '../common/Card';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { BUDGET_COLORS } from '../../types/budget';

interface CategoryRowProps {
  icon: React.ReactNode;
  label: string;
  amount: number;
  percentage: number;
  color: string;
  details?: { label: string; amount: number }[];
}

function CategoryRow({ icon, label, amount, percentage, color, details }: CategoryRowProps) {
  return (
    <div className="py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            {icon}
          </div>
          <span className="font-medium text-gray-900 dark:text-gray-100">{label}</span>
        </div>
        <div className="text-right">
          <span className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(amount)}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({formatPercentage(percentage)})</span>
        </div>
      </div>
      {details && details.length > 0 && (
        <div className="ml-11 mt-2 space-y-1">
          {details
            .filter((d) => d.amount > 0)
            .map((detail) => (
              <div key={detail.label} className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>{detail.label}</span>
                <span>{formatCurrency(detail.amount)}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export function BudgetBreakdownCard() {
  const { results } = useBudget();

  if (!results) {
    return (
      <Card title="Budget Breakdown" subtitle="Monthly expenses by category">
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Enter your tax details to see budget breakdown
        </p>
      </Card>
    );
  }

  const { categories, monthlyNetIncome } = results;

  const getPercentage = (amount: number) =>
    monthlyNetIncome > 0 ? (amount / monthlyNetIncome) * 100 : 0;

  return (
    <Card title="Budget Breakdown" subtitle="Monthly expenses by category">
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        <CategoryRow
          icon={<Home className="w-4 h-4" style={{ color: BUDGET_COLORS.housing }} />}
          label="Housing"
          amount={categories.housing.total}
          percentage={getPercentage(categories.housing.total)}
          color={BUDGET_COLORS.housing}
          details={[
            { label: 'Rent', amount: categories.housing.rent },
            { label: 'Utilities', amount: categories.housing.utilities },
          ]}
        />
        <CategoryRow
          icon={<Heart className="w-4 h-4" style={{ color: BUDGET_COLORS.healthcare }} />}
          label="Healthcare"
          amount={categories.healthcare.total}
          percentage={getPercentage(categories.healthcare.total)}
          color={BUDGET_COLORS.healthcare}
          details={[
            { label: 'Insurance', amount: categories.healthcare.insurance },
            { label: 'Out-of-pocket', amount: categories.healthcare.outOfPocket },
          ]}
        />
        {categories.children.total > 0 && (
          <CategoryRow
            icon={<Baby className="w-4 h-4" style={{ color: BUDGET_COLORS.children }} />}
            label="Children"
            amount={categories.children.total}
            percentage={getPercentage(categories.children.total)}
            color={BUDGET_COLORS.children}
            details={[
              { label: 'Health Insurance', amount: categories.children.healthInsurance },
              { label: 'Childcare', amount: categories.children.childcare },
              { label: 'Food', amount: categories.children.food },
              { label: 'Clothing', amount: categories.children.clothing },
              { label: 'Education', amount: categories.children.education },
            ]}
          />
        )}
        <CategoryRow
          icon={<Car className="w-4 h-4" style={{ color: BUDGET_COLORS.transportation }} />}
          label="Transportation"
          amount={categories.transportation.total}
          percentage={getPercentage(categories.transportation.total)}
          color={BUDGET_COLORS.transportation}
          details={[
            { label: 'Public transport', amount: categories.transportation.publicTransport },
            { label: 'Car', amount: categories.transportation.car },
          ]}
        />
        <CategoryRow
          icon={<ShoppingCart className="w-4 h-4" style={{ color: BUDGET_COLORS.food }} />}
          label="Food"
          amount={categories.food.total}
          percentage={getPercentage(categories.food.total)}
          color={BUDGET_COLORS.food}
          details={[
            { label: 'Groceries', amount: categories.food.groceries },
            { label: 'Dining out', amount: categories.food.diningOut },
          ]}
        />
        <CategoryRow
          icon={<Wifi className="w-4 h-4" style={{ color: BUDGET_COLORS.telecommunications }} />}
          label="Telecom"
          amount={categories.telecommunications.total}
          percentage={getPercentage(categories.telecommunications.total)}
          color={BUDGET_COLORS.telecommunications}
        />
        <CategoryRow
          icon={<Shield className="w-4 h-4" style={{ color: BUDGET_COLORS.insurance }} />}
          label="Insurance"
          amount={categories.insurance.total}
          percentage={getPercentage(categories.insurance.total)}
          color={BUDGET_COLORS.insurance}
        />
        <CategoryRow
          icon={<User className="w-4 h-4" style={{ color: BUDGET_COLORS.personal }} />}
          label="Personal"
          amount={categories.personal.total}
          percentage={getPercentage(categories.personal.total)}
          color={BUDGET_COLORS.personal}
        />
        <CategoryRow
          icon={<PiggyBank className="w-4 h-4" style={{ color: BUDGET_COLORS.savings }} />}
          label="Savings"
          amount={categories.savings.total}
          percentage={getPercentage(categories.savings.total)}
          color={BUDGET_COLORS.savings}
        />
        <CategoryRow
          icon={<MoreHorizontal className="w-4 h-4" style={{ color: BUDGET_COLORS.other }} />}
          label="Other"
          amount={categories.other.total}
          percentage={getPercentage(categories.other.total)}
          color={BUDGET_COLORS.other}
        />
      </div>

      {/* Total */}
      <div className="mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-lg font-bold text-gray-900 dark:text-gray-100">
          <span>Total Monthly Expenses</span>
          <span>{formatCurrency(results.monthlyExpenses)}</span>
        </div>
      </div>
    </Card>
  );
}
