import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Accessible Government Modal Dialog
 * Clean white surface, deep blue header or crisp border, zero glassmorphism.
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'max-w-xl'
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`w-full ${maxWidth} bg-white border border-slate-300 rounded shadow-md flex flex-col max-h-[90vh] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#0c2340] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#1e3a8a]">
          <div>
            <h3 id="modal-title" className="text-sm sm:text-base font-bold tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-300 mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded transition cursor-pointer hover:bg-[#113f67]"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto text-sm text-slate-700 space-y-4">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex flex-wrap items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
