

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  headerAction?: React.ReactNode;
}

export function Card({ children, title, subtitle, className = '', headerAction }: CardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {(title || headerAction) && (
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  color?: 'default' | 'green' | 'red' | 'blue' | 'purple' | 'amber' | 'orange';
  icon?: React.ReactNode;
}

export interface CompactStatItem {
  label: string;
  value: string;
  color?: 'default' | 'green' | 'red' | 'blue' | 'purple' | 'amber' | 'orange';
  icon?: React.ReactNode;
}

interface CompactStatListProps {
  items: CompactStatItem[];
}

export function StatCard({ label, value, subValue, color = 'default', icon }: StatCardProps) {
  const colorClasses = {
    default: 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600',
    green: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800',
    red: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800',
    blue: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
    purple: 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800',
    amber: 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800',
    orange: 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800',
  };

  const textColorClasses = {
    default: 'text-gray-900 dark:text-gray-100',
    green: 'text-green-700 dark:text-green-400',
    red: 'text-red-700 dark:text-red-400',
    blue: 'text-blue-700 dark:text-blue-400',
    purple: 'text-purple-700 dark:text-purple-400',
    amber: 'text-amber-700 dark:text-amber-400',
    orange: 'text-orange-700 dark:text-orange-400',
  };

  return (
    <div className={`rounded-xl border p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
        {icon}
      </div>
      <p className={`text-2xl font-bold mt-2 ${textColorClasses[color]}`}>{value}</p>
      {subValue && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subValue}</p>}
    </div>
  );
}

export function CompactStatList({ items }: CompactStatListProps) {
  const borderColorClasses = {
    default: 'border-l-gray-400 dark:border-l-gray-500',
    green: 'border-l-green-400 dark:border-l-green-500',
    red: 'border-l-red-400 dark:border-l-red-500',
    blue: 'border-l-blue-400 dark:border-l-blue-500',
    purple: 'border-l-purple-400 dark:border-l-purple-500',
    amber: 'border-l-amber-400 dark:border-l-amber-500',
    orange: 'border-l-orange-400 dark:border-l-orange-500',
  };

  const bgColorClasses = {
    default: 'bg-gray-50/50 dark:bg-gray-700/50',
    green: 'bg-green-50/50 dark:bg-green-900/30',
    red: 'bg-red-50/50 dark:bg-red-900/30',
    blue: 'bg-blue-50/50 dark:bg-blue-900/30',
    purple: 'bg-purple-50/50 dark:bg-purple-900/30',
    amber: 'bg-amber-50/50 dark:bg-amber-900/30',
    orange: 'bg-orange-50/50 dark:bg-orange-900/30',
  };

  const textColorClasses = {
    default: 'text-gray-700 dark:text-gray-300',
    green: 'text-green-700 dark:text-green-400',
    red: 'text-red-700 dark:text-red-400',
    blue: 'text-blue-700 dark:text-blue-400',
    purple: 'text-purple-700 dark:text-purple-400',
    amber: 'text-amber-700 dark:text-amber-400',
    orange: 'text-orange-700 dark:text-orange-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
      {items.map((item, index) => {
        const color = item.color || 'default';
        return (
          <div
            key={index}
            className={`flex items-center justify-between py-2.5 px-3 border-l-4 ${borderColorClasses[color]} ${bgColorClasses[color]}`}
          >
            <div className="flex items-center gap-2">
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
            </div>
            <span className={`text-sm font-semibold ${textColorClasses[color]}`}>
              {item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
