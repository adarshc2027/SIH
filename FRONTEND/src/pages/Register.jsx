import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  PageContainer,
  SectionHeading,
  Input,
  Select,
  Checkbox,
  Button,
  Alert
} from '../components/ui';
import { UserPlus, User, Mail, Phone, Lock, FileCheck, CheckCircle2 } from 'lucide-react';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tribalCommunity: 'SANTHAL',
    password: '',
    confirmPassword: ''
  });

  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password) {
      setErrorMessage('Please fill in all mandatory fields.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('The passwords entered do not match. Please re-check.');
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (!agreed) {
      setErrorMessage('You must accept the statutory declaration before proceeding.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        tribalCommunity: formData.tribalCommunity,
        password: formData.password
      });

      // Successfully registered & authenticated -> redirect to applicant dashboard
      navigate('/applicant/dashboard', { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="Citizen Registration Portal"
      hindiTitle="नागरिक पंजीकरण"
      description="Create a digital applicant account for Ministry of Tribal Affairs (MoTA) Scholarship & Fellowship schemes."
      breadcrumbs={[{ label: 'Register', href: '/register' }]}
      maxWidth="max-w-2xl"
    >
      <div className="bg-white border border-slate-300 rounded shadow-xs p-6 space-y-5">
        <Alert variant="info" title="Scheduled Tribe (ST) Eligibility Notice">
          This portal is strictly dedicated to candidates belonging to Scheduled Tribe (ST) communities recognized by the Constitution of India. A valid digital ST Certificate is required during verification.
        </Alert>

        {errorMessage && (
          <Alert variant="error" title="Registration Error" dismissible onDismiss={() => setErrorMessage('')}>
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <SectionHeading
            title="Applicant Identity Details"
            hindiTitle="आवेदक की व्यक्तिगत जानकारी"
            subtitle="Enter details strictly matching your 10th marksheet and Aadhaar"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name of Applicant"
              name="name"
              placeholder="e.g. Birsa Munda"
              value={formData.name}
              onChange={handleChange}
              leftIcon={User}
              required
              disabled={loading}
            />
            <Select
              label="Tribal Community / Tribe"
              name="tribalCommunity"
              value={formData.tribalCommunity}
              onChange={handleChange}
              options={[
                { value: 'SANTHAL', label: 'Santhal' },
                { value: 'BHIL', label: 'Bhil' },
                { value: 'GOND', label: 'Gond' },
                { value: 'MEENA', label: 'Meena / Mina' },
                { value: 'MUNDA', label: 'Munda' },
                { value: 'BODO', label: 'Bodo' },
                { value: 'KHASI', label: 'Khasi' },
                { value: 'OTHER_ST', label: 'Other Scheduled Tribe' }
              ]}
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="applicant@example.com"
              value={formData.email}
              onChange={handleChange}
              leftIcon={Mail}
              required
              helperText="Status notifications will be dispatched here."
              disabled={loading}
            />
            <Input
              label="Mobile Number (Aadhaar linked)"
              name="phone"
              type="tel"
              placeholder="10-digit mobile number"
              value={formData.phone}
              onChange={handleChange}
              leftIcon={Phone}
              required
              helperText="Must be seeded with bank account for DBT."
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Create Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              leftIcon={Lock}
              required
              helperText="Minimum 6 characters."
              disabled={loading}
            />
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              leftIcon={Lock}
              required
              disabled={loading}
            />
          </div>

          <div className="pt-2">
            <Checkbox
              id="declaration"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              label="Statutory Declaration & Undertaking"
              description="I hereby solemnly declare that I belong to the Scheduled Tribe community. I understand that submitting false or forged certificates is an offence punishable under Section 420 and Section 468 of the Indian Penal Code."
              required
              disabled={loading}
            />
          </div>

          <div className="pt-3">
            <Button
              type="submit"
              variant="accent"
              className="w-full"
              disabled={!agreed || loading}
              isLoading={loading}
              leftIcon={UserPlus}
            >
              Complete Registration & Enter Dashboard
            </Button>
          </div>
        </form>

        <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-600">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-[#0c2340] hover:underline">
            Sign In to your existing account
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};

export default Register;
