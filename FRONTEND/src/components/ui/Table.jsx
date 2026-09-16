import React from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { EmptyState } from './EmptyState';

/**
 * High-Contrast Government Data Table Component
 * Conforms to NIC / GIGW table presentation rules.
 */
export const Table = ({
  columns = [],
  data = [],
  keyField = 'id',
  sortColumn,
  sortDirection = 'asc',
  onSort,
  emptyMessage = 'No applications or records found in this view',
  footerSummary,
  className = ''
}) => {
  return (
    <div className={`w-full overflow-hidden border border-slate-300 rounded bg-white shadow-xs ${className}`}>
      <div className="overflow-x-auto">
        <table className="gov-table">
          <thead>
            <tr>
              {columns.map((col) => {
                const isSortable = col.sortable && onSort;
                const isCurrentSort = sortColumn === col.accessor;

                return (
                  <th
                    key={col.accessor || col.header}
                    style={{ width: col.width || 'auto' }}
                    className={`${col.className || ''} ${isSortable ? 'cursor-pointer select-none hover:bg-slate-200 transition-colors' : ''}`}
                    onClick={() => isSortable && onSort(col.accessor)}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <span>{col.header}</span>
                      {isSortable && (
                        <span className="text-slate-400">
                          {isCurrentSort ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="w-3.5 h-3.5 text-[#0c2340]" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-[#0c2340]" />
                            )
                          ) : (
                            <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-0 border-0">
                  <EmptyState
                    title="No Data Available"
                    description={emptyMessage}
                    className="border-0 rounded-none py-8"
                  />
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={row[keyField] || rowIndex} className="hover:bg-slate-50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.accessor || col.header} className={col.cellClassName || ''}>
                      {col.render ? col.render(row[col.accessor], row, rowIndex) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {footerSummary && (
        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between">
          {footerSummary}
        </div>
      )}
    </div>
  );
};

export default Table;
