import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { Button } from '../Button';

/**
 * Official Government File/Document Upload Component
 * Specifically tailored for Caste Certificates, Income Proofs, Admission Letters.
 */
export const FileUpload = ({
  label,
  name,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSizeMB = 2,
  required = false,
  error,
  helperText,
  value,
  onChange,
  onRemove,
  disabled = false,
  className = ''
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleFile = (file) => {
    setLocalError('');
    if (!file) return;

    // Size check
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > maxSizeMB) {
      setLocalError(`File size (${sizeInMB.toFixed(2)} MB) exceeds the maximum allowed limit of ${maxSizeMB} MB.`);
      return;
    }

    if (onChange) {
      onChange(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const displayError = error || localError;

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            {label}
            {required && <span className="text-red-600 ml-1" title="Required document">*</span>}
          </label>
          <span className="text-[11px] text-slate-500">
            Max: {maxSizeMB}MB ({accept.replace(/\./g, ' ').toUpperCase()})
          </span>
        </div>
      )}

      {/* Upload Zone */}
      {!value ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded p-4 text-center transition-colors ${
            isDragging
              ? 'border-[#0c2340] bg-slate-50'
              : displayError
              ? 'border-red-400 bg-red-50/30'
              : 'border-slate-300 hover:border-slate-400 bg-white'
          } ${disabled ? 'bg-slate-100 cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            name={name}
            accept={accept}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
            disabled={disabled}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-[#0c2340] border border-slate-200">
              <UploadCloud className="w-5 h-5" />
            </div>

            <div className="text-xs">
              <span className="font-semibold text-[#0c2340] underline mr-1">
                Click to browse
              </span>
              <span className="text-slate-600">or drag and drop document here</span>
            </div>

            <p className="text-[11px] text-slate-500">
              Scanned copies must be clear and legible for official verification.
            </p>
          </div>
        </div>
      ) : (
        /* Selected File Card */
        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-300 rounded text-xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="p-1.5 bg-white border border-slate-200 rounded text-[#113f67] shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="font-semibold text-slate-800 truncate">
                {value.name || (typeof value === 'string' ? value : 'Attached Document')}
              </p>
              {value.size && (
                <p className="text-[11px] text-slate-500 font-mono">
                  {(value.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium">
              <CheckCircle2 className="w-3 h-3" /> Ready
            </span>
            {onRemove && !disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="p-1 text-slate-400 hover:text-red-700 rounded transition cursor-pointer"
                title="Remove attached file"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {displayError && (
        <p className="text-xs font-medium text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {displayError}
        </p>
      )}

      {!displayError && helperText && (
        <p className="text-[11px] text-slate-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
