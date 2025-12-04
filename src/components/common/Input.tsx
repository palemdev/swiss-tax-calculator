
import { Info } from 'lucide-react';
import { useState } from 'react';

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
  placeholder?: string;
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
  placeholder,
}: InputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numValue = parseFloat(rawValue) || 0;
    onChange(numValue);
  };

  const displayValue = placeholder !== undefined && value === 0 ? '' : value;

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
          value={displayValue}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          placeholder={placeholder}
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
  const [displayValue, setDisplayValue] = useState('');
  const [, setIsFocused] = useState(false);

  const formatNumberWithCommas = (str: string): string => {
    // Remove all non-digit characters
    const cleaned = str.replace(/\D/g, '');
    if (cleaned === '' || cleaned === '0') return '';

    // Add commas
    return parseInt(cleaned, 10).toLocaleString('en-US');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Remove all non-digit characters for parsing
    const rawValue = inputValue.replace(/\D/g, '');

    // Format with commas for display
    const formatted = formatNumberWithCommas(rawValue);
    setDisplayValue(formatted);

    // Parse to number and update parent
    const numValue = rawValue === '' ? 0 : parseInt(rawValue, 10);
    onChange(numValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const currentDisplayValue = displayValue || (value === 0 ? '' : value.toLocaleString('en-US'));

  return (
    <div className="mb-4">
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
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
          CHF
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={currentDisplayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className="
            w-full px-3 py-2 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-red-500 focus:border-red-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            pl-12
          "
        />
      </div>
    </div>
  );
}
