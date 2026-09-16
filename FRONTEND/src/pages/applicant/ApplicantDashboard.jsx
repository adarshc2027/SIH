import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getMyApplicationsApi,
  checkApplicationEligibilityApi
} from '../../services/applicationApi';
import {
  uploadDocumentApi,
  getDocumentsByApplicationApi,
  deleteDocumentApi
} from '../../services/documentApi';
import {
  getMyDeficienciesApi,
  respondToDeficiencyApi
} from '../../services/deficiencyApi';
import {
  SectionHeading,
  Button,
  StatusBadge,
  Alert,
  Modal,
  Table,
  Input,
  Select,
  LoadingState,
  EligibilityCheck,
  DeficiencyTimeline
} from '../../components/ui';
import { APP_CONFIG, SCHEMES } from '../../utils/constants';
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  FolderOpen,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Download,
  Calendar,
  ShieldCheck,
  Building,
  GraduationCap,
  Eye,
  RefreshCw,
  Phone,
  Mail,
  Upload,
  Trash2
} from 'lucide-react';

export const ApplicantDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Active sidebar navigation tab: 'dashboard' | 'applications' | 'apply' | 'documents' | 'notifications' | 'profile'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Real backend applications state
  const [realApplications, setRealApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  // Real backend documents state
  const [realDocuments, setRealDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docModalType, setDocModalType] = useState('upload'); // 'upload' | 'replace' | 'resubmit'
  const [activeDocTarget, setActiveDocTarget] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  // Deficiency management state
  const [deficiencies, setDeficiencies] = useState([]);
  const [loadingDefs, setLoadingDefs] = useState(false);
  const [respondModalOpen, setRespondModalOpen] = useState(false);
  const [activeDeficiency, setActiveDeficiency] = useState(null);
  const [applicantExplanation, setApplicantExplanation] = useState('');
  const [resubmittedDocId, setResubmittedDocId] = useState('');
  const [submittingResponse, setSubmittingResponse] = useState(false);
  const [deficiencySuccess, setDeficiencySuccess] = useState('');
  const [deficiencyError, setDeficiencyError] = useState('');

  const fetchApplications = async () => {
    try {
      setLoadingApps(true);
      const res = await getMyApplicationsApi();
      if (res?.success && Array.isArray(res.data)) {
        setRealApplications(res.data);
      }
    } catch (err) {
      console.error('Failed to load real applications, falling back to records:', err);
    } finally {
      setLoadingApps(false);
    }
  };

  const fetchDeficiencies = async () => {
    try {
      setLoadingDefs(true);
      const res = await getMyDeficienciesApi();
      if (res?.success && Array.isArray(res.data?.deficiencies)) {
        setDeficiencies(res.data.deficiencies);
      }
    } catch (err) {
      console.warn('Could not fetch applicant deficiencies:', err.message);
    } finally {
      setLoadingDefs(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      setLoadingDocs(true);
      // Fetch documents for the first active application if present
      if (realApplications.length > 0) {
        const appId = realApplications[0]._id;
        const res = await getDocumentsByApplicationApi(appId);
        if (res?.success && Array.isArray(res.data?.documents)) {
          setRealDocuments(res.data.documents);
        }
      }
    } catch (err) {
      console.warn('Could not fetch real documents:', err.message);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchDeficiencies();
  }, []);

  const handleRespondToDeficiency = async (e) => {
    e.preventDefault();
    if (!activeDeficiency) return;

    try {
      setSubmittingResponse(true);
      setDeficiencyError('');
      setDeficiencySuccess('');

      const payload = {
        applicantRemarks: applicantExplanation,
        resubmittedDocumentId: resubmittedDocId || undefined
      };

      const res = await respondToDeficiencyApi(activeDeficiency._id, payload);
      if (res?.success) {
        setDeficiencySuccess('Response and undertaking submitted successfully. Application returned to scrutiny worklist.');
        setRespondModalOpen(false);
        setApplicantExplanation('');
        setResubmittedDocId('');
        fetchDeficiencies();
        fetchApplications();
      }
    } catch (err) {
      setDeficiencyError(err.response?.data?.message || 'Failed to submit deficiency response.');
    } finally {
      setSubmittingResponse(false);
    }
  };

  useEffect(() => {
    if (realApplications.length > 0) {
      fetchDocuments();
    }
  }, [realApplications]);

  // Application details modal state
  const [selectedApp, setSelectedApp] = useState(null);
  const [appEligibility, setAppEligibility] = useState(null);
  const [loadingAppEligibility, setLoadingAppEligibility] = useState(false);

  const handleOpenAppDetails = (app) => {
    setSelectedApp(app);
    setAppEligibility(null);
    if (app?.rawId) {
      setLoadingAppEligibility(true);
      checkApplicationEligibilityApi(app.rawId)
        .then((res) => {
          if (res?.data) {
            setAppEligibility(res.data);
          }
        })
        .catch((err) => {
          console.warn('Could not load application eligibility evaluation:', err.message);
        })
        .finally(() => {
          setLoadingAppEligibility(false);
        });
    } else {
      // Mock fallback evaluation for demo records
      setAppEligibility({
        eligible: true,
        overallStatus: app.status === 'deficient' ? 'manual_review' : 'passed',
        evaluatedAt: new Date().toISOString(),
        rules: [
          {
            rule: 'Scheduled Tribe (ST) Statutory Certification',
            category: 'community',
            status: app.status === 'deficient' ? 'manual_review' : 'passed',
            details: app.status === 'deficient' ? 'Officer requested re-upload of caste certificate due to blurred revenue seal.' : 'Valid ST certificate verified from State portal.',
            critical: true
          },
          {
            rule: 'Minimum Academic Performance (>= 55%)',
            category: 'academic',
            status: 'passed',
            details: 'Qualifying degree percentage 68.5% satisfies prescribed scheme rule.',
            critical: true
          },
          {
            rule: 'Confirmed University Admission / Registration',
            category: 'admission',
            status: 'passed',
            details: `Confirmed research registration at ${app.university || 'Recognized University'}.`,
            critical: true
          }
        ]
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Sample Applicant Applications fallback
  const sampleApplications = [
    {
      id: 'MOTA/NFST/2026/00142',
      schemeCode: 'NFST',
      schemeName: 'National Fellowship for Scheduled Tribe Students',
      academicLevel: 'Ph.D. in Tribal Folklore & Linguistics',
      university: 'Ranchi University, Jharkhand',
      appliedDate: '10 Sep 2026',
      status: 'deficient',
      statusLabel: 'Deficiency Raised',
      officerRemark: 'Caste Certificate seal is partially blurred. Please upload digitally verified certificate from State e-District portal.',
      deadline: '25 Sep 2026',
      lastUpdated: '15 Sep 2026, 14:30 IST'
    },
    {
      id: 'MOTA/NOS/2026/00019',
      schemeCode: 'NOS',
      schemeName: 'National Overseas Scholarship for ST Candidates',
      academicLevel: 'M.Sc. Environmental Policy',
      university: 'University of Oxford, United Kingdom',
      appliedDate: '02 Sep 2026',
      status: 'under_scrutiny',
      statusLabel: 'Under Verification',
      officerRemark: 'Admission letter QS ranking (Rank 1) and passport validity under Level-1 verification.',
      deadline: 'N/A',
      lastUpdated: '12 Sep 2026, 11:15 IST'
    },
    {
      id: 'MOTA/NFST/2025/00084',
      schemeCode: 'NFST',
      schemeName: 'National Fellowship for Scheduled Tribe Students',
      academicLevel: 'M.Phil. Tribal Studies',
      university: 'Jawaharlal Nehru University, New Delhi',
      appliedDate: '15 Aug 2025',
      status: 'sanctioned',
      statusLabel: 'Sanctioned / Active Scholar',
      officerRemark: 'Sanction Order No. MOTA/SANCTION/2025/1102. Monthly JRF DBT Active.',
      deadline: 'Completed',
      lastUpdated: '01 Aug 2026, 09:00 IST'
    }
  ];

  // Map real applications from backend into display format if available
  const formattedRealApps = realApplications.map((app) => ({
    id: app.applicationNumber || `APP-${app._id.slice(-6).toUpperCase()}`,
    rawId: app._id,
    schemeCode: app.scheme?.code || 'SCHEME',
    schemeName: app.scheme?.name || 'MoTA Welfare Scheme',
    academicLevel: app.academicDetails?.courseLevel || 'Higher Studies',
    university: app.academicDetails?.institutionName || 'Recognized University',
    appliedDate: app.submittedAt ? new Date(app.submittedAt).toLocaleDateString('en-GB') : 'Draft (Unsubmitted)',
    status: app.status === 'under_verification' ? 'under_scrutiny' : (app.status === 'deficiency_raised' ? 'deficient' : (app.status === 'selected' ? 'sanctioned' : app.status)),
    rawStatus: app.status,
    statusLabel: app.status?.replace('_', ' ').toUpperCase(),
    officerRemark: app.remarks || 'Application queued for verification.',
    deadline: 'N/A',
    lastUpdated: app.updatedAt ? new Date(app.updatedAt).toLocaleString('en-GB') : 'Recent',
    isReal: true
  }));

  const myApplications = formattedRealApps.length > 0 ? formattedRealApps : sampleApplications;

  // 1. Application Summary Counters (8 States)
  const countByStatus = (statusKey) => {
    if (formattedRealApps.length > 0) {
      return realApplications.filter((a) => a.status === statusKey).length;
    }
    const defaults = {
      draft: 1,
      submitted: 1,
      under_verification: 1,
      deficiency_raised: 1,
      verified: 2,
      under_screening: 1,
      selected: 1,
      rejected: 0
    };
    return defaults[statusKey] || 0;
  };

  const summaryCounters = [
    { label: 'Draft', hindiLabel: 'प्रारूप', count: countByStatus('draft'), status: 'draft' },
    { label: 'Submitted', hindiLabel: 'जमा किए गए', count: countByStatus('submitted'), status: 'submitted' },
    { label: 'Under Verification', hindiLabel: 'सत्यापनाधीन', count: countByStatus('under_verification'), status: 'under_scrutiny' },
    { label: 'Deficiency Raised', hindiLabel: 'आपत्ति दर्ज', count: countByStatus('deficiency_raised'), status: 'deficient' },
    { label: 'Verified', hindiLabel: 'सत्यापित', count: countByStatus('verified'), status: 'verified' },
    { label: 'Under Screening', hindiLabel: 'छंटनी प्रक्रिया', count: countByStatus('under_screening'), status: 'under_scrutiny' },
    { label: 'Selected', hindiLabel: 'चयनित / स्वीकृत', count: countByStatus('selected'), status: 'sanctioned' },
    { label: 'Rejected', hindiLabel: 'अस्वीकृत', count: countByStatus('rejected'), status: 'rejected' }
  ];

  // Sample Recent Activity Timeline
  const recentActivities = [
    {
      id: 1,
      title: 'Deficiency Raised by Scrutiny Desk',
      scheme: 'NFST 2026 (MOTA/NFST/2026/00142)',
      desc: 'Verification Officer requested re-upload of Scheduled Tribe Certificate due to blurred revenue seal.',
      time: 'Yesterday at 02:30 PM',
      type: 'warning',
      actionRequired: true
    },
    {
      id: 2,
      title: 'Document Upload Acknowledged',
      scheme: 'NOS 2026 (MOTA/NOS/2026/00019)',
      desc: 'Foreign University Unconditional Offer Letter and IELTS Scorecard accepted into verification queue.',
      time: '12 Sep 2026, 11:15 AM',
      type: 'info',
      actionRequired: false
    },
    {
      id: 3,
      title: 'Aadhaar e-KYC Validation Successful',
      scheme: 'National ST Scholar Registry',
      desc: 'Demographic match between Aadhaar UIDAI records and Matriculation Certificate verified.',
      time: '10 Sep 2026, 10:05 AM',
      type: 'success',
      actionRequired: false
    },
    {
      id: 4,
      title: 'Quarterly Fellowship Disbursed via DBT',
      scheme: 'NFST 2025 (MOTA/NFST/2025/00084)',
      desc: 'Amount of ₹1,11,000 (3 months JRF) credited to Aadhaar-seeded Bank Account (SBIN***4821).',
      time: '01 Sep 2026, 09:00 AM',
      type: 'success',
      actionRequired: false
    }
  ];

  // Sample Uploaded Documents
  const uploadedDocuments = [
    {
      docName: 'Scheduled Tribe (ST) Certificate',
      certNo: 'JH/ST/2023/88194',
      issuingAuthority: 'Sub-Divisional Officer (SDO), Dumka',
      uploadDate: '10 Sep 2026',
      status: 'deficient',
      fileName: 'caste_cert_scanned.pdf',
      fileSize: '1.2 MB'
    },
    {
      docName: 'University Admission & Guide Endorsement',
      certNo: 'RU/PHD/REG/2026/110',
      issuingAuthority: 'Registrar, Ranchi University',
      uploadDate: '10 Sep 2026',
      status: 'verified',
      fileName: 'admission_letter_signed.pdf',
      fileSize: '840 KB'
    },
    {
      docName: 'Annual Family Income Certificate',
      certNo: 'INC/2026/04112',
      issuingAuthority: 'Circle Officer (CO), Dumka',
      uploadDate: '10 Sep 2026',
      status: 'verified',
      fileName: 'income_cert_2026.pdf',
      fileSize: '650 KB'
    },
    {
      docName: 'Aadhaar Card & Bank Passbook Copy',
      certNo: 'Aadhaar: ****-****-9124',
      issuingAuthority: 'UIDAI / State Bank of India',
      uploadDate: '10 Sep 2026',
      status: 'verified',
      fileName: 'aadhaar_bank_passbook.pdf',
      fileSize: '1.8 MB'
    }
  ];

  // Sample Notifications
  const notifications = [
    {
      id: 'N1',
      title: 'Action Required: Re-upload Caste Certificate',
      date: '15 Sep 2026',
      priority: 'HIGH',
      content: 'A deficiency has been raised on your NFST application. The scanned copy of your ST certificate is illegible. Please upload a clear copy before 25 Sep 2026.'
    },
    {
      id: 'N2',
      title: 'National Overseas Scholarship (NOS) Screening Schedule',
      date: '10 Sep 2026',
      priority: 'NORMAL',
      content: 'The Screening Committee for NOS 2026 will convene in October. Please verify that your passport validity extends beyond December 2027.'
    },
    {
      id: 'N3',
      title: 'Aadhaar-DBT Seeding Confirmation',
      date: '02 Sep 2026',
      priority: 'NORMAL',
      content: 'Your State Bank of India account has been verified as active for Direct Benefit Transfer under Central Government welfare portals.'
    }
  ];

  // Navigation Items
  const openDefsCount = deficiencies.filter((d) => d.status === 'open').length;
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', hindi: 'डैशबोर्ड', icon: LayoutDashboard },
    { id: 'applications', label: 'My Applications', hindi: 'मेरे आवेदन', icon: FileText, badge: myApplications.length },
    { id: 'deficiencies', label: 'Deficiencies', hindi: 'कमियां / सुधार', icon: AlertTriangle, badge: openDefsCount > 0 ? `${openDefsCount} Action` : null },
    { id: 'apply', label: 'Apply for Scheme', hindi: 'नया आवेदन', icon: FilePlus },
    { id: 'documents', label: 'Document Repository', hindi: 'दस्तावेज़ भंडार', icon: FolderOpen },
    { id: 'notifications', label: 'Notifications', hindi: 'सूचनाएं', icon: Bell, badge: '1 Action' },
    { id: 'profile', label: 'Scholar Profile', hindi: 'प्रोफ़ाइल', icon: User }
  ];

  return (
    <div className="w-full min-h-[calc(100vh-200px)] bg-[#f8fafc] select-none">
      
      {/* Top Mobile Bar */}
      <div className="md:hidden bg-[#0c2340] text-white px-4 py-2.5 flex items-center justify-between border-b border-[#113f67]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded bg-[#113f67] text-white hover:bg-[#1e4b7a] cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-bold text-xs">Applicant Citizen Portal</span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="text-xs text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* ================= SIDEBAR (3 COLS) ================= */}
          <aside
            className={`md:col-span-3 bg-white border border-slate-300 rounded shadow-xs overflow-hidden ${
              mobileSidebarOpen ? 'block mb-4' : 'hidden md:block'
            }`}
          >
            {/* Scholar Identity Card in Sidebar */}
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-[#0c2340] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="truncate">
                  <h3 className="text-xs font-bold text-slate-900 truncate">
                    {user?.name || 'Applicant Scholar'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Tribe:</span>
                <span className="font-bold text-[#0c2340]">
                  {user?.tribalCommunity || 'ST Category'}
                </span>
              </div>
            </div>

            {/* Sidebar Navigation Links */}
            <nav className="p-2 space-y-1" aria-label="Applicant Sidebar">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold transition-colors cursor-pointer text-left ${
                      isActive
                        ? 'bg-[#0c2340] text-white'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-[#0c2340]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                          isActive
                            ? 'bg-amber-400 text-[#0c2340] font-bold'
                            : typeof item.badge === 'string'
                            ? 'bg-orange-100 text-orange-800 border border-orange-200'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Logout Button */}
              <div className="pt-2 mt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span>Logout Session</span>
                </button>
              </div>
            </nav>

            {/* Helpline Advisory Box */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600 space-y-1">
              <span className="font-bold text-[#0c2340] block uppercase tracking-wider text-[10px]">
                Support Helpline
              </span>
              <p>Toll Free: <strong className="text-amber-800">{APP_CONFIG.HELPLINE}</strong></p>
              <p>Email: <span className="font-mono text-slate-700">{APP_CONFIG.SUPPORT_EMAIL}</span></p>
            </div>
          </aside>

          {/* ================= MAIN CONTENT AREA (9 COLS) ================= */}
          <main className="md:col-span-9 space-y-6">
            
            {/* 1. WELCOME MESSAGE BANNER */}
            <div className="bg-white border border-slate-300 rounded p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Applicant Citizen Portal
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500">AY 2026-27</span>
                </div>

                <h1 className="text-lg sm:text-xl font-bold text-[#0c2340] tracking-tight mt-0.5">
                  Welcome, {user?.name || 'Scholar'}
                </h1>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Ministry of Tribal Affairs (MoTA) • Central Sector Fellowship & Scholarship Management System
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <StatusBadge status="verified" label="Aadhaar DBT Ready" size="sm" />
                <span className="text-[11px] font-mono text-slate-500 bg-slate-100 border border-slate-200 px-2 py-1 rounded">
                  {user?.tribalCommunity || 'ST Scholar'}
                </span>
              </div>
            </div>

            {/* ================= TAB CONTENT SWITCHER ================= */}
            {activeTab === 'dashboard' && (
              <>
                {/* Urgent Action Alert if Deficiency Exists */}
                <Alert
                  variant="warning"
                  title="Action Required: Deficiency Notice Issued"
                  dismissible
                >
                  Verification Officer has requested a re-upload of your <strong>Scheduled Tribe Certificate</strong> for Application ID <strong>MOTA/NFST/2026/00142</strong>. Please submit the clear document before <strong>25 Sep 2026</strong> to prevent disqualification.
                </Alert>

                {/* 2. APPLICATION SUMMARY (8 RESTRAINED STATISTIC CARDS) */}
                <div className="bg-white border border-slate-300 rounded p-5 shadow-xs space-y-3">
                  <SectionHeading
                    title="Application Summary"
                    hindiTitle="आवेदन स्थिति सारांश"
                    subtitle="Current status of submissions across all MoTA welfare schemes"
                    accentColor="blue"
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {summaryCounters.map((stat) => (
                      <div
                        key={stat.label}
                        className="bg-slate-50 border border-slate-300 rounded p-3 text-center space-y-0.5 hover:border-slate-400 transition-colors shadow-2xs"
                      >
                        <span className="text-xl sm:text-2xl font-bold font-mono text-[#0c2340] block">
                          {stat.count < 10 ? `0${stat.count}` : stat.count}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 truncate">
                          {stat.label}
                        </h4>
                        <p className="text-[10px] text-slate-500 truncate">
                          {stat.hindiLabel}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. QUICK ACTION BUTTONS */}
                <div className="bg-white border border-slate-300 rounded p-5 shadow-xs space-y-3">
                  <SectionHeading
                    title="Quick Services"
                    hindiTitle="त्वरित सेवाएं"
                    subtitle="Frequently accessed applicant tools and application management"
                    accentColor="saffron"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Button
                      variant="accent"
                      size="md"
                      onClick={() => setActiveTab('apply')}
                      leftIcon={FilePlus}
                      className="w-full justify-center"
                    >
                      Start New Application
                    </Button>

                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => setActiveTab('applications')}
                      leftIcon={FileText}
                      className="w-full justify-center"
                    >
                      View My Applications
                    </Button>

                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => setActiveTab('notifications')}
                      leftIcon={Bell}
                      className="w-full justify-center"
                    >
                      View Notifications (1)
                    </Button>
                  </div>
                </div>

                {/* 4. APPLICATION STATUS SECTION (ACTIVE WORKLIST) */}
                <div className="bg-white border border-slate-300 rounded p-5 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#0c2340]">
                        Active Application Status & Milestones
                      </h3>
                      <p className="text-xs text-slate-500">
                        Detailed tracking of submitted fellowship and overseas scholarship forms
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('applications')}
                    >
                      View All Applications
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {myApplications.slice(0, 2).map((app) => (
                      <div
                        key={app.id}
                        className={`border rounded p-4 text-xs space-y-3 ${
                          app.status === 'deficient'
                            ? 'border-orange-300 bg-orange-50/30'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-[#0c2340] text-sm">
                              {app.id}
                            </span>
                            <StatusBadge status={app.status} label={app.statusLabel} size="sm" />
                            <span className="text-slate-400">|</span>
                            <span className="text-slate-500">Applied: {app.appliedDate}</span>
                          </div>

                          <span className="text-[11px] text-slate-500">
                            Updated: {app.lastUpdated}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200">
                          <div>
                            <span className="text-slate-500 block text-[11px]">Scheme:</span>
                            <strong className="text-slate-900">{app.schemeName} ({app.schemeCode})</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[11px]">Course & University:</span>
                            <span>{app.academicLevel} • {app.university}</span>
                          </div>
                        </div>

                        {/* Officer Remark & Deadline */}
                        {app.officerRemark && (
                          <div className={`p-2.5 rounded text-xs flex items-start gap-2 ${
                            app.status === 'deficient'
                              ? 'bg-orange-100/70 border border-orange-200 text-orange-950'
                              : 'bg-blue-50 border border-blue-200 text-blue-950'
                          }`}>
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <strong>Official Remark:</strong> {app.officerRemark}
                              {app.deadline !== 'N/A' && app.deadline !== 'Completed' && (
                                <span className="block text-[11px] font-bold text-red-700 mt-0.5">
                                  Resubmission Deadline: {app.deadline}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-slate-200">
                          {app.rawStatus === 'draft' && (
                            <Button
                              variant="accent"
                              size="sm"
                              onClick={() => navigate(`/applicant/apply/${app.schemeCode}`)}
                              leftIcon={FilePlus}
                            >
                              Resume Draft Application
                            </Button>
                          )}

                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenAppDetails(app)}
                            leftIcon={Eye}
                          >
                            View Full Details
                          </Button>

                          {app.status === 'deficient' && (
                            <Button
                              variant="accent"
                              size="sm"
                              onClick={() => setActiveTab('documents')}
                              leftIcon={FilePlus}
                            >
                              Resolve Deficiency / Re-upload
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. RECENT ACTIVITY SECTION */}
                <div className="bg-white border border-slate-300 rounded p-5 shadow-xs space-y-4">
                  <SectionHeading
                    title="Recent Portal Activity & Audit Timeline"
                    hindiTitle="हाल की गतिविधियाँ"
                    subtitle="Chronological audit log of events, document verifications, and disbursements"
                    accentColor="green"
                  />

                  <div className="relative pl-6 space-y-5 border-l-2 border-slate-200 ml-2">
                    {recentActivities.map((act) => (
                      <div key={act.id} className="relative text-xs space-y-1">
                        {/* Timeline Node Dot */}
                        <div className={`absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          act.type === 'warning'
                            ? 'bg-amber-500 ring-2 ring-amber-200'
                            : act.type === 'success'
                            ? 'bg-emerald-600 ring-2 ring-emerald-200'
                            : 'bg-[#113f67] ring-2 ring-blue-200'
                        }`}></div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                            {act.title}
                          </h4>
                          <span className="text-[11px] font-mono text-slate-500">
                            {act.time}
                          </span>
                        </div>

                        <span className="inline-block bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded text-[10px] font-medium border border-slate-200">
                          {act.scheme}
                        </span>

                        <p className="text-slate-600 leading-relaxed">
                          {act.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ================= TAB: MY APPLICATIONS ================= */}
            {activeTab === 'applications' && (
              <div className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-5">
                <SectionHeading
                  title="My Submitted Applications"
                  hindiTitle="मेरे आवेदन पत्र"
                  subtitle="Archive of all fellowship applications submitted under Ministry of Tribal Affairs schemes"
                  accentColor="blue"
                  action={
                    <Button variant="accent" size="sm" onClick={() => setActiveTab('apply')} leftIcon={FilePlus}>
                      Apply for New Scheme
                    </Button>
                  }
                />

                <div className="space-y-4">
                  {myApplications.map((app) => (
                    <div key={app.id} className="border border-slate-300 rounded p-4 space-y-3 bg-white">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#0c2340] text-sm">{app.id}</span>
                          <StatusBadge status={app.status} label={app.statusLabel} size="sm" />
                        </div>
                        <span className="text-xs text-slate-500">Submitted: {app.appliedDate}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-slate-500 block text-[11px]">Scheme:</span>
                          <strong className="text-slate-900">{app.schemeName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px]">Stream:</span>
                          <span>{app.academicLevel}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px]">University / Institution:</span>
                          <span>{app.university}</span>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                        <Button variant="outline" size="sm" leftIcon={Download} onClick={() => alert('Downloading official submission receipt')}>
                          Download PDF Slip
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => handleOpenAppDetails(app)}>
                          View Timeline & Audit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB: DEFICIENCIES & ACTIONS ================= */}
            {activeTab === 'deficiencies' && (
              <div className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-5">
                <SectionHeading
                  title="Statutory Deficiencies & Rectification Desk"
                  hindiTitle="कमियां और दस्तावेज सुधार"
                  subtitle="Official discrepancy notices issued by Scrutiny Desks requiring your response or document resubmission"
                  accentColor="saffron"
                />

                {deficiencySuccess && (
                  <Alert variant="success" onClose={() => setDeficiencySuccess('')}>
                    {deficiencySuccess}
                  </Alert>
                )}

                {deficiencyError && (
                  <Alert variant="error" onClose={() => setDeficiencyError('')}>
                    {deficiencyError}
                  </Alert>
                )}

                {deficiencies.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-slate-800 text-sm">No Deficiencies Raised</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      All your submitted applications and uploaded documents are currently verified or undergoing regular scrutiny without any discrepancy notices.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deficiencies.map((def) => {
                      const isPendingAction = def.status === 'open';
                      return (
                        <div
                          key={def._id}
                          className={`border rounded p-5 space-y-4 shadow-2xs ${
                            isPendingAction
                              ? 'border-orange-300 bg-orange-50/20 ring-1 ring-orange-200'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-900 text-sm">
                                  {def.reason}
                                </h4>
                                <StatusBadge status={def.status} size="sm" />
                              </div>
                              <p className="text-xs text-slate-500 font-mono">
                                App No: {def.application?.applicationNumber || 'MOTA Fellowship'} • Category: {def.documentType || 'Statutory Discrepancy'}
                              </p>
                            </div>

                            <div className="text-right">
                              <span className="text-[11px] text-red-700 font-bold font-mono block">
                                Deadline: {new Date(def.deadline).toLocaleDateString('en-IN')}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                Raised by: {def.raisedByName || 'Scrutiny Officer'}
                              </span>
                            </div>
                          </div>

                          <div className="text-xs space-y-2 text-slate-700">
                            <div>
                              <strong className="text-slate-900 block text-[11px]">Officer Finding / Reason:</strong>
                              <p className="bg-slate-50 p-2.5 rounded border border-slate-200 mt-0.5 leading-relaxed">
                                {def.description}
                              </p>
                            </div>

                            <div>
                              <strong className="text-amber-900 block text-[11px]">Required Corrective Action:</strong>
                              <p className="bg-amber-50 text-amber-950 p-2.5 rounded border border-amber-200 mt-0.5 leading-relaxed">
                                {def.requiredAction}
                              </p>
                            </div>

                            {/* Applicant previous response if already answered */}
                            {def.applicantRemarks && (
                              <div className="bg-blue-50/70 border border-blue-200 rounded p-2.5 space-y-1">
                                <div className="flex items-center justify-between text-[11px]">
                                  <strong className="text-[#0c2340]">Your Submitted Response:</strong>
                                  <span className="font-mono text-slate-500">
                                    {new Date(def.respondedAt).toLocaleDateString('en-IN')}
                                  </span>
                                </div>
                                <p className="text-slate-800 leading-relaxed">
                                  {def.applicantRemarks}
                                </p>
                              </div>
                            )}

                            {/* Officer Resolution remarks if resolved */}
                            {def.officerResolutionRemarks && (
                              <div className="bg-emerald-50 border border-emerald-200 rounded p-2.5 text-xs text-emerald-950">
                                <strong>Resolution Note from Ministry:</strong> {def.officerResolutionRemarks}
                              </div>
                            )}
                          </div>

                          {/* 5-Step Visual Timeline */}
                          <DeficiencyTimeline deficiency={def} />

                          {/* Action Button for Applicant */}
                          {isPendingAction && (
                            <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                              <Button
                                variant="accent"
                                size="sm"
                                onClick={() => {
                                  setActiveDeficiency(def);
                                  setApplicantExplanation('');
                                  setResubmittedDocId('');
                                  setRespondModalOpen(true);
                                }}
                              >
                                Respond & Resubmit Document
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ================= TAB: APPLY FOR SCHEME ================= */}
            {activeTab === 'apply' && (
              <div className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-5">
                <SectionHeading
                  title="Apply for MoTA Scholarship / Fellowship"
                  hindiTitle="नवीन योजना हेतु आवेदन करें"
                  subtitle="Select a scheme below to initiate the digital application process for AY 2026-27"
                  accentColor="saffron"
                />

                <Alert variant="info" title="Application Prerequisite Reminder">
                  Ensure you possess scanned PDF copies of: (1) Scheduled Tribe (ST) Certificate, (2) University Admission Letter, (3) Family Income Certificate, and (4) Aadhaar-seeded Bank Passbook before beginning.
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <div className="border border-slate-300 border-l-4 border-l-[#0c2340] rounded p-5 space-y-3 bg-white shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#113f67]">CODE: NFST</span>
                      <StatusBadge status="verified" label="Open" size="sm" />
                    </div>

                    <h3 className="text-base font-bold text-[#0c2340]">
                      National Fellowship for Scheduled Tribe Students (NFST)
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      For ST candidates enrolled in regular M.Phil. and Ph.D. programs at recognized Indian universities. 750 slots available annually.
                    </p>

                    <div className="pt-2">
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                        onClick={() => navigate('/applicant/apply/NFST')}
                      >
                        Start NFST Application (AY 2026-27)
                      </Button>
                    </div>
                  </div>

                  <div className="border border-slate-300 border-l-4 border-l-[#c2410c] rounded p-5 space-y-3 bg-white shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#c2410c]">CODE: NOS</span>
                      <StatusBadge status="verified" label="Open" size="sm" />
                    </div>

                    <h3 className="text-base font-bold text-[#0c2340]">
                      National Overseas Scholarship (NOS)
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      For meritorious ST scholars pursuing Masters, Ph.D. and Post-Doctoral studies in Top 500 QS ranked foreign universities.
                    </p>

                    <div className="pt-2">
                      <Button
                        variant="accent"
                        size="sm"
                        className="w-full"
                        onClick={() => navigate('/applicant/apply/NOS')}
                      >
                        Start NOS Application (AY 2026-27)
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB: DOCUMENTS ================= */}
            {activeTab === 'documents' && (
              <div className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-5">
                <SectionHeading
                  title="Document Repository & Verification Status"
                  hindiTitle="दस्तावेज़ भंडार"
                  subtitle="Central digital locker of uploaded statutory certificates and verification logs"
                  accentColor="blue"
                  action={
                    realApplications.length > 0 && (
                      <Button
                        variant="accent"
                        size="sm"
                        leftIcon={Upload}
                        onClick={() => {
                          setDocModalType('upload');
                          setActiveDocTarget(null);
                          setUploadFile(null);
                          setUploadError('');
                          setUploadSuccess('');
                          setDocModalOpen(true);
                        }}
                      >
                        Upload Additional Document
                      </Button>
                    )
                  }
                />

                {uploadSuccess && (
                  <Alert variant="success" onClose={() => setUploadSuccess('')}>
                    {uploadSuccess}
                  </Alert>
                )}

                {/* Statutory Guidelines Notice */}
                <Alert variant="info" title="Statutory Document Guidelines">
                  As mandated under GIGW standards, documents must be original scans in PDF, JPG, or PNG format with a maximum size of 5 MB. Ensure digital signatures or government seals are unblurred.
                </Alert>

                {/* Official Documents Table */}
                <div className="overflow-x-auto border border-slate-300 rounded bg-white">
                  <table className="gov-table w-full text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-semibold text-left">
                        <th className="p-3">Document</th>
                        <th className="p-3 text-center">Required</th>
                        <th className="p-3">Uploaded File</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-center">Verification</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {/* Real Documents If Present */}
                      {realDocuments.length > 0 ? (
                        realDocuments.map((doc) => {
                          const isDeficient = doc.status === 'deficient' || doc.verificationStatus === 'deficient';
                          const isVerified = doc.status === 'verified' || doc.verificationStatus === 'verified';

                          return (
                            <tr key={doc._id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3 font-semibold text-[#0c2340]">
                                {doc.documentName}
                                <span className="block text-[10px] text-slate-500 font-mono">
                                  CODE: {doc.documentType}
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-[11px] font-medium">
                                  Mandatory
                                </span>
                              </td>
                              <td className="p-3">
                                <div className="font-mono text-slate-800 text-[11px] flex items-center gap-1.5">
                                  <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                  <span className="truncate max-w-[180px]">{doc.fileName}</span>
                                </div>
                                <span className="text-[10px] text-slate-500 block">
                                  {doc.fileSizeMB} MB • {new Date(doc.uploadedAt).toLocaleDateString('en-GB')}
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                <StatusBadge status={doc.status} label={doc.status.toUpperCase()} size="sm" />
                              </td>
                              <td className="p-3 text-center">
                                <StatusBadge
                                  status={doc.verificationStatus === 'verified' ? 'verified' : (doc.verificationStatus === 'deficient' ? 'deficient' : 'pending')}
                                  label={doc.verificationStatus ? doc.verificationStatus.toUpperCase() : 'PENDING'}
                                  size="sm"
                                />
                              </td>
                              <td className="p-3 text-right space-x-1 whitespace-nowrap">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  leftIcon={Eye}
                                  onClick={() => window.open(doc.fileUrl, '_blank')}
                                >
                                  View
                                </Button>

                                {isDeficient ? (
                                  <Button
                                    variant="accent"
                                    size="sm"
                                    leftIcon={FilePlus}
                                    onClick={() => {
                                      setActiveDocTarget(doc);
                                      setDocModalType('resubmit');
                                      setUploadFile(null);
                                      setUploadError('');
                                      setDocModalOpen(true);
                                    }}
                                  >
                                    Resubmit
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    leftIcon={Upload}
                                    onClick={() => {
                                      setActiveDocTarget(doc);
                                      setDocModalType('replace');
                                      setUploadFile(null);
                                      setUploadError('');
                                      setDocModalOpen(true);
                                    }}
                                  >
                                    Replace
                                  </Button>
                                )}

                                {doc.status !== 'verified' && (
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    leftIcon={Trash2}
                                    onClick={async () => {
                                      if (confirm(`Remove ${doc.documentName}?`)) {
                                        try {
                                          await deleteDocumentApi(doc._id);
                                          fetchDocuments();
                                          setUploadSuccess('Document removed successfully.');
                                        } catch (e) {
                                          alert(e.message || 'Could not delete document');
                                        }
                                      }
                                    }}
                                  />
                                )}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        /* Pre-populated standard statutory requirements if no custom files uploaded yet */
                        uploadedDocuments.map((doc, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 font-semibold text-[#0c2340]">
                              {doc.docName}
                              <span className="block text-[10px] text-slate-500 font-mono">
                                Cert No: {doc.certNo}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-[11px] font-medium">
                                Mandatory
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="font-mono text-slate-800 text-[11px] flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                <span>{doc.fileName}</span>
                              </div>
                              <span className="text-[10px] text-slate-500 block">
                                {doc.fileSize} • {doc.uploadDate}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <StatusBadge status={doc.status} size="sm" />
                            </td>
                            <td className="p-3 text-center">
                              <StatusBadge
                                status={doc.status === 'verified' ? 'verified' : (doc.status === 'deficient' ? 'deficient' : 'pending')}
                                size="sm"
                              />
                            </td>
                            <td className="p-3 text-right space-x-1 whitespace-nowrap">
                              <Button
                                variant="secondary"
                                size="sm"
                                leftIcon={Eye}
                                onClick={() => alert(`Opening digital viewer for ${doc.fileName}`)}
                              >
                                View
                              </Button>
                              {doc.status === 'deficient' ? (
                                <Button
                                  variant="accent"
                                  size="sm"
                                  leftIcon={FilePlus}
                                  onClick={() => {
                                    setActiveDocTarget({
                                      documentType: 'CASTE_CERT',
                                      documentName: doc.docName
                                    });
                                    setDocModalType('resubmit');
                                    setUploadFile(null);
                                    setUploadError('');
                                    setDocModalOpen(true);
                                  }}
                                >
                                  Resubmit
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  leftIcon={Upload}
                                  onClick={() => {
                                    setActiveDocTarget({
                                      documentType: 'INCOME_CERT',
                                      documentName: doc.docName
                                    });
                                    setDocModalType('replace');
                                    setUploadFile(null);
                                    setUploadError('');
                                    setDocModalOpen(true);
                                  }}
                                >
                                  Replace
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ================= TAB: NOTIFICATIONS ================= */}
            {activeTab === 'notifications' && (
              <div className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-5">
                <SectionHeading
                  title="Official Notifications & Alerts"
                  hindiTitle="आधिकारिक सूचनाएं"
                  subtitle="Direct communications dispatched from MoTA Scrutiny and Screening Desks"
                  accentColor="saffron"
                />

                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`border rounded p-4 text-xs space-y-1.5 ${
                        notif.priority === 'HIGH'
                          ? 'border-orange-300 bg-orange-50/50'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            notif.priority === 'HIGH' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {notif.priority}
                          </span>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{notif.title}</h4>
                        </div>
                        <span className="font-mono text-[11px] text-slate-500">{notif.date}</span>
                      </div>

                      <p className="text-slate-600 leading-relaxed">
                        {notif.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB: PROFILE ================= */}
            {activeTab === 'profile' && (
              <div className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-6">
                <SectionHeading
                  title="Scholar Profile & Demographic Record"
                  hindiTitle="अध्येता विवरण"
                  subtitle="Aadhaar-authenticated citizen master record under Ministry of Tribal Affairs"
                  accentColor="blue"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1">
                    <span className="text-slate-500 block text-[11px]">Full Name</span>
                    <strong className="text-slate-900 text-sm">{user?.name}</strong>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1">
                    <span className="text-slate-500 block text-[11px]">Scheduled Tribe Community</span>
                    <strong className="text-slate-900 text-sm">{user?.tribalCommunity || 'ST Category'}</strong>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1">
                    <span className="text-slate-500 block text-[11px]">Registered Email Address</span>
                    <span className="font-mono text-slate-800">{user?.email}</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1">
                    <span className="text-slate-500 block text-[11px]">Mobile Number (DBT Linked)</span>
                    <span className="font-mono text-slate-800">{user?.phone}</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1">
                    <span className="text-slate-500 block text-[11px]">Aadhaar Seeding Status</span>
                    <span className="text-emerald-700 font-semibold">Active & Mapped (NPCI)</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1">
                    <span className="text-slate-500 block text-[11px]">User Account Role</span>
                    <span className="font-bold text-[#c2410c] uppercase">{user?.role}</span>
                  </div>
                </div>

                <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded text-xs text-slate-700 space-y-1">
                  <h5 className="font-bold text-amber-950">Aadhaar Data Protection Policy</h5>
                  <p className="leading-relaxed">
                    Personal demographic records are encrypted in compliance with the Aadhaar (Targeted Delivery of Financial and other Subsidies, Benefits and Services) Act, 2016. Any modifications to legal names or tribal certificates require administrative review.
                  </p>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* ================= MODAL: APPLICATION FULL TIMELINE DETAILS ================= */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title={selectedApp ? `Application: ${selectedApp.id}` : ''}
        subtitle={selectedApp?.schemeName}
        maxWidth="max-w-2xl"
        footer={
          <Button variant="primary" size="sm" onClick={() => setSelectedApp(null)}>
            Close Details
          </Button>
        }
      >
        {selectedApp && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <span className="text-[11px] text-slate-500 block">Current Stage:</span>
                <StatusBadge status={selectedApp.status} label={selectedApp.statusLabel} />
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Applied On:</span>
                <span className="font-mono font-semibold text-slate-800">{selectedApp.appliedDate}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#0c2340] uppercase tracking-wider text-[11px]">
                Enrolled Course & Institution
              </h4>
              <p className="bg-slate-50 p-3 border border-slate-200 rounded text-slate-700">
                <strong>Course:</strong> {selectedApp.academicLevel}<br />
                <strong>Institution:</strong> {selectedApp.university}
              </p>
            </div>

            {selectedApp.officerRemark && (
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-amber-900 uppercase tracking-wider text-[11px]">
                  Scrutiny Desk Remarks
                </h4>
                <div className="bg-amber-50/70 p-3 border border-amber-200 rounded text-slate-800 leading-relaxed">
                  {selectedApp.officerRemark}
                </div>
              </div>
            )}

            {/* Assistive Scheme Eligibility Assessment */}
            <div className="pt-2">
              <EligibilityCheck assessment={appEligibility} loading={loadingAppEligibility} />
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#0c2340] uppercase tracking-wider text-[11px]">
                Verification Timeline
              </h4>
              <ul className="space-y-2 border-l-2 border-slate-200 pl-4 text-slate-600">
                <li>
                  <strong className="text-slate-800">10 Sep 2026:</strong> Form submitted by applicant with digital undertaking.
                </li>
                <li>
                  <strong className="text-slate-800">12 Sep 2026:</strong> Document classification & OCR assistive pass executed.
                </li>
                <li>
                  <strong className="text-slate-800">15 Sep 2026:</strong> Level-1 Scrutiny Officer reviewed caste certificate and logged deficiency note.
                </li>
              </ul>
            </div>
          </div>
        )}
      </Modal>

      {/* Document Action Modal (Upload / Replace / Resubmit) */}
      <Modal
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        title={
          docModalType === 'resubmit'
            ? 'Resubmit Deficient Document'
            : docModalType === 'replace'
            ? 'Replace Existing Document'
            : 'Upload Supporting Document'
        }
        subtitle={activeDocTarget ? `${activeDocTarget.documentName} (${activeDocTarget.documentType})` : 'Ministry of Tribal Affairs Document Portal'}
        maxWidth="max-w-lg"
      >
        <div className="space-y-4 text-xs">
          {uploadError && (
            <Alert variant="danger" onClose={() => setUploadError('')}>
              {uploadError}
            </Alert>
          )}

          {docModalType === 'resubmit' && (
            <Alert variant="warning" title="Deficiency Resolution Protocol">
              Please ensure this replacement document is sharply scanned, legible, and includes all required official seals or digital verification bars.
            </Alert>
          )}

          <div className="space-y-2">
            <label className="font-semibold text-slate-800 block">
              Select Document File (PDF, JPG, PNG - Max 5MB) <span className="text-red-600">*</span>
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  const f = e.target.files[0];
                  if (f.size > 5 * 1024 * 1024) {
                    setUploadError('File size exceeds the 5MB statutory limit.');
                    setUploadFile(null);
                  } else {
                    setUploadError('');
                    setUploadFile(f);
                  }
                }
              }}
              className="w-full text-xs p-2 border border-slate-300 rounded bg-slate-50 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#0c2340] file:text-white hover:file:bg-[#113f67] cursor-pointer"
            />
            {uploadFile && (
              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-950 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Selected: <strong>{uploadFile.name}</strong> ({(uploadFile.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDocModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!uploadFile || uploading}
              leftIcon={Upload}
              onClick={async () => {
                if (!uploadFile) return;
                setUploading(true);
                setUploadError('');
                try {
                  const targetApp = realApplications[0];
                  if (!targetApp) {
                    setUploadSuccess('Document saved to local repository.');
                    setDocModalOpen(false);
                    return;
                  }

                  const formData = new FormData();
                  formData.append('file', uploadFile);
                  formData.append('applicationId', targetApp._id);
                  formData.append('documentType', activeDocTarget?.documentType || 'OTHER_DOC');
                  formData.append('documentName', activeDocTarget?.documentName || 'Supporting Certificate');

                  const res = await uploadDocumentApi(formData);
                  if (res?.success) {
                    setUploadSuccess(res.message || 'Document uploaded successfully.');
                    setDocModalOpen(false);
                    fetchDocuments();
                  }
                } catch (err) {
                  setUploadError(err.message || 'Upload failed. Please check file format.');
                } finally {
                  setUploading(false);
                }
              }}
            >
              {uploading ? 'Uploading to Portal...' : docModalType === 'resubmit' ? 'Submit Clear Copy' : 'Confirm Upload'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Respond to Statutory Deficiency */}
      <Modal
        isOpen={respondModalOpen}
        onClose={() => setRespondModalOpen(false)}
        title="Respond to Statutory Deficiency Notice"
        subtitle={`Reference: ${activeDeficiency?.reason || ''} • Ministry Scrutiny Desk`}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleRespondToDeficiency} className="space-y-4 text-xs">
          <div className="bg-amber-50 border border-amber-200 rounded p-3 space-y-1">
            <strong className="text-amber-950 block text-[11px]">Officer Required Action:</strong>
            <p className="text-amber-900 leading-relaxed">
              {activeDeficiency?.requiredAction}
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Applicant Explanation / Undertaking *
            </label>
            <textarea
              value={applicantExplanation}
              onChange={(e) => setApplicantExplanation(e.target.value)}
              rows={4}
              placeholder="State the corrective actions taken, certificate issuance details, or clarifications..."
              className="w-full border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-[#113f67] outline-hidden"
              required
            />
          </div>

          <Alert variant="info" title="Document Resubmission">
            If you need to upload a replacement certificate, please ensure you upload the clean copy via the Document Repository tab, or select the uploaded document to link with this reply.
          </Alert>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRespondModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              size="sm"
              disabled={submittingResponse}
            >
              {submittingResponse ? 'Submitting...' : 'Submit Response to Scrutiny Desk'}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default ApplicantDashboard;
