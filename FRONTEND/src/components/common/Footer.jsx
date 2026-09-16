import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { APP_CONFIG } from '../../utils/constants';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const govLinks = [
    { label: 'Ministry of Tribal Affairs (MoTA)', url: 'https://tribal.nic.in' },
    { label: 'DBT Tribal Portal', url: 'https://dbttribal.gov.in' },
    { label: 'National Scholarship Portal (NSP)', url: 'https://scholarships.gov.in' },
    { label: 'DBT Bharat Portal', url: 'https://dbtbharat.gov.in' },
    { label: 'Digital India', url: 'https://digitalindia.gov.in' },
    { label: 'MyGov India', url: 'https://mygov.in' }
  ];

  return (
    <footer className="w-full bg-[#0c2340] text-slate-300 text-xs mt-auto border-t-4 border-[#d97706] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-700">
          {/* Col 1: Ministry Info */}
          <div className="space-y-2">
            <h3 className="text-white font-bold text-sm tracking-wide">
              {APP_CONFIG.MINISTRY_NAME_EN}
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              {APP_CONFIG.MINISTRY_NAME_HI}<br />
              Government of India<br />
              Shastri Bhawan, Dr. Rajendra Prasad Road,<br />
              New Delhi - 110001
            </p>
          </div>

          {/* Col 2: Official Helpdesk */}
          <div className="space-y-2">
            <h3 className="text-white font-bold text-sm tracking-wide">
              Helpdesk & Student Support
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Toll Free: <strong className="text-amber-400 font-mono">{APP_CONFIG.HELPLINE}</strong><br />
              Email: <span className="font-mono text-slate-300">{APP_CONFIG.SUPPORT_EMAIL}</span><br />
              Working Hours: 9:30 AM to 5:30 PM<br />
              (Monday to Friday, Gazetted Holidays Closed)
            </p>
          </div>

          {/* Col 3: Useful Portals */}
          <div className="space-y-2">
            <h3 className="text-white font-bold text-sm tracking-wide">
              Important National Portals
            </h3>
            <ul className="space-y-1 text-xs">
              {govLinks.slice(0, 4).map((link) => (
                <li key={link.label}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Compliance & Guidelines */}
          <div className="space-y-2">
            <h3 className="text-white font-bold text-sm tracking-wide flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>GIGW Compliance</span>
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              This portal is compliant with Guidelines for Indian Government Websites (GIGW 3.0) and follows STQC security norms.
            </p>
            <div className="pt-1 flex flex-wrap gap-2 text-[11px] text-slate-400">
              <Link to="/guidelines" className="hover:underline hover:text-white">Website Policies</Link>
              <span>•</span>
              <Link to="/help-support" className="hover:underline hover:text-white">Feedback</Link>
              <span>•</span>
              <Link to="/notices" className="hover:underline hover:text-white">Circulars</Link>
            </div>
          </div>
        </div>

        {/* Bottom Strip: Copyright & Disclaimer */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-slate-400 text-[11px]">
          <p className="text-center md:text-left">
            Website Content Managed by <strong>{APP_CONFIG.MINISTRY_NAME_EN}</strong>, {APP_CONFIG.GOV_OF_INDIA_EN}.
          </p>
          <div className="flex items-center space-x-3 text-[11px]">
            <span>Last Updated: <strong>September 2026</strong></span>
            <span>|</span>
            <span>NIC Hosted & STQC Audited</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
