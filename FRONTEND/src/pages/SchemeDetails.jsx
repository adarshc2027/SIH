import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  PageContainer,
  SectionHeading,
  Button,
  StatusBadge,
  Alert,
  LoadingState,
  ErrorState,
  Table
} from '../components/ui';
import { getSchemeByIdApi } from '../services/schemeApi';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Calendar,
  CheckCircle2,
  FileCheck,
  Award,
  BookOpen,
  Send,
  ArrowLeft,
  GraduationCap,
  Users,
  ShieldCheck,
  AlertCircle,
  Clock,
  UserPlus
} from 'lucide-react';

export const SchemeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isApplicant } = useAuth();

  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchemeDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getSchemeByIdApi(id);
        setScheme(res.data?.scheme || null);
      } catch (err) {
        setError(err.message || `Unable to load scheme details for '${id}'.`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSchemeDetails();
    }
  }, [id]);

  const handleApplyClick = () => {
    if (isAuthenticated && isApplicant) {
      navigate('/applicant/dashboard');
    } else {
      navigate('/register');
    }
  };

  if (loading) {
    return (
      <PageContainer
        title="Loading Scheme Details..."
        breadcrumbs={[{ label: 'Schemes', href: '/schemes' }, { label: 'Details' }]}
      >
        <div className="bg-white border border-slate-300 rounded p-12">
          <LoadingState
            message="योजना विवरण प्राप्त किया जा रहा है / Fetching Scheme Specifications..."
            subtext="Connecting with Ministry Scheme Master Database"
          />
        </div>
      </PageContainer>
    );
  }

  if (error || !scheme) {
    return (
      <PageContainer
        title="Scheme Specification Error"
        breadcrumbs={[{ label: 'Schemes', href: '/schemes' }, { label: 'Error' }]}
      >
        <ErrorState
          title="Scheme Not Found"
          message={error || `The requested welfare scheme '${id}' could not be retrieved.`}
          onRetry={() => window.location.reload()}
        />
        <div className="pt-4">
          <Link to="/schemes">
            <Button variant="outline" size="sm" leftIcon={ArrowLeft}>
              Back to Schemes Catalog
            </Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  // Format dates
  const startDateStr = new Date(scheme.applicationStartDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const endDateStr = new Date(scheme.applicationEndDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <PageContainer
      title={scheme.name}
      hindiTitle={scheme.hindiName}
      description={`Official scheme code: ${scheme.code} • Ministry of Tribal Affairs (MoTA), Government of India.`}
      breadcrumbs={[
        { label: 'Schemes', href: '/schemes' },
        { label: scheme.code }
      ]}
      action={
        <div className="flex items-center gap-2">
          <Link to="/schemes">
            <Button variant="outline" size="sm" leftIcon={ArrowLeft}>
              All Schemes
            </Button>
          </Link>
          <Button variant="accent" size="sm" onClick={handleApplyClick} leftIcon={UserPlus}>
            Apply for {scheme.code}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">

        {/* Top Key Metadata Strip */}
        <div className="bg-white border border-slate-300 rounded p-4 shadow-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-500 block text-[11px]">Academic Stream</span>
              <strong className="text-slate-900 text-xs sm:text-sm">{scheme.academicLevel}</strong>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-500 block text-[11px]">Annual Quota</span>
              <strong className="text-slate-900 text-xs sm:text-sm">{scheme.annualSlots}</strong>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-500 block text-[11px]">Income Ceiling</span>
              <strong className="text-slate-900 text-xs sm:text-sm">{scheme.incomeLimit}</strong>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-500 block text-[11px]">Portal Status</span>
              <div className="pt-0.5">
                <StatusBadge status={scheme.status === 'active' ? 'verified' : scheme.status} label={scheme.status === 'active' ? 'Open for AY 2026-27' : scheme.status} size="sm" />
              </div>
            </div>
          </div>
        </div>

        {/* 1. OVERVIEW */}
        <section className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-3">
          <SectionHeading
            title="1. Scheme Overview & Objectives"
            hindiTitle="योजना का संक्षिप्त विवरण एवं उद्देश्य"
            accentColor="blue"
          />
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {scheme.description}
          </p>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600">
            <strong>Funding Category:</strong> 100% Central Sector Welfare Scheme funded by the Government of India through the Ministry of Tribal Affairs (MoTA). Financial benefits are disbursed directly into student accounts via Direct Benefit Transfer (DBT).
          </div>
        </section>

        {/* 2. ELIGIBILITY */}
        <section className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-4">
          <SectionHeading
            title="2. Prescribed Eligibility Criteria"
            hindiTitle="निर्धारित पात्रता मानदंड"
            accentColor="saffron"
          />

          <div className="bg-slate-50 border border-slate-200 rounded p-4">
            {scheme.eligibilityRules && scheme.eligibilityRules.length > 0 ? (
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-800">
                {scheme.eligibilityRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 italic">No specific eligibility rules recorded.</p>
            )}
          </div>
        </section>

        {/* 3. REQUIRED DOCUMENTS */}
        <section className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-4">
          <SectionHeading
            title="3. Mandatory Supporting Documents Checklist"
            hindiTitle="आवश्यक दस्तावेजों की सूची"
            accentColor="blue"
          />

          <p className="text-xs text-slate-600">
            Scanned copies must be clearly legible and uploaded during application. Blurred or illegible documents will trigger deficiency notices.
          </p>

          <div className="overflow-x-auto">
            <table className="gov-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>S.No.</th>
                  <th>Document Name</th>
                  <th style={{ width: '130px' }}>Document Code</th>
                  <th style={{ width: '110px' }}>Requirement</th>
                  <th style={{ width: '120px' }}>Max Size</th>
                  <th style={{ width: '140px' }}>Allowed Formats</th>
                </tr>
              </thead>
              <tbody>
                {scheme.requiredDocuments && scheme.requiredDocuments.length > 0 ? (
                  scheme.requiredDocuments.map((doc, idx) => (
                    <tr key={doc.code || idx}>
                      <td className="font-mono text-center text-xs">{idx + 1}</td>
                      <td>
                        <strong className="text-slate-900 block text-xs">{doc.name}</strong>
                        {doc.description && (
                          <span className="text-[11px] text-slate-500 block">{doc.description}</span>
                        )}
                      </td>
                      <td className="font-mono text-xs font-bold text-[#0c2340]">{doc.code}</td>
                      <td>
                        {doc.isMandatory ? (
                          <span className="text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded">
                            Mandatory *
                          </span>
                        ) : (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            Optional
                          </span>
                        )}
                      </td>
                      <td className="font-mono text-xs text-slate-700">{doc.maxSizeMB} MB</td>
                      <td className="font-mono text-[11px] text-slate-600">
                        {doc.allowedFormats?.join(', ') || '.pdf'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-xs text-slate-500">
                      Standard student proofs (Caste, Admission, Bank Details) apply.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. FINANCIAL ASSISTANCE */}
        <section className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-3">
          <SectionHeading
            title="4. Financial Assistance & Quantum of Benefits"
            hindiTitle="वित्तीय सहायता एवं परिलब्धियां"
            accentColor="green"
          />

          <div className="bg-amber-50/70 border border-amber-300 rounded p-4 text-xs sm:text-sm text-slate-800 space-y-2 whitespace-pre-line leading-relaxed">
            {scheme.financialBenefits}
          </div>
        </section>

        {/* 5. APPLICATION PERIOD */}
        <section className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-3">
          <SectionHeading
            title="5. Application Schedule & Deadlines"
            hindiTitle="आवेदन समयावधि"
            accentColor="blue"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3.5 border border-slate-200 rounded flex items-center gap-3">
              <div className="p-2 bg-white border border-slate-200 rounded text-[#113f67]">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block uppercase font-bold">Portal Opening Date</span>
                <strong className="text-slate-900 text-sm">{startDateStr}</strong>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 border border-slate-200 rounded flex items-center gap-3">
              <div className="p-2 bg-white border border-slate-200 rounded text-[#c2410c]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block uppercase font-bold">Closing Deadline</span>
                <strong className="text-[#c2410c] text-sm">{endDateStr} (23:59 IST)</strong>
              </div>
            </div>
          </div>
        </section>

        {/* 6. GUIDELINES */}
        {scheme.guidelines && scheme.guidelines.length > 0 && (
          <section className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-3">
            <SectionHeading
              title="6. Operational Guidelines & Statutory Norms"
              hindiTitle="परिचालन दिशा-निर्देश"
              accentColor="saffron"
            />

            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 list-disc list-inside leading-relaxed">
              {scheme.guidelines.map((g, idx) => (
                <li key={idx}>{g}</li>
              ))}
            </ul>
          </section>
        )}

        {/* 7. HOW TO APPLY */}
        <section className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-4">
          <SectionHeading
            title="7. Step-by-Step Application Procedure"
            hindiTitle="आवेदन कैसे करें"
            accentColor="green"
          />

          {scheme.howToApply && scheme.howToApply.length > 0 ? (
            <div className="space-y-2.5">
              {scheme.howToApply.map((step, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs sm:text-sm text-slate-800 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#0c2340] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-600">
              Register on the portal, log in as an applicant, select the scheme, upload required certificates, and submit.
            </p>
          )}

          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Have questions regarding {scheme.code}? Contact the MoTA Helpdesk at <strong>1800-11-7777</strong>.
            </span>

            <Button variant="accent" size="md" onClick={handleApplyClick} leftIcon={UserPlus}>
              Apply Online for {scheme.code}
            </Button>
          </div>
        </section>

      </div>
    </PageContainer>
  );
};

export default SchemeDetails;
