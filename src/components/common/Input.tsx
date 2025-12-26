
import { Info } from 'lucide-react';
import { useState, useId } from 'react';

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
  const id = useId();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numValue = parseFloat(rawValue) || 0;
    onChange(numValue);
  };

  const displayValue = placeholder !== undefined && value === 0 ? '' : value;

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {tooltip && (
          <span className="group relative">
            <Info className="w-4 h-4 text-gray-400 cursor-help" />
            <span className="absolute left-0 bottom-full mb-2 hidden group-hover:block max-w-[min(16rem,calc(100vw-2rem))] w-max p-2 text-xs bg-gray-900 dark:bg-gray-700 text-white rounded shadow-lg z-10">
              {tooltip}
            </span>
          </span>
        )}
      </label>
      <div className="relative">
        {type === 'currency' && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
            CHF
          </span>
        )}
        <input
          id={id}
          type="number"
          value={displayValue}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
            bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
            focus:ring-2 focus:ring-red-500 focus:border-red-500
            disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed
            placeholder:text-gray-400 dark:placeholder:text-gray-500
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

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  tooltip?: string;
  disabled?: boolean;
}

export function NumberInput({ label, value, onChange, min = 0, max, tooltip, disabled }: NumberInputProps) {
  const id = useId();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseInt(e.target.value, 10) || 0;
    onChange(numValue);
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {tooltip && (
          <span className="group relative">
            <Info className="w-4 h-4 text-gray-400 cursor-help" />
            <span className="absolute left-0 bottom-full mb-2 hidden group-hover:block max-w-[min(16rem,calc(100vw-2rem))] w-max p-2 text-xs bg-gray-900 dark:bg-gray-700 text-white rounded shadow-lg z-10">
              {tooltip}
            </span>
          </span>
        )}
      </label>
      <input
        id={id}
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        disabled={disabled}
        className="
          w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
          bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
          focus:ring-2 focus:ring-red-500 focus:border-red-500
          disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed
        "
      />
    </div>
  );
}

export function CurrencyInput({ label, value, onChange, tooltip, disabled }: CurrencyInputProps) {
  const id = useId();
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
      <label htmlFor={id} className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {tooltip && (
          <span className="group relative">
            <Info className="w-4 h-4 text-gray-400 cursor-help" />
            <span className="absolute left-0 bottom-full mb-2 hidden group-hover:block max-w-[min(16rem,calc(100vw-2rem))] w-max p-2 text-xs bg-gray-900 dark:bg-gray-700 text-white rounded shadow-lg z-10">
              {tooltip}
            </span>
          </span>
        )}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
          CHF
        </span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={currentDisplayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className="
            w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
            bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
            focus:ring-2 focus:ring-red-500 focus:border-red-500
            disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed
            pl-12
          "
        />
      </div>
    </div>
  );
}
