
import { Info } from 'lucide-react';
import { useId } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  tooltip?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  label,
  value,
  onChange,
  options,
  tooltip,
  disabled = false,
  className = '',
}: SelectProps) {
  const id = useId();
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
        {label}
        {tooltip && (
          <span className="group relative">
            <Info className="w-4 h-4 text-gray-400 cursor-help" />
            <span className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 text-xs bg-gray-900 text-white rounded shadow-lg z-10">
              {tooltip}
            </span>
          </span>
        )}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="
          w-full px-3 py-2 border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-red-500 focus:border-red-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          bg-white
        "
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
