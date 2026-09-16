import React from 'react';
import { APP_CONFIG } from '../../utils/constants';

export const Header = () => {
  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-xs">
      {/* Top Accessibility & National Identity Bar */}
      <div className="bg-[#0c2340] text-slate-200 text-xs py-1 px-4 sm:px-8 border-b border-[#1e3a8a]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-3">
            <span className="font-medium text-white">{APP_CONFIG.GOV_OF_INDIA_HI}</span>
            <span className="text-slate-400">|</span>
            <span>{APP_CONFIG.GOV_OF_INDIA_EN}</span>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <span>Toll-Free Helpline: <strong className="text-amber-300">{APP_CONFIG.HELPLINE}</strong></span>
            <span className="text-slate-400">|</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] font-mono text-slate-300">Phase 1 Setup</span>
          </div>
        </div>
      </div>

      {/* Main Ministry Identity Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="flex items-center gap-4">
          {/* National Emblem SVG Representation */}
          <div className="w-12 h-14 shrink-0 flex items-center justify-center bg-slate-100 border border-slate-300 rounded p-1 text-center">
            <div className="text-[10px] font-serif font-bold leading-tight text-slate-700">
              सत्यमेव जयते<br />
              <span className="text-[9px] uppercase tracking-tighter">Emblem</span>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-700 leading-tight">
              {APP_CONFIG.MINISTRY_NAME_HI}
            </h2>
            <h1 className="text-lg sm:text-xl font-bold text-[#0c2340] tracking-tight">
              {APP_CONFIG.MINISTRY_NAME_EN}
            </h1>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              {APP_CONFIG.PORTAL_NAME_EN}
            </p>
          </div>
        </div>

        {/* DBT / Digital India Badges */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="border border-slate-200 rounded px-3 py-1.5 bg-slate-50 text-right">
            <span className="text-[11px] block font-semibold text-slate-800">DBT TRIBAL INTEGRATED</span>
            <span className="text-[10px] text-slate-500">Direct Benefit Transfer</span>
          </div>
        </div>
      </div>

      {/* National Tricolor Strip */}
      <div className="tricolor-strip w-full"></div>
    </header>
  );
};
