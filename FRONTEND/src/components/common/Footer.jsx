import React from 'react';
import { APP_CONFIG } from '../../utils/constants';

export const Footer = () => {
  return (
    <footer className="w-full bg-[#0c2340] text-slate-300 text-xs mt-auto border-t-4 border-[#d97706]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-700">
          <div>
            <h3 className="text-white font-semibold text-sm mb-2">{APP_CONFIG.MINISTRY_NAME_EN}</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Shastri Bhawan, New Delhi - 110001<br />
              Government of India
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm mb-2">Helpdesk & Support</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Toll Free: {APP_CONFIG.HELPLINE}<br />
              Email: {APP_CONFIG.SUPPORT_EMAIL}<br />
              Hours: 9:30 AM to 5:30 PM (Working Days)
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm mb-2">Compliance & Security</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Designed in accordance with Guidelines for Indian Government Websites (GIGW) & STQC standards.
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-slate-400 text-[11px]">
          <p>© 2026 {APP_CONFIG.MINISTRY_NAME_EN}, {APP_CONFIG.GOV_OF_INDIA_EN}. All Rights Reserved.</p>
          <p>System Architecture: MERN Stack | Phase 1 Setup</p>
        </div>
      </div>
    </footer>
  );
};
