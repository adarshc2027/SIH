import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

/**
 * Official Government Breadcrumb Component
 */
export const Breadcrumb = ({ items = [], className = '' }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-xs text-slate-600 py-2 ${className}`}
    >
      <ol className="flex items-center space-x-1.5 flex-wrap">
        <li>
          <Link
            to="/"
            className="flex items-center text-slate-600 hover:text-[#0c2340] transition-colors"
            title="Home"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label || index} className="flex items-center space-x-1.5">
              <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
              {isLast || !item.href ? (
                <span
                  className="font-semibold text-slate-900 truncate max-w-xs"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="text-slate-600 hover:text-[#0c2340] hover:underline transition-colors truncate max-w-xs"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
