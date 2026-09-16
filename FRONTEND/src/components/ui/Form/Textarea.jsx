import React, { forwardRef } from 'react';

/**
 * Official Government Form Textarea Component
 */
export const Textarea = forwardRef(({
  label,
  name,
  rows = 4,
  maxLength,
  placeholder,
  value,
  defaultValue,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  id,
  ...props
}, ref) => {
  const textareaId = id || name || `gov-textarea-${Math.random().toString(36).substring(2, 9)}`;
  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between items-center">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-bold uppercase tracking-wider text-slate-700"
          >
            {label}
            {required && <span className="text-red-600 ml-1" title="Required field">*</span>}
          </label>
        )}
        {maxLength && (
          <span className="text-[11px] text-slate-400 font-mono">
            {currentLength} / {maxLength}
          </span>
        )}
      </div>

      <textarea
        ref={ref}
        id={textareaId}
        name={name}
        rows={rows}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full rounded border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-hidden focus:border-[#0c2340] focus:ring-1 focus:ring-[#0c2340] disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed ${
          error
            ? 'border-red-500 focus:border-red-600 focus:ring-red-500'
            : 'border-slate-300 hover:border-slate-400'
        } ${className}`}
        {...props}
      />

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
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
