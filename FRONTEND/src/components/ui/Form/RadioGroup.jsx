import React from 'react';

/**
 * Official Government Form Radio Group Component
 */
export const RadioGroup = ({
  label,
  name,
  options = [],
  value,
  defaultValue,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  direction = 'vertical',
  className = ''
}) => {
  return (
    <fieldset className={`space-y-1.5 ${className}`}>
      {label && (
        <legend className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </legend>
      )}

      <div className={`flex ${direction === 'horizontal' ? 'flex-row flex-wrap gap-5' : 'flex-col space-y-2'}`}>
        {options.map((option) => {
          const optValue = typeof option === 'object' ? option.value : option;
          const optLabel = typeof option === 'object' ? option.label : option;
          const optDesc = typeof option === 'object' ? option.description : null;
          const optId = `${name}-${optValue}`;

          const isChecked = value !== undefined ? value === optValue : undefined;

          return (
            <div key={optValue} className="flex items-start gap-2.5">
              <input
                type="radio"
                id={optId}
                name={name}
                value={optValue}
                checked={isChecked}
                defaultChecked={defaultValue === optValue}
                onChange={onChange}
                disabled={disabled}
                className="mt-0.5 h-4 w-4 border-slate-300 text-[#0c2340] focus:ring-[#0c2340] cursor-pointer disabled:cursor-not-allowed"
              />
              <div className="text-xs">
                <label
                  htmlFor={optId}
                  className="font-medium text-slate-800 cursor-pointer select-none"
                >
                  {optLabel}
                </label>
                {optDesc && (
                  <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">
                    {optDesc}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <p className="text-xs font-medium text-red-600 leading-tight">
          {error}
        </p>
      )}

      {!error && helperText && (
        <p className="text-xs text-slate-500 leading-tight">
          {helperText}
        </p>
      )}
    </fieldset>
  );
};

export default RadioGroup;
