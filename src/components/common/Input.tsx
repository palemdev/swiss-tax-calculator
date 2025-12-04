
import { Info } from 'lucide-react';

interface InputProps {
  label: string;
  value: number | string;
  onChange: (value: number) => void;
  type?: 'number' | 'currency';
  min?: number;
  max?: number;
  step?: number;
  tooltip?: string;
  disabled?: boolean;
  className?: string;
}

export function Input({
  label,
  value,
  onChange,
  type = 'number',
  min = 0,
  max,
  step = 1,
  tooltip,
  disabled = false,
  className = '',
}: InputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numValue = parseFloat(rawValue) || 0;
    onChange(numValue);
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
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
      <div className="relative">
        {type === 'currency' && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            CHF
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={`
            w-full px-3 py-2 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-red-500 focus:border-red-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${type === 'currency' ? 'pl-12' : ''}
          `}
        />
      </div>
    </div>
  );
}

interface CurrencyInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  tooltip?: string;
  disabled?: boolean;
}

export function CurrencyInput({ label, value, onChange, tooltip, disabled }: CurrencyInputProps) {
  return (
    <Input
      label={label}
      value={value}
      onChange={onChange}
      type="currency"
      step={100}
      tooltip={tooltip}
      disabled={disabled}
    />
  );
}
