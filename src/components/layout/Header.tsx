import { Calculator, GitCompare, RotateCcw, Wallet } from 'lucide-react';
import { useTax } from '../../context/TaxContext';
import { TAX_YEAR } from '../../data/constants';
import type { TabType } from '../../App';

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const { reset } = useTax();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Swiss Tax Calculator</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Tax Year {TAX_YEAR}</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            <button
              onClick={() => onTabChange('calculator')}
              className={`
                flex items-center gap-2 px-2 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${activeTab === 'calculator'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'}
              `}
            >
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Calculator</span>
            </button>
            <button
              onClick={() => onTabChange('comparison')}
              className={`
                flex items-center gap-2 px-2 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${activeTab === 'comparison'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'}
              `}
            >
              <GitCompare className="w-4 h-4" />
              <span className="hidden sm:inline">Compare</span>
            </button>
            <button
              onClick={() => onTabChange('budget')}
              className={`
                flex items-center gap-2 px-2 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${activeTab === 'budget'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'}
              `}
            >
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">Budget</span>
            </button>
          </nav>

          {/* Reset Button */}
          <button
            onClick={reset}
            className="flex items-center gap-2 px-2 sm:px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
}
