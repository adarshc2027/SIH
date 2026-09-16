import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  SectionHeading,
  Button,
  StatusBadge,
  Alert,
  Modal
} from '../components/ui';
import { APP_CONFIG } from '../utils/constants';
import {
  FileText,
  UserPlus,
  ArrowRight,
  Bell,
  Calendar,
  ExternalLink,
  GraduationCap,
  Plane,
  CheckCircle2,
  FileCheck,
  Search,
  Users,
  Award,
  HelpCircle,
  Phone,
  Mail,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  Download,
  AlertCircle
} from 'lucide-react';

export const Home = () => {
  // Modal state for scheme details
  const [selectedScheme, setSelectedScheme] = useState(null);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? -1 : index);
  };

  // Important Notices Data
  const notices = [
    {
      id: 1,
      date: '15 Sep 2026',
      tag: 'NEW',
      title: 'Online Application Window for National Fellowship for ST (NFST) AY 2026-27 is Now Open.',
      desc: 'Eligible Scheduled Tribe scholars admitted to full-time M.Phil/Ph.D. courses may submit applications along with guide endorsement and caste validation certificates.',
      fileSize: '420 KB PDF',
      isImportant: true
    },
    {
      id: 2,
      date: '08 Sep 2026',
      tag: 'NOTICE',
      title: 'National Overseas Scholarship (NOS) 2026 Selection Guidelines & Top 500 QS Ranking Mandate.',
      desc: 'Detailed advisory regarding permissible academic disciplines, unconditional offer letter formats, and financial limits for overseas study in USA, UK, Australia, and Canada.',
      fileSize: '680 KB PDF',
      isImportant: false
    },
    {
      id: 3,
      date: '01 Sep 2026',
      tag: 'ADVISORY',
      title: 'Mandatory Aadhaar Seeding with Bank Accounts for Direct Benefit Transfer (DBT) Fellowship Credits.',
      desc: 'All ST applicants must ensure their bank accounts are NPCI-mapped with Aadhaar. Applications with unseeded accounts will encounter payment gateway rejections.',
      fileSize: '290 KB PDF',
      isImportant: false
    }
  ];

  // Available Schemes Data
  const schemesList = [
    {
      code: 'NFST',
      name: 'National Fellowship for Scheduled Tribe Students',
      hindiName: 'अनुसूचित जनजाति के छात्रों के लिए राष्ट्रीय अध्येतावृत्ति',
      description: 'Provides financial assistance to Scheduled Tribe (ST) scholars pursuing full-time research degrees (M.Phil. and Ph.D.) in Sciences, Humanities, Social Sciences, and Engineering at recognized Indian universities.',
      eligibility: [
        'Candidate must belong to a Scheduled Tribe (ST) community of India.',
        'Must hold valid post-graduate degree with minimum 55% aggregate marks.',
        'Must have secured confirmed registration / regular admission in M.Phil / Ph.D.',
        'Total annual fellowship awards: 750 scholars nationwide.'
      ],
      financialAssistance: 'JRF: ₹37,000/month | SRF: ₹42,000/month + Contingency Grant & HRA as applicable.',
      status: 'Open for AY 2026-27',
      statusType: 'verified',
      icon: GraduationCap,
      accentBorder: 'border-l-[#0c2340]'
    },
    {
      code: 'NOS',
      name: 'National Overseas Scholarship for ST Candidates',
      hindiName: 'अनुसूचित जनजाति उम्मीदवारों के लिए राष्ट्रीय प्रवासी छात्रवृत्ति',
      description: 'Supports meritorious Scheduled Tribe scholars for pursuing Master level courses, Ph.D., and Post-Doctoral research programs in premier foreign universities ranked within the top 500 QS World Rankings.',
      eligibility: [
        'Candidate must belong to a recognized Scheduled Tribe (ST) community.',
        'Total family income from all sources must not exceed ₹6.00 Lakhs per annum.',
        'Must have secured unconditional admission offer from a recognized foreign institution.',
        'Total annual scholarship quota: 20 slots per academic year.'
      ],
      financialAssistance: 'Tuition fees, annual maintenance allowance ($15,400 USD / £9,900 GBP), economy airfare, visa fee, and medical insurance.',
      status: 'Open for AY 2026-27',
      statusType: 'verified',
      icon: Plane,
      accentBorder: 'border-l-[#c2410c]'
    }
  ];

  // How It Works Pipeline Steps
  const workflowSteps = [
    {
      step: '01',
      title: 'Registration',
      hindiTitle: 'पंजीकरण',
      desc: 'Citizen creates an account using Aadhaar-linked mobile & email OTP validation.',
      icon: UserPlus
    },
    {
      step: '02',
      title: 'Application',
      hindiTitle: 'आवेदन पत्र',
      desc: 'Fill personal details, academic career, institute admission & upload scanned proofs.',
      icon: FileText
    },
    {
      step: '03',
      title: 'Document Verification',
      hindiTitle: 'दस्तावेज़ सत्यापन',
      desc: 'Officer checks digital Caste, Income, Marks & admission certificates side-by-side.',
      icon: FileCheck
    },
    {
      step: '04',
      title: 'Eligibility Verification',
      hindiTitle: 'पात्रता जांच',
      desc: 'Income ceiling, minimum marks, tribal community status & QS rank compliance check.',
      icon: CheckCircle2
    },
    {
      step: '05',
      title: 'Screening Desk',
      hindiTitle: 'छंटनी एवं अनुशंसा',
      desc: 'MoTA scrutiny committee reviews verified applications and prepares merit lists.',
      icon: Search
    },
    {
      step: '06',
      title: 'Selection & Sanction',
      hindiTitle: 'चयन एवं स्वीकृति',
      desc: 'Sanction order issued and scholarship disbursed via DBT directly into bank accounts.',
      icon: Award
    }
  ];

  // Key Statistics
  const statistics = [
    {
      label: 'Total Active Schemes',
      hindiLabel: 'सक्रिय योजनाएं',
      count: '03',
      desc: 'Central Sector Welfare Schemes',
      highlightColor: 'text-[#0c2340]'
    },
    {
      label: 'Applications Received',
      hindiLabel: 'प्राप्त आवेदन',
      count: '18,450+',
      desc: 'Current Academic Session 2026',
      highlightColor: 'text-[#0c2340]'
    },
    {
      label: 'Applications Verified',
      hindiLabel: 'सत्यापित आवेदन',
      count: '14,210',
      desc: 'Scrutiny Officer Verified',
      highlightColor: 'text-[#15803d]'
    },
    {
      label: 'Applications Processed',
      hindiLabel: 'संसाधित एवं स्वीकृत',
      count: '12,980',
      desc: 'Sanctioned & DBT Disbursed',
      highlightColor: 'text-[#c2410c]'
    }
  ];

  // Frequently Asked Questions
  const faqs = [
    {
      q: 'Who is eligible to apply under the National Fellowship for ST (NFST)?',
      a: 'Any Scheduled Tribe (ST) student who has passed Post-Graduation examination with minimum 55% marks and has registered/admitted for regular and full-time M.Phil/Ph.D. in recognized Indian Universities, Institutes, or Colleges is eligible.'
    },
    {
      q: 'Is Aadhaar mandatory for receiving scholarship payments?',
      a: 'Yes. Under the Direct Benefit Transfer (DBT) guidelines issued by the Government of India, the applicant’s bank account must be Aadhaar-seeded via NPCI mapper for electronic fund transmission without intermediaries.'
    },
    {
      q: 'What is the family income limit for National Overseas Scholarship (NOS)?',
      a: 'The total family income from all sources including candidate, spouse, parents, and siblings must not exceed ₹6.00 Lakhs per annum. An official income certificate issued by a competent state authority is required.'
    },
    {
      q: 'Can an applicant edit details after raising a deficiency response?',
      a: 'Yes. If a Scrutiny Officer flags a deficiency in any uploaded certificate, the applicant receives an SMS/email alert and is granted a specified timeframe to upload the corrected document via the applicant dashboard.'
    },
    {
      q: 'How does the assistive AI verify documents in this system?',
      a: 'The system uses optical character recognition (OCR) and document consistency checking to assist officers by extracting names, dates, certificate numbers, and detecting discrepancies. However, final approval or rejection is made strictly by authorized Government officers.'
    }
  ];

  return (
    <div className="w-full bg-[#f8fafc] text-slate-800 select-none">
      {/* 1. OFFICIAL NOTIFICATION MARQUEE / TICKER STRIP */}
      <div className="bg-[#113f67] text-white py-1.5 px-4 sm:px-8 border-b border-[#0c2340]">
        <div className="max-w-7xl mx-auto flex items-center gap-3 text-xs">
          <span className="shrink-0 bg-[#c2410c] text-white font-bold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider flex items-center gap-1">
            <Bell className="w-3 h-3" />
            <span>Latest Updates</span>
          </span>
          <div className="overflow-hidden whitespace-nowrap truncate text-slate-200 text-xs">
            NFST & NOS 2026-27 Portal Open • Ensure bank accounts are Aadhaar-linked for DBT • Last date for submission: 31st October 2026.
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* 2. MAIN INTRODUCTION SECTION (Information-Rich Official Government Portal Intro) */}
        <section className="bg-white border border-slate-300 rounded shadow-xs overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Left Column: Official Branding & Action Buttons */}
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-semibold text-[#0c2340]">
                  <span className="w-2 h-2 rounded-full bg-[#15803d]"></span>
                  <span>Ministry of Tribal Affairs • Government of India</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-[#0c2340] tracking-tight leading-tight">
                  Scholarship & Fellowship Management System
                </h1>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                  Unified digital platform for managing scholarship and fellowship applications under the Ministry of Tribal Affairs. Designed to ensure transparent scrutiny, direct benefit transfer (DBT), and streamlined higher education support for Scheduled Tribe scholars.
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a href="#available-schemes">
                    <Button variant="primary" size="md" rightIcon={ArrowRight}>
                      View Schemes
                    </Button>
                  </a>

                  <Link to="/register">
                    <Button variant="accent" size="md" leftIcon={UserPlus}>
                      Apply Now (AY 2026-27)
                    </Button>
                  </Link>

                  <Link to="/login">
                    <Button variant="secondary" size="md">
                      Track Application
                    </Button>
                  </Link>
                </div>

                {/* Statutory Assistance Notice */}
                <p className="text-[11px] text-slate-500 pt-1">
                  * All schemes are 100% Central Sector Grants funded by Government of India. No fees are charged at any stage of application.
                </p>
              </div>

              {/* Right Column: Official Desk Summary Box */}
              <div className="lg:col-span-4 bg-slate-50 border border-slate-300 rounded p-4.5 space-y-3">
                <div className="border-b border-slate-200 pb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Citizen Service Center
                  </span>
                  <h3 className="text-sm font-bold text-[#0c2340]">
                    Direct Benefit Transfer (DBT) Portal
                  </h3>
                </div>

                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
                    <span>Aadhaar-authenticated student profiles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
                    <span>Automated document consistency checking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
                    <span>Real-time deficiency notification via SMS/Email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
                    <span>Direct disbursement to student bank accounts</span>
                  </li>
                </ul>

                <div className="pt-2 border-t border-slate-200">
                  <div className="text-[11px] text-slate-500 flex justify-between items-center">
                    <span>Helpline: <strong>{APP_CONFIG.HELPLINE}</strong></span>
                    <Link to="/help-support" className="text-[#0c2340] hover:underline font-semibold">
                      Support Desk →
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 3. IMPORTANT NOTICES SECTION */}
        <section className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-4">
          <SectionHeading
            title="Important Notices & Public Circulars"
            hindiTitle="महत्वपूर्ण सूचनाएं"
            subtitle="Official directives, guidelines, and schedule notifications issued by the Ministry of Tribal Affairs"
            accentColor="saffron"
            action={
              <Link to="/notices">
                <Button variant="outline" size="sm" rightIcon={ArrowRight}>
                  View All Notices
                </Button>
              </Link>
            }
          />

          <div className="divide-y divide-slate-200 border border-slate-200 rounded">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {notice.date}
                    </span>

                    {notice.isImportant ? (
                      <span className="bg-red-100 text-red-800 border border-red-300 text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                        {notice.tag}
                      </span>
                    ) : (
                      <span className="bg-blue-50 text-[#113f67] border border-blue-200 text-[10px] font-semibold px-1.5 py-0.2 rounded uppercase">
                        {notice.tag}
                      </span>
                    )}

                    <h4 className="text-xs sm:text-sm font-bold text-[#0c2340] hover:underline cursor-pointer">
                      {notice.title}
                    </h4>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
                    {notice.desc}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={Download}
                    className="text-slate-700"
                    onClick={() => alert(`Downloading circular: ${notice.title}`)}
                  >
                    Download ({notice.fileSize})
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. AVAILABLE SCHEMES SECTION */}
        <section id="available-schemes" className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-6">
          <SectionHeading
            title="Available Scholarship & Fellowship Schemes"
            hindiTitle="उपलब्ध छात्रवृत्ति एवं अध्येतावृत्ति योजनाएं"
            subtitle="Central Sector scholarship programs for Scheduled Tribe (ST) students"
            accentColor="blue"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schemesList.map((scheme) => {
              const Icon = scheme.icon;

              return (
                <div
                  key={scheme.code}
                  className={`border border-slate-300 border-l-4 ${scheme.accentBorder} rounded p-5 bg-white shadow-2xs flex flex-col justify-between space-y-4`}
                >
                  <div className="space-y-3">
                    {/* Header with Scheme Code & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-slate-100 border border-slate-200 rounded text-[#0c2340]">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-mono text-xs font-bold text-[#113f67] uppercase tracking-wider block">
                            {scheme.code} Scheme
                          </span>
                          <h3 className="text-base font-bold text-[#0c2340] leading-snug">
                            {scheme.name}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 font-medium">
                      {scheme.hindiName}
                    </p>

                    {/* Short Description */}
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {scheme.description}
                    </p>

                    {/* Eligibility Summary Box */}
                    <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs space-y-1.5">
                      <span className="font-bold text-slate-800 uppercase text-[11px] tracking-wider block">
                        Eligibility Summary:
                      </span>
                      <ul className="space-y-1 text-slate-600 list-disc list-inside text-[11px]">
                        {scheme.eligibility.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="truncate">{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Financial Assistance Note */}
                    <div className="text-[11px] text-slate-700 bg-amber-50/70 border border-amber-200 p-2 rounded">
                      <strong className="text-amber-900">Coverage:</strong> {scheme.financialAssistance}
                    </div>
                  </div>

                  {/* Footer Action Bar */}
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
                    <StatusBadge status={scheme.statusType} label={scheme.status} size="sm" />

                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedScheme(scheme)}
                      >
                        View Details
                      </Button>
                      <Link to="/register">
                        <Button variant="primary" size="sm">
                          Apply Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <Link to="/schemes" className="text-xs font-semibold text-[#0c2340] hover:underline inline-flex items-center gap-1">
              <span>View all central scholarship schemes & quotas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* 5. HOW IT WORKS (Application & Scrutiny Workflow) */}
        <section className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-6">
          <SectionHeading
            title="How It Works: Application & Scrutiny Process"
            hindiTitle="कार्यप्रणाली एवं चरण"
            subtitle="Transparent multi-stage workflow from citizen registration to Direct Benefit Transfer (DBT)"
            accentColor="green"
          />

          {/* Workflow Pipeline Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.step}
                  className="bg-slate-50 border border-slate-200 rounded p-3.5 flex flex-col justify-between relative space-y-2 hover:border-[#0c2340] transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        STEP {step.step}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-white border border-slate-300 flex items-center justify-center text-[#0c2340]">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-[#0c2340] leading-snug">
                      {step.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 block mb-1">
                      {step.hindiTitle}
                    </span>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {idx < workflowSteps.length - 1 && (
                    <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-400 font-bold text-xs pointer-events-none">
                      →
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Assistive AI Guardrail Note */}
          <div className="bg-blue-50 border border-slate-300 border-l-4 border-l-[#113f67] p-3.5 rounded text-xs text-slate-700 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-[#113f67] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#0c2340]">Institutional AI Guardrail:</strong>{' '}
              Artificial Intelligence (OCR, document classification, consistency checking) operates strictly as an <em>assistive verification tool</em> for MoTA Scrutiny Officers. All final decisions to approve, raise deficiencies, or reject applications are made strictly by authorized human Government officials.
            </div>
          </div>
        </section>

        {/* 6. KEY STATISTICS SECTION (Simple Government-Style Stat Boxes) */}
        <section className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-4">
          <SectionHeading
            title="Key Scheme Statistics & Portal Performance"
            hindiTitle="प्रमुख आंकड़े"
            subtitle="Real-time transparency statistics for the Academic Year 2026-27"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statistics.map((stat) => (
              <div
                key={stat.label}
                className="bg-slate-50 border border-slate-300 rounded p-4 text-center space-y-1 shadow-2xs"
              >
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono block text-[#0c2340]">
                  {stat.count}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                  {stat.label}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  {stat.hindiLabel}
                </p>
                <div className="pt-1 text-[10px] text-slate-500 border-t border-slate-200 mt-1">
                  {stat.desc}
                </div>
              </div>
            ))}
          </div>

          <p className="text-right text-[11px] text-slate-400">
            * Data sourced from Ministry of Tribal Affairs (MoTA) National DBT Database.
          </p>
        </section>

        {/* 7. HELP & SUPPORT SECTION (Helpdesk + FAQs + Contact Info) */}
        <section className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-6">
          <SectionHeading
            title="Help, Support & Citizen Queries"
            hindiTitle="सहायता एवं अक्सर पूछे जाने वाले प्रश्न"
            subtitle="Assistance for ST scholars, universities, and verification centers"
            accentColor="saffron"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Helpdesk & Contact Information (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 border border-slate-300 rounded p-5 space-y-4">
                <h4 className="text-sm font-bold text-[#0c2340] uppercase tracking-wide border-b border-slate-200 pb-2">
                  Official Helpdesk Channels
                </h4>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white border border-slate-200 rounded text-[#0c2340] shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-slate-900 text-xs">National Toll-Free Helpline</strong>
                      <span className="font-mono text-amber-700 font-bold text-base">{APP_CONFIG.HELPLINE}</span>
                      <p className="text-[11px] text-slate-500">Working days (9:30 AM to 5:30 PM)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white border border-slate-200 rounded text-[#0c2340] shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-slate-900 text-xs">Support Email Address</strong>
                      <span className="font-mono text-slate-800 text-xs">{APP_CONFIG.SUPPORT_EMAIL}</span>
                      <p className="text-[11px] text-slate-500">Query response within 48 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white border border-slate-200 rounded text-[#0c2340] shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-slate-900 text-xs">Physical Address</strong>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        Scholarship Division, Ministry of Tribal Affairs,<br />
                        Room No. 412, 'B' Wing, Shastri Bhawan,<br />
                        Dr. Rajendra Prasad Road, New Delhi - 110001
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <Link to="/help-support">
                    <Button variant="secondary" size="sm" className="w-full">
                      Lodge an Online Grievance Ticket
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Frequently Asked Questions (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <h4 className="text-sm font-bold text-[#0c2340] uppercase tracking-wide border-b border-slate-200 pb-2">
                Frequently Asked Questions (FAQs)
              </h4>

              <div className="space-y-2">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index;

                  return (
                    <div
                      key={index}
                      className="border border-slate-200 rounded bg-slate-50/50 overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(index)}
                        className="w-full text-left p-3 flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-expanded={isOpen}
                      >
                        <span className="flex items-start gap-2">
                          <HelpCircle className="w-4 h-4 text-[#113f67] shrink-0 mt-0.5" />
                          <span>{faq.q}</span>
                        </span>
                        <span className="shrink-0 text-slate-500">
                          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-3 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-200 bg-white">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-slate-500 text-right pt-1">
                Have more questions? Read our full{' '}
                <Link to="/guidelines" className="text-[#0c2340] font-semibold underline">
                  Scheme Guidelines & FAQ Manual
                </Link>
              </p>
            </div>

          </div>
        </section>

      </div>

      {/* 8. SCHEME DETAIL MODAL (Opens when user clicks "View Details") */}
      <Modal
        isOpen={!!selectedScheme}
        onClose={() => setSelectedScheme(null)}
        title={selectedScheme ? `${selectedScheme.code} - ${selectedScheme.name}` : ''}
        subtitle={selectedScheme?.hindiName}
        maxWidth="max-w-2xl"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setSelectedScheme(null)}>
              Close
            </Button>
            <Link to="/register" onClick={() => setSelectedScheme(null)}>
              <Button variant="accent" size="sm" leftIcon={UserPlus}>
                Apply for {selectedScheme?.code}
              </Button>
            </Link>
          </>
        }
      >
        {selectedScheme && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                Scheme Objectives
              </h4>
              <p className="text-slate-600 leading-relaxed">
                {selectedScheme.description}
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 border border-slate-200 rounded space-y-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Prescribed Eligibility Criteria
              </h4>
              <ul className="space-y-1.5 list-disc list-inside text-slate-700">
                {selectedScheme.eligibility.map((crit, idx) => (
                  <li key={idx}>{crit}</li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50/70 p-3.5 border border-amber-200 rounded space-y-1">
              <h4 className="font-bold text-amber-950 text-xs uppercase tracking-wider">
                Financial Assistance & Entitlements
              </h4>
              <p className="text-slate-700 leading-relaxed font-medium">
                {selectedScheme.financialAssistance}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                Mandatory Supporting Documents
              </h4>
              <p className="text-xs text-slate-500">
                1. Scheduled Tribe (ST) Certificate issued by competent state revenue authority.<br />
                2. Unconditional admission / registration certificate from the institution.<br />
                3. Post-graduate marksheet / qualifying degree certificates.<br />
                4. Aadhaar Card copy and Bank Passbook with visible IFSC and Account Number.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Home;
