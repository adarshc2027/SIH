import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, PhoneCall, Globe, User, UserPlus, LogOut, LayoutDashboard } from 'lucide-react';
import { APP_CONFIG } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const { user, isAuthenticated, logout, getDashboardPath } = useAuth();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState(1); // 0 = smaller, 1 = normal, 2 = larger
  const [language, setLanguage] = useState('EN'); // 'EN' | 'HI'

  const handleFontSizeChange = (level) => {
    setFontSizeLevel(level);
    const root = document.documentElement;
    if (level === 0) root.style.fontSize = '14px';
    if (level === 1) root.style.fontSize = '16px';
    if (level === 2) root.style.fontSize = '18px';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { label: 'Home', hindiLabel: 'मुख्य पृष्ठ', path: '/' },
    { label: 'Schemes', hindiLabel: 'योजनाएं', path: '/schemes' },
    { label: 'Guidelines', hindiLabel: 'दिशा-निर्देश', path: '/guidelines' },
    { label: 'Notices', hindiLabel: 'सूचनाएं', path: '/notices' },
    { label: 'Help & Support', hindiLabel: 'सहायता एवं समर्थन', path: '/help-support' }
  ];

  return (
    <header className="w-full bg-white border-b border-slate-300 select-none">
      {/* 1. TOP UTILITY & ACCESSIBILITY STRIP */}
      <div className="bg-[#0c2340] text-slate-200 text-xs py-1.5 px-4 sm:px-8 border-b border-[#1e3a8a]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* National Identity */}
          <div className="flex items-center space-x-2.5">
            <span className="font-semibold text-white tracking-wide">
              {APP_CONFIG.GOV_OF_INDIA_HI}
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-200 font-medium tracking-wide">
              {APP_CONFIG.GOV_OF_INDIA_EN}
            </span>
          </div>

          {/* Accessibility & Helpline Controls */}
          <div className="flex items-center space-x-3 text-xs">
            {/* Screen Reader Skip */}
            <a
              href="#available-schemes"
              className="text-slate-300 hover:text-white hidden lg:inline-block text-[11px] underline"
            >
              Skip to Main Content
            </a>

            <span className="text-slate-500 hidden lg:inline">|</span>

            {/* Font Resize Tools (A- / A / A+) */}
            <div className="flex items-center space-x-1 bg-[#113f67] px-1.5 py-0.5 rounded border border-[#1e4b7a]" title="Text Size Adjustment">
              <button
                type="button"
                onClick={() => handleFontSizeChange(0)}
                className={`px-1 rounded text-[11px] font-bold ${fontSizeLevel === 0 ? 'bg-amber-500 text-[#0c2340]' : 'text-slate-200 hover:text-white'}`}
                title="Decrease Font Size"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => handleFontSizeChange(1)}
                className={`px-1 rounded text-[11px] font-bold ${fontSizeLevel === 1 ? 'bg-amber-500 text-[#0c2340]' : 'text-slate-200 hover:text-white'}`}
                title="Normal Font Size"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => handleFontSizeChange(2)}
                className={`px-1 rounded text-[11px] font-bold ${fontSizeLevel === 2 ? 'bg-amber-500 text-[#0c2340]' : 'text-slate-200 hover:text-white'}`}
                title="Increase Font Size"
              >
                A+
              </button>
            </div>

            <span className="text-slate-500">|</span>

            {/* Language Toggle */}
            <button
              type="button"
              onClick={() => setLanguage(language === 'EN' ? 'HI' : 'EN')}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-200 hover:text-white cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'EN' ? 'हिन्दी' : 'English'}</span>
            </button>

            <span className="text-slate-500 hidden sm:inline">|</span>

            {/* Toll Free Helpline */}
            <div className="hidden sm:flex items-center gap-1 text-xs">
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>Helpline:</span>
              <strong className="text-amber-300 font-mono">{APP_CONFIG.HELPLINE}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MINISTRY BRANDING AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          {/* State Emblem of India (Ashoka Lion Capital) */}
          <div className="shrink-0 flex flex-col items-center justify-center p-1 bg-white border border-slate-300 rounded shadow-2xs w-13 h-16 text-center">
            <svg
              className="w-8 h-10 text-slate-800"
              viewBox="0 0 100 120"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="National Emblem of India"
            >
              <path d="M50 8 C40 8 36 16 36 24 C36 28 38 32 40 35 C32 37 26 44 26 52 C26 62 34 68 42 70 C40 73 40 77 40 82 L30 82 C28 82 26 84 26 86 L26 90 L74 90 L74 86 C74 84 72 82 70 82 L60 82 C60 77 60 73 58 70 C66 68 74 62 74 52 C74 44 68 37 60 35 C62 32 64 28 64 24 C64 16 60 8 50 8 Z" />
              <rect x="24" y="93" width="52" height="6" rx="1" />
              <circle cx="50" cy="107" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
            </svg>
            <span className="text-[7.5px] font-serif font-bold text-slate-800 leading-none mt-0.5 tracking-tight">
              सत्यमेव जयते
            </span>
          </div>

          <div>
            <h2 className="text-xs sm:text-sm font-semibold text-slate-700 leading-tight">
              {APP_CONFIG.MINISTRY_NAME_HI}
            </h2>
            <h1 className="text-base sm:text-xl font-bold text-[#0c2340] tracking-tight leading-tight">
              {APP_CONFIG.MINISTRY_NAME_EN}
            </h1>
            <p className="text-xs sm:text-sm text-[#c2410c] font-bold mt-0.5 tracking-tight">
              Scholarship & Fellowship Management System
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              (National Fellowship for ST | National Overseas Scholarship)
            </p>
          </div>
        </div>

        {/* Official Accreditations */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="border border-slate-300 rounded px-3 py-1.5 bg-slate-50 text-right">
            <span className="text-[11px] block font-bold text-[#0c2340]">DBT TRIBAL PORTAL</span>
            <span className="text-[10px] text-slate-600">Direct Benefit Transfer Compliant</span>
          </div>
          <div className="border border-slate-300 rounded px-3 py-1.5 bg-slate-50 text-right">
            <span className="text-[11px] block font-bold text-[#15803d]">DIGITAL INDIA</span>
            <span className="text-[10px] text-slate-600">Government of India</span>
          </div>
        </div>
      </div>

      {/* 3. MAIN NAVIGATION BAR */}
      <div className="bg-[#0c2340] border-t border-b border-[#113f67] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex justify-between items-center">
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors border-b-3 ${
                    isActive
                      ? 'bg-[#113f67] border-amber-400 text-white font-semibold'
                      : 'border-transparent text-slate-200 hover:bg-[#113f67]/70 hover:text-white'
                  }`
                }
              >
                {language === 'HI' ? link.hindiLabel : link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Action Buttons: Authenticated vs Unauthenticated */}
          <div className="hidden md:flex items-center space-x-2 py-1.5">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  to={getDashboardPath(user?.role)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded bg-white text-[#0c2340] hover:bg-slate-100 border border-white transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#0c2340]" />
                  <span>Dashboard ({user?.role?.replace('_', ' ')})</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded bg-[#b91c1c] text-white hover:bg-[#991b1b] border border-[#b91c1c] transition-colors cursor-pointer"
                  title="Sign Out of Session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded bg-white text-[#0c2340] hover:bg-slate-100 border border-white transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#0c2340]" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded bg-[#c2410c] text-white hover:bg-[#9a3412] border border-[#c2410c] transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center justify-between w-full py-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Navigation Menu
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded text-slate-200 hover:text-white hover:bg-[#113f67] border border-slate-600 cursor-pointer"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 4. RESPONSIVE MOBILE NAVIGATION DRAWER */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#113f67] bg-[#0c2340] px-4 py-3 space-y-2">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[#113f67] text-amber-400 font-bold'
                        : 'text-slate-200 hover:bg-[#113f67]'
                    }`
                  }
                >
                  {language === 'HI' ? link.hindiLabel : link.label}
                </NavLink>
              ))}
            </nav>

            <div className="pt-2 border-t border-[#1e4b7a] flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to={getDashboardPath(user?.role)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded bg-white text-[#0c2340] border border-white"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Go to Dashboard ({user?.role})</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded bg-[#b91c1c] text-white border border-[#b91c1c]"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded bg-white text-[#0c2340] border border-white"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded bg-[#c2410c] text-white border border-[#c2410c]"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Register / Apply</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 5. NATIONAL TRICOLOR RIBBON */}
      <div className="tricolor-strip w-full"></div>
    </header>
  );
};

export default Header;
