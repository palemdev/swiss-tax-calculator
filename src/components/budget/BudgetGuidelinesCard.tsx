import { CheckCircle2, AlertTriangle, XCircle, Lightbulb } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { Card } from '../common/Card';
import { formatPercentage, formatCurrency } from '../../utils/formatters';

function StatusIcon({ status }: { status: 'good' | 'warning' | 'over' }) {
  switch (status) {
    case 'good':
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    case 'over':
      return <XCircle className="w-5 h-5 text-red-500" />;
  }
}

function StatusBadge({ status }: { status: 'good' | 'warning' | 'over' }) {
  const colors = {
    good: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400',
    warning: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400',
    over: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400',
  };

  const labels = {
    good: 'Good',
    warning: 'Review',
    over: 'Over budget',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>
      {labels[status]}
    </span>
  );
}

export function BudgetGuidelinesCard() {
  const { results, suggestions } = useBudget();

  if (!results) {
    return (
      <Card title="Budget Guidelines" subtitle="Swiss budget recommendations">
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Enter your details to see budget guidelines
        </p>
      </Card>
    );
  }

  return (
    <Card title="Budget Guidelines" subtitle="Based on Swiss budget recommendations">
      {/* Guidelines */}
      <div className="space-y-3">
        {results.guidelines.map((guideline) => (
          <div
            key={guideline.category}
            className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <StatusIcon status={guideline.status} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 dark:text-gray-100">{guideline.category}</span>
                <StatusBadge status={guideline.status} />
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {formatPercentage(guideline.actualPercentage)} of income
                </span>
                <span className="text-gray-400 dark:text-gray-500">•</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {formatCurrency(guideline.actualAmount)}/mo
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{guideline.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            Suggestions
          </h4>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300 bg-amber-50 dark:bg-amber-900/30 p-3 rounded-lg"
              >
                <span className="text-amber-500 dark:text-amber-400 mt-0.5">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Overall status */}
      <div
        className={`mt-6 p-4 rounded-lg ${
          results.isBalanced
            ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
        }`}
      >
        <div className="flex items-center gap-2">
          {results.isBalanced ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500" />
              <span className="font-medium text-green-700 dark:text-green-400">Budget is balanced</span>
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-500" />
              <span className="font-medium text-red-700 dark:text-red-400">Budget has a deficit</span>
            </>
          )}
        </div>
        <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
          {results.isBalanced
            ? `You have ${formatCurrency(results.monthlyDisposableIncome)} remaining each month after all expenses.`
            : `Your expenses exceed income by ${formatCurrency(Math.abs(results.monthlyDisposableIncome))}/month. Review your spending.`}
        </p>
      </div>
    </Card>
  );
}
