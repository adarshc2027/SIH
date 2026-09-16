import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  PageContainer,
  SectionHeading,
  Input,
  Button,
  Alert
} from '../components/ui';
import { User, Lock, LogIn, ShieldAlert, KeyRound, CheckCircle2 } from 'lucide-react';

export const Login = () => {
  const { login, getDashboardPath } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Active portal tab: 'applicant' | 'official'
  const [activeTab, setActiveTab] = useState('applicant');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-fill demo credentials for easy testing
  const handleQuickFill = (demoEmail, demoPassword, role) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setActiveTab(role === 'applicant' ? 'applicant' : 'official');
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email address and password.');
      return;
    }

    setLoading(true);
    try {
      const loggedInUser = await login(email.trim(), password);

      // Check if user came from a protected route redirect
      const destination = location.state?.from?.pathname || getDashboardPath(loggedInUser.role);
      navigate(destination, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="User Authentication Portal"
      hindiTitle="उपयोगकर्ता लॉगिन"
      description="Single sign-on access point for Scheduled Tribe (ST) applicants, Verification Officers, Screening Committees, and Ministry Administrators."
      breadcrumbs={[{ label: 'Login', href: '/login' }]}
      maxWidth="max-w-xl"
    >
      <div className="bg-white border border-slate-300 rounded shadow-xs overflow-hidden">
        
        {/* Role Switcher Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => {
              setActiveTab('applicant');
              setErrorMessage('');
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-center border-b-3 transition-colors cursor-pointer ${
              activeTab === 'applicant'
                ? 'bg-white border-[#0c2340] text-[#0c2340]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Applicant Citizen Login
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('official');
              setErrorMessage('');
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-center border-b-3 transition-colors cursor-pointer ${
              activeTab === 'official'
                ? 'bg-white border-[#0c2340] text-[#0c2340]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Official Desk Login
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Official Advisory Banner */}
          <Alert variant="info" title={activeTab === 'applicant' ? 'Applicant Access Notice' : 'Official Desk Security Advisory'}>
            {activeTab === 'applicant'
              ? 'Enter your registered email address and password to manage your fellowship application.'
              : 'Authorized for Ministry of Tribal Affairs (MoTA) Scrutiny Officers, Screening Officers, and Administrators only.'}
          </Alert>

          {/* Error Message */}
          {errorMessage && (
            <Alert variant="error" title="Authentication Error" dismissible onDismiss={() => setErrorMessage('')}>
              {errorMessage}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={activeTab === 'applicant' ? 'Registered Email Address' : 'Official / NIC Email ID'}
              type="email"
              placeholder={activeTab === 'applicant' ? 'applicant@example.com' : 'officer@mota.gov.in'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={User}
              required
              disabled={loading}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={Lock}
              required
              disabled={loading}
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-[#0c2340]" />
                <span className="text-slate-600">Remember credentials on this terminal</span>
              </label>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant={activeTab === 'applicant' ? 'primary' : 'primary'}
                className="w-full"
                isLoading={loading}
                leftIcon={LogIn}
              >
                Sign In to {activeTab === 'applicant' ? 'Applicant Portal' : 'Official Desk'}
              </Button>
            </div>
          </form>

          {/* Quick Demo Test Buttons */}
          <div className="pt-3 border-t border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Quick Demonstration Accounts (Click to Fill):
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickFill('applicant@test.com', 'Password@123', 'applicant')}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-left cursor-pointer transition-colors"
              >
                <strong className="block text-[#0c2340]">Applicant</strong>
                <span className="text-[10px] text-slate-500 font-mono">applicant@test.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('verifier@mota.gov.in', 'Password@123', 'verifier')}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-left cursor-pointer transition-colors"
              >
                <strong className="block text-[#0c2340]">Verifier (Scrutiny)</strong>
                <span className="text-[10px] text-slate-500 font-mono">verifier@mota.gov.in</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('screening@mota.gov.in', 'Password@123', 'screening')}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-left cursor-pointer transition-colors"
              >
                <strong className="block text-[#0c2340]">Screening Officer</strong>
                <span className="text-[10px] text-slate-500 font-mono">screening@mota.gov.in</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('admin@mota.gov.in', 'Password@123', 'admin')}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-left cursor-pointer transition-colors"
              >
                <strong className="block text-[#0c2340]">Administrator</strong>
                <span className="text-[10px] text-slate-500 font-mono">admin@mota.gov.in</span>
              </button>
            </div>
          </div>

          {/* Bottom Link */}
          <div className="pt-2 text-center text-xs text-slate-600">
            {activeTab === 'applicant' ? (
              <p>
                Not registered yet?{' '}
                <Link to="/register" className="font-bold text-[#c2410c] hover:underline">
                  Register as an ST Candidate (AY 2026-27)
                </Link>
              </p>
            ) : (
              <p className="flex items-center justify-center gap-1 text-[11px] text-slate-500">
                <ShieldAlert className="w-3.5 h-3.5" />
                All official desk actions are monitored and digitally recorded.
              </p>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Login;
