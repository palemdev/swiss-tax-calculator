

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  headerAction?: React.ReactNode;
}

export function Card({ children, title, subtitle, className = '', headerAction }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      {(title || headerAction) && (
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
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
    default: 'bg-gray-50 border-gray-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
    amber: 'bg-amber-50 border-amber-200',
    orange: 'bg-orange-50 border-orange-200',
  };

  const textColorClasses = {
    default: 'text-gray-900',
    green: 'text-green-700',
    red: 'text-red-700',
    blue: 'text-blue-700',
    purple: 'text-purple-700',
    amber: 'text-amber-700',
    orange: 'text-orange-700',
  };

  return (
    <div className={`rounded-xl border p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        {icon}
      </div>
      <p className={`text-2xl font-bold mt-2 ${textColorClasses[color]}`}>{value}</p>
      {subValue && <p className="text-sm text-gray-500 mt-1">{subValue}</p>}
    </div>
  );
}

export function CompactStatList({ items }: CompactStatListProps) {
  const borderColorClasses = {
    default: 'border-l-gray-400',
    green: 'border-l-green-400',
    red: 'border-l-red-400',
    blue: 'border-l-blue-400',
    purple: 'border-l-purple-400',
    amber: 'border-l-amber-400',
    orange: 'border-l-orange-400',
  };

  const bgColorClasses = {
    default: 'bg-gray-50/50',
    green: 'bg-green-50/50',
    red: 'bg-red-50/50',
    blue: 'bg-blue-50/50',
    purple: 'bg-purple-50/50',
    amber: 'bg-amber-50/50',
    orange: 'bg-orange-50/50',
  };

  const textColorClasses = {
    default: 'text-gray-700',
    green: 'text-green-700',
    red: 'text-red-700',
    blue: 'text-blue-700',
    purple: 'text-purple-700',
    amber: 'text-amber-700',
    orange: 'text-orange-700',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
      {items.map((item, index) => {
        const color = item.color || 'default';
        return (
          <div
            key={index}
            className={`flex items-center justify-between py-2.5 px-3 border-l-4 ${borderColorClasses[color]} ${bgColorClasses[color]}`}
          >
            <div className="flex items-center gap-2">
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              <span className="text-sm text-gray-600">{item.label}</span>
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
