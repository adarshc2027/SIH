import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  PageContainer,
  SectionHeading,
  Button,
  StatusBadge,
  Alert,
  Input,
  Select,
  Textarea,
  Checkbox,
  RadioGroup,
  FileUpload,
  LoadingState,
  ErrorState
} from '../../components/ui';
import { getSchemeByIdApi } from '../../services/schemeApi';
import {
  createOrSaveDraftApi,
  updateApplicationApi,
  submitApplicationApi
} from '../../services/applicationApi';
import { uploadDocumentApi } from '../../services/documentApi';
import {
  User,
  GraduationCap,
  Award,
  CreditCard,
  Building,
  Upload,
  FileCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Save,
  Send,
  ArrowLeft,
  AlertCircle,
  FileText,
  Printer,
  Calendar,
  ShieldCheck
} from 'lucide-react';

export const ApplyScheme = () => {
  const { schemeId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [scheme, setScheme] = useState(null);
  const [loadingScheme, setLoadingScheme] = useState(true);
  const [schemeError, setSchemeError] = useState(null);

  // Active Wizard Step (1 to 8)
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationId, setApplicationId] = useState(null);
  const [applicationNumber, setApplicationNumber] = useState(null);

  // Form States
  const [personal, setPersonal] = useState({
    fullName: user?.name || '',
    fatherOrGuardianName: '',
    motherName: '',
    dateOfBirth: '2000-01-01',
    gender: 'Male',
    aadhaarNumber: 'XXXX-XXXX-9124',
    mobile: user?.phone || '',
    email: user?.email || '',
    tribalCommunity: user?.tribalCommunity || 'SANTHAL',
    casteCertificateNumber: '',
    state: 'Jharkhand',
    district: 'Ranchi',
    address: '',
    pincode: '',
    isDivyangjan: false,
    disabilityPercentage: 0
  });

  const [academic, setAcademic] = useState({
    qualifyingDegree: 'Post Graduate (M.A. / M.Sc. / M.Com)',
    institution: '',
    passingYear: 2024,
    percentageOrCgpa: '68.5%',
    enrolledCourse: 'Ph.D. Research',
    enrolledInstitution: '',
    registrationNumber: '',
    admissionDate: '2026-07-15',
    researchTopic: '',
    supervisorName: '',
    foreignUniversityRanking: '',
    hostCountry: ''
  });

  const [financial, setFinancial] = useState({
    annualFamilyIncome: 180000,
    incomeCertificateNumber: '',
    issuingAuthority: 'Tehsildar / Circle Officer',
    issueDate: '2026-04-10',
    fatherOccupation: 'Agriculture / Farming',
    motherOccupation: 'Homemaker'
  });

  const [bank, setBank] = useState({
    accountHolderName: user?.name || '',
    bankName: 'State Bank of India',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    branchName: '',
    isAadhaarSeeded: true
  });

  // Uploaded Documents Array
  const [documents, setDocuments] = useState([]);

  // UI Action States
  const [savingDraft, setSavingDraft] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [stepError, setStepError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [submittedApp, setSubmittedApp] = useState(null);
  const [statutoryAgreed, setStatutoryAgreed] = useState(false);

  // Fetch Scheme Data
  useEffect(() => {
    const loadScheme = async () => {
      setLoadingScheme(true);
      setSchemeError(null);
      try {
        const res = await getSchemeByIdApi(schemeId);
        const s = res.data?.scheme;
        setScheme(s);

        // Pre-initialize documents structure based on scheme's required documents
        if (s?.requiredDocuments) {
          const initDocs = s.requiredDocuments.map((doc) => ({
            documentType: doc.code,
            documentName: doc.name,
            fileName: '',
            fileUrl: '',
            fileSizeMB: 0,
            uploadedAt: null,
            status: 'pending'
          }));
          setDocuments(initDocs);
        }
      } catch (err) {
        setSchemeError(err.message || `Failed to load scheme '${schemeId}'.`);
      } finally {
        setLoadingScheme(false);
      }
    };

    if (schemeId) {
      loadScheme();
    }
  }, [schemeId]);

  // Load existing draft if any exists for this scheme
  useEffect(() => {
    const initDraft = async () => {
      if (!scheme?._id) return;
      try {
        const res = await createOrSaveDraftApi({ schemeId: scheme._id });
        const app = res.data?.application;
        if (app) {
          setApplicationId(app._id);
          setApplicationNumber(app.applicationNumber);

          if (app.personalDetails?.fullName) setPersonal((prev) => ({ ...prev, ...app.personalDetails }));
          if (app.academicDetails?.enrolledCourse) setAcademic((prev) => ({ ...prev, ...app.academicDetails }));
          if (app.financialDetails?.annualFamilyIncome) setFinancial((prev) => ({ ...prev, ...app.financialDetails }));
          if (app.bankDetails?.accountNumber) setBank((prev) => ({ ...prev, ...app.bankDetails }));
          if (app.documents?.length > 0) setDocuments(app.documents);

          if (app.status !== 'draft') {
            setSubmittedApp(app);
          }
        }
      } catch (err) {
        console.warn('Draft initialization:', err.message);
      }
    };

    if (scheme) {
      initDraft();
    }
  }, [scheme]);

  // Save Draft Action
  const handleSaveDraft = async () => {
    setSavingDraft(true);
    setSaveMessage('');
    setStepError('');
    try {
      const payload = {
        schemeId: scheme._id,
        personalDetails: personal,
        academicDetails: academic,
        financialDetails: financial,
        bankDetails: bank,
        documents
      };

      let res;
      if (applicationId) {
        res = await updateApplicationApi(applicationId, payload);
      } else {
        res = await createOrSaveDraftApi(payload);
      }

      const app = res.data?.application;
      if (app) {
        setApplicationId(app._id);
        setApplicationNumber(app.applicationNumber);
      }

      setSaveMessage('Draft successfully saved to Ministry database at ' + new Date().toLocaleTimeString());
    } catch (err) {
      setStepError(err.message || 'Failed to save draft.');
    } finally {
      setSavingDraft(false);
    }
  };

  // Step Validation & Forward Navigation
  const handleNext = () => {
    setStepError('');
    setSaveMessage('');

    // Step 1: Personal
    if (currentStep === 1) {
      if (!personal.fullName.trim() || !personal.fatherOrGuardianName.trim() || !personal.motherName.trim()) {
        setStepError('Please provide Full Name, Father/Guardian Name, and Mother Name.');
        return;
      }
      if (!personal.casteCertificateNumber.trim()) {
        setStepError('Please enter valid Scheduled Tribe (ST) Certificate Number.');
        return;
      }
      if (!personal.mobile.trim() || !personal.state.trim() || !personal.district.trim()) {
        setStepError('Please complete contact, State, and District fields.');
        return;
      }
    }

    // Step 2: Academic
    if (currentStep === 2) {
      if (!academic.qualifyingDegree.trim() || !academic.institution.trim()) {
        setStepError('Please specify previous Qualifying Degree and Institution.');
        return;
      }
      if (!academic.enrolledCourse.trim() || !academic.enrolledInstitution.trim()) {
        setStepError('Please provide Course of Study and Enrolled University/Institution.');
        return;
      }
      if (scheme?.code === 'NFST' && !academic.researchTopic.trim()) {
        setStepError('Please provide Proposed Research Topic / Dissertation Synopsis Title for NFST.');
        return;
      }
      if (scheme?.code === 'NOS' && !academic.hostCountry.trim()) {
        setStepError('Please specify Foreign Host Country and QS Ranking for NOS.');
        return;
      }
    }

    // Step 3: Scheme (Read-only confirmation) - No validation needed

    // Step 4: Financial
    if (currentStep === 4) {
      if (financial.annualFamilyIncome === '' || financial.annualFamilyIncome === null) {
        setStepError('Please enter total annual family income from all sources.');
        return;
      }
      if (scheme?.code === 'NOS' && Number(financial.annualFamilyIncome) > 600000) {
        setStepError('Annual family income exceeds the prescribed limit of ₹6.00 Lakhs for NOS.');
        return;
      }
      if (!financial.incomeCertificateNumber.trim()) {
        setStepError('Please enter Income Certificate Number issued by competent revenue authority.');
        return;
      }
    }

    // Step 5: Bank Details
    if (currentStep === 5) {
      if (!bank.accountHolderName.trim() || !bank.bankName.trim() || !bank.accountNumber.trim() || !bank.ifscCode.trim()) {
        setStepError('All bank account details (Name, Bank, Account Number, IFSC) are mandatory for DBT credits.');
        return;
      }
      if (bank.accountNumber !== bank.confirmAccountNumber) {
        setStepError('Account Number and Confirm Account Number do not match.');
        return;
      }
      if (!bank.isAadhaarSeeded) {
        setStepError('Aadhaar seeding declaration must be confirmed for DBT transfers.');
        return;
      }
    }

    // Step 6: Documents
    if (currentStep === 6) {
      const missingMandatory = [];
      (scheme?.requiredDocuments || []).forEach((reqDoc) => {
        if (reqDoc.isMandatory) {
          const uploaded = documents.find((d) => d.documentType === reqDoc.code && d.fileName);
          if (!uploaded) {
            missingMandatory.push(reqDoc.name);
          }
        }
      });

      if (missingMandatory.length > 0) {
        setStepError(`Please upload mandatory document(s): ${missingMandatory.join(', ')}.`);
        return;
      }
    }

    // Step 7: Review -> advances to Step 8 (Submit)
    // Auto-save draft on advancing
    handleSaveDraft();
    setCurrentStep((prev) => Math.min(prev + 1, 8));
  };

  const handlePrev = () => {
    setStepError('');
    setSaveMessage('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Final Submit Action
  const handleFinalSubmit = async () => {
    if (!statutoryAgreed) {
      setStepError('You must solemnly declare and accept the statutory undertaking before final submission.');
      return;
    }

    setSubmitting(true);
    setStepError('');
    try {
      // First save all latest data to draft
      await handleSaveDraft();

      // Submit and lock application
      const res = await submitApplicationApi(applicationId);
      const finalized = res.data?.application;
      setSubmittedApp(finalized);
    } catch (err) {
      setStepError(err.message || 'Submission failed. Please verify all required certificates.');
    } finally {
      setSubmitting(false);
    }
  };

  // Document upload simulation/handler
  const handleFileAttach = async (docCode, docName, file) => {
    if (!file) return;

    // Immediately update local UI state
    setDocuments((prev) => {
      const existingIdx = prev.findIndex((d) => d.documentType === docCode);
      const newDocEntry = {
        documentType: docCode,
        documentName: docName,
        fileName: file.name,
        fileUrl: `/uploads/documents/${file.name}`,
        fileSizeMB: parseFloat((file.size / (1024 * 1024)).toFixed(2)),
        uploadedAt: new Date(),
        status: 'pending'
      };

      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = newDocEntry;
        return updated;
      } else {
        return [...prev, newDocEntry];
      }
    });

    // If an application draft is already saved in the database, persist to Document collection
    if (applicationId) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('applicationId', applicationId);
        formData.append('documentType', docCode);
        formData.append('documentName', docName);
        const uploadRes = await uploadDocumentApi(formData);
        if (uploadRes?.data?.document?.fileUrl) {
          setDocuments((prev) =>
            prev.map((d) =>
              d.documentType === docCode
                ? { ...d, fileUrl: uploadRes.data.document.fileUrl }
                : d
            )
          );
        }
      } catch (uploadErr) {
        console.warn('Real file upload background note:', uploadErr.message);
      }
    }
  };

  const handleFileRemove = (docCode) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.documentType === docCode
          ? { ...d, fileName: '', fileUrl: '', fileSizeMB: 0, uploadedAt: null }
          : d
      )
    );
  };

  if (loadingScheme) {
    return (
      <PageContainer title="Loading Application Wizard...">
        <div className="bg-white border border-slate-300 rounded p-12">
          <LoadingState
            message="आवेदन पत्र लोड हो रहा है / Preparing Application Form..."
            subtext="Loading statutory requirements and guidelines"
          />
        </div>
      </PageContainer>
    );
  }

  if (schemeError || !scheme) {
    return (
      <PageContainer title="Application Error">
        <ErrorState
          title="Scheme Not Found"
          message={schemeError || `Unable to start application for scheme '${schemeId}'.`}
          onRetry={() => window.location.reload()}
        />
      </PageContainer>
    );
  }

  // If already submitted, show confirmation acknowledgment screen
  if (submittedApp && submittedApp.status !== 'draft') {
    return (
      <PageContainer
        title="Application Submission Acknowledgment"
        hindiTitle="आवेदन पावती"
        description="Official confirmation of application under Ministry of Tribal Affairs welfare scheme."
        breadcrumbs={[
          { label: 'Applicant Dashboard', href: '/applicant/dashboard' },
          { label: 'Acknowledgment' }
        ]}
      >
        <div className="bg-white border border-slate-300 rounded shadow-xs p-8 max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-3 pb-6 border-b border-slate-200">
            <div className="w-16 h-16 bg-emerald-50 border border-emerald-300 rounded-full flex items-center justify-center text-emerald-700 mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded uppercase">
                Application Successfully Submitted
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0c2340]">
                Ministry of Tribal Affairs, Government of India
              </h2>
              <p className="text-xs text-slate-600">
                Your application has been logged in the national portal registry and placed into the verification queue.
              </p>
            </div>
          </div>

          {/* Reference Card */}
          <div className="bg-slate-50 border border-slate-300 rounded p-5 space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <span className="text-slate-500 block text-[11px]">Permanent Application Number:</span>
                <span className="font-mono text-base font-extrabold text-[#0c2340]">
                  {submittedApp.applicationNumber}
                </span>
              </div>

              <div className="text-right">
                <span className="text-slate-500 block text-[11px]">Submission Timestamp:</span>
                <span className="font-mono font-medium text-slate-800">
                  {new Date(submittedApp.submittedAt || Date.now()).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700 pt-1">
              <div>
                <span className="text-slate-500 block text-[11px]">Applicant Scholar:</span>
                <strong>{submittedApp.personalDetails?.fullName || user?.name}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Tribal Community:</span>
                <span>{submittedApp.personalDetails?.tribalCommunity || user?.tribalCommunity}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Applied Scheme:</span>
                <strong>{scheme.name} ({scheme.code})</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Current Scrutiny Stage:</span>
                <StatusBadge status="under_scrutiny" label="Under Verification (Level 1)" size="sm" />
              </div>
            </div>
          </div>

          <Alert variant="info" title="Next Steps in Scrutiny Workflow">
            Your uploaded documents will be inspected side-by-side by the Scrutiny Desk. Should any document require clarification, an SMS/Email deficiency alert will be dispatched to <strong>{submittedApp.personalDetails?.mobile || user?.phone}</strong>.
          </Alert>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
            <Button
              variant="outline"
              size="sm"
              leftIcon={Printer}
              onClick={() => window.print()}
            >
              Print Acknowledgment
            </Button>

            <Link to="/applicant/dashboard">
              <Button variant="primary" size="sm">
                Return to Applicant Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Steps Definition
  const steps = [
    { num: 1, label: 'Personal', hindi: 'व्यक्तिगत' },
    { num: 2, label: 'Academic', hindi: 'शैक्षणिक' },
    { num: 3, label: 'Scheme', hindi: 'योजना' },
    { num: 4, label: 'Financial', hindi: 'वित्तीय' },
    { num: 5, label: 'Bank (DBT)', hindi: 'बैंक' },
    { num: 6, label: 'Documents', hindi: 'दस्तावेज़' },
    { num: 7, label: 'Review', hindi: 'पुनरावलोकन' },
    { num: 8, label: 'Submit', hindi: 'जमा करें' }
  ];

  return (
    <PageContainer
      title={`Application: ${scheme.name}`}
      hindiTitle={scheme.hindiName}
      description={`Official Scheme Code: ${scheme.code} • Draft Ref: ${applicationNumber || 'Generating...'}`}
      breadcrumbs={[
        { label: 'Applicant Dashboard', href: '/applicant/dashboard' },
        { label: 'Apply', href: '/applicant/dashboard' },
        { label: scheme.code }
      ]}
      action={
        <div className="flex items-center gap-2">
          <Link to="/applicant/dashboard">
            <Button variant="outline" size="sm" leftIcon={ArrowLeft}>
              Exit to Dashboard
            </Button>
          </Link>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSaveDraft}
            isLoading={savingDraft}
            leftIcon={Save}
          >
            Save Draft
          </Button>
        </div>
      }
    >
      <div className="space-y-6">

        {/* 8-Step Government Progress Bar */}
        <div className="bg-white border border-slate-300 rounded p-4 shadow-xs overflow-x-auto">
          <div className="flex items-center justify-between min-w-[650px] gap-2">
            {steps.map((s, idx) => {
              const isCurrent = currentStep === s.num;
              const isDone = currentStep > s.num;

              return (
                <div key={s.num} className="flex items-center flex-1 last:flex-none">
                  <div
                    onClick={() => isDone && setCurrentStep(s.num)}
                    className={`flex items-center gap-2 select-none ${isDone ? 'cursor-pointer' : ''}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border ${
                        isCurrent
                          ? 'bg-[#0c2340] text-white border-[#0c2340]'
                          : isDone
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-100 text-slate-500 border-slate-300'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                    </div>
                    <div>
                      <span className={`text-xs font-bold block leading-none ${isCurrent ? 'text-[#0c2340]' : isDone ? 'text-slate-800' : 'text-slate-500'}`}>
                        {s.label}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 leading-none">
                        {s.hindi}
                      </span>
                    </div>
                  </div>

                  {idx < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-3 ${isDone ? 'bg-emerald-600' : 'bg-slate-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Alerts */}
        {stepError && (
          <Alert variant="error" title="Form Validation Alert" dismissible onDismiss={() => setStepError('')}>
            {stepError}
          </Alert>
        )}

        {saveMessage && (
          <Alert variant="success" title="Draft Saved" dismissible onDismiss={() => setSaveMessage('')}>
            {saveMessage}
          </Alert>
        )}

        {/* ================= STEP 1: PERSONAL INFORMATION ================= */}
        {currentStep === 1 && (
          <div className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-5">
            <SectionHeading
              title="Step 1: Personal Information"
              hindiTitle="आवेदक की व्यक्तिगत जानकारी"
              subtitle="Enter demographic details strictly matching your Matriculation Certificate and Aadhaar"
              accentColor="blue"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <Input
                label="Full Name of Applicant"
                value={personal.fullName}
                onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })}
                required
                helperText="As per 10th standard certificate"
              />
              <Input
                label="Father / Guardian Name"
                value={personal.fatherOrGuardianName}
                onChange={(e) => setPersonal({ ...personal, fatherOrGuardianName: e.target.value })}
                required
              />
              <Input
                label="Mother's Name"
                value={personal.motherName}
                onChange={(e) => setPersonal({ ...personal, motherName: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <Input
                label="Date of Birth"
                type="date"
                value={personal.dateOfBirth ? personal.dateOfBirth.substring(0, 10) : ''}
                onChange={(e) => setPersonal({ ...personal, dateOfBirth: e.target.value })}
                required
              />
              <Select
                label="Gender / लिंग"
                value={personal.gender}
                onChange={(e) => setPersonal({ ...personal, gender: e.target.value })}
                options={[
                  { value: 'Male', label: 'Male / पुरुष' },
                  { value: 'Female', label: 'Female / महिला' },
                  { value: 'Transgender', label: 'Transgender / उभयलैंगिक' }
                ]}
                required
              />
              <Input
                label="Aadhaar Number (UIDAI)"
                value={personal.aadhaarNumber}
                onChange={(e) => setPersonal({ ...personal, aadhaarNumber: e.target.value })}
                required
                helperText="12-digit Unique Identification Number"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <Input
                label="Mobile Number (DBT Seeded)"
                type="tel"
                value={personal.mobile}
                onChange={(e) => setPersonal({ ...personal, mobile: e.target.value })}
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={personal.email}
                onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                required
              />
              <Select
                label="Recognized Tribal Community"
                value={personal.tribalCommunity}
                onChange={(e) => setPersonal({ ...personal, tribalCommunity: e.target.value })}
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
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <Input
                label="Caste Certificate Number"
                placeholder="e.g. JH/ST/2023/88194"
                value={personal.casteCertificateNumber}
                onChange={(e) => setPersonal({ ...personal, casteCertificateNumber: e.target.value })}
                required
                helperText="Must be issued by SDO / DM / Tehsildar"
              />
              <Input
                label="State of Domicile"
                value={personal.state}
                onChange={(e) => setPersonal({ ...personal, state: e.target.value })}
                required
              />
              <Input
                label="District"
                value={personal.district}
                onChange={(e) => setPersonal({ ...personal, district: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="sm:col-span-2">
                <Input
                  label="Permanent Postal Address"
                  placeholder="Village / Town, Post Office, Police Station"
                  value={personal.address}
                  onChange={(e) => setPersonal({ ...personal, address: e.target.value })}
                  required
                />
              </div>
              <Input
                label="PIN Code"
                placeholder="6-digit PIN"
                value={personal.pincode}
                onChange={(e) => setPersonal({ ...personal, pincode: e.target.value })}
                required
              />
            </div>

            <div className="pt-2 border-t border-slate-200">
              <Checkbox
                label="Person with Benchmark Disability (Divyangjan)"
                description="Check if candidate holds a 40% or more disability certificate issued by a medical board."
                checked={personal.isDivyangjan}
                onChange={(e) => setPersonal({ ...personal, isDivyangjan: e.target.checked })}
              />
            </div>
          </div>
        )}

        {/* ================= STEP 2: ACADEMIC INFORMATION ================= */}
        {currentStep === 2 && (
          <div className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-5">
            <SectionHeading
              title="Step 2: Academic Information"
              hindiTitle="शैक्षणिक योग्यता विवरण"
              subtitle="Details of qualifying postgraduate degree and currently enrolled research program"
              accentColor="blue"
            />

            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1">
              A. Qualifying Examination Record
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div className="sm:col-span-2">
                <Input
                  label="Qualifying Degree"
                  placeholder="e.g. Master of Science (Botany)"
                  value={academic.qualifyingDegree}
                  onChange={(e) => setAcademic({ ...academic, qualifyingDegree: e.target.value })}
                  required
                />
              </div>
              <Input
                label="Passing Year"
                type="number"
                value={academic.passingYear}
                onChange={(e) => setAcademic({ ...academic, passingYear: Number(e.target.value) })}
                required
              />
              <Input
                label="Percentage / CGPA Obtained"
                placeholder="e.g. 68.5% or 7.8 CGPA"
                value={academic.percentageOrCgpa}
                onChange={(e) => setAcademic({ ...academic, percentageOrCgpa: e.target.value })}
                required
                helperText="Minimum 55% for ST Category"
              />
            </div>

            <Input
              label="University / Institution Awarded Qualifying Degree"
              placeholder="e.g. Banaras Hindu University (BHU)"
              value={academic.institution}
              onChange={(e) => setAcademic({ ...academic, institution: e.target.value })}
              required
            />

            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1 pt-2">
              B. Current Enrolled Course of Study
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <Input
                label="Enrolled Course / Degree"
                placeholder="e.g. Ph.D. / M.Phil / Masters Abroad"
                value={academic.enrolledCourse}
                onChange={(e) => setAcademic({ ...academic, enrolledCourse: e.target.value })}
                required
              />
              <Input
                label="Registration / Enrollment No."
                placeholder="e.g. RU/PHD/2026/110"
                value={academic.registrationNumber}
                onChange={(e) => setAcademic({ ...academic, registrationNumber: e.target.value })}
                required
              />
              <Input
                label="Admission / Registration Date"
                type="date"
                value={academic.admissionDate ? academic.admissionDate.substring(0, 10) : ''}
                onChange={(e) => setAcademic({ ...academic, admissionDate: e.target.value })}
                required
              />
            </div>

            <Input
              label="Admitting University / Institution Name"
              placeholder="e.g. Ranchi University / Oxford University"
              value={academic.enrolledInstitution}
              onChange={(e) => setAcademic({ ...academic, enrolledInstitution: e.target.value })}
              required
            />

            {scheme?.code === 'NFST' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                <Input
                  label="Proposed Ph.D. / M.Phil Research Topic"
                  placeholder="e.g. Study of Ethnobotanical Practices in Santhal Parganas"
                  value={academic.researchTopic}
                  onChange={(e) => setAcademic({ ...academic, researchTopic: e.target.value })}
                  required
                />
                <Input
                  label="Research Guide / Supervisor Name"
                  placeholder="e.g. Prof. R. K. Soren, Department of Botany"
                  value={academic.supervisorName}
                  onChange={(e) => setAcademic({ ...academic, supervisorName: e.target.value })}
                  required
                />
              </div>
            )}

            {scheme?.code === 'NOS' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                <Input
                  label="Foreign Host Country"
                  placeholder="e.g. United Kingdom / United States / Australia"
                  value={academic.hostCountry}
                  onChange={(e) => setAcademic({ ...academic, hostCountry: e.target.value })}
                  required
                />
                <Input
                  label="QS World University Ranking of Host Institute"
                  placeholder="e.g. Rank 1 (Must be within Top 500)"
                  value={academic.foreignUniversityRanking}
                  onChange={(e) => setAcademic({ ...academic, foreignUniversityRanking: e.target.value })}
                  required
                />
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 3: SCHEME INFORMATION ================= */}
        {currentStep === 3 && (
          <div className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-5">
            <SectionHeading
              title="Step 3: Scheme Information & Guidelines Confirmation"
              hindiTitle="योजना विवरण एवं दिशानिर्देश"
              subtitle="Review target scheme parameters and confirm eligibility compliance"
              accentColor="saffron"
            />

            <div className="border border-slate-300 border-l-4 border-l-[#0c2340] rounded p-4 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-[#113f67] block">
                    CODE: {scheme.code}
                  </span>
                  <h3 className="text-base font-bold text-[#0c2340]">
                    {scheme.name}
                  </h3>
                </div>
                <StatusBadge status="verified" label="Active Cycle" />
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {scheme.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[11px]">Academic Level:</span>
                  <strong>{scheme.academicLevel}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Annual Slots:</span>
                  <strong>{scheme.annualSlots}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Income Limit:</span>
                  <strong>{scheme.incomeLimit}</strong>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded p-4 text-xs space-y-2">
              <h4 className="font-bold text-[#0c2340] uppercase tracking-wider text-[11px]">
                Prescribed Eligibility Rules (Configurable Master Record)
              </h4>
              <ul className="space-y-1.5 text-slate-700 list-disc list-inside">
                {scheme.eligibilityRules?.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ================= STEP 4: FINANCIAL INFORMATION ================= */}
        {currentStep === 4 && (
          <div className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-5">
            <SectionHeading
              title="Step 4: Financial & Family Income Details"
              hindiTitle="आर्थिक एवं पारिवारिक आय विवरण"
              subtitle="Declared annual family income from all sources supported by competent authority certificate"
              accentColor="blue"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <Input
                label="Total Annual Family Income (INR)"
                type="number"
                placeholder="₹ Amount in Rupees"
                value={financial.annualFamilyIncome}
                onChange={(e) => setFinancial({ ...financial, annualFamilyIncome: Number(e.target.value) })}
                required
                helperText={scheme?.code === 'NOS' ? 'Must be ₹6,00,000 or below for NOS.' : 'No income cap for NFST.'}
              />
              <Input
                label="Income Certificate Number"
                placeholder="e.g. INC/2026/04112"
                value={financial.incomeCertificateNumber}
                onChange={(e) => setFinancial({ ...financial, incomeCertificateNumber: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <Input
                label="Issuing Authority"
                placeholder="e.g. Tehsildar / SDO / Revenue Officer"
                value={financial.issuingAuthority}
                onChange={(e) => setFinancial({ ...financial, issuingAuthority: e.target.value })}
                required
              />
              <Input
                label="Date of Certificate Issue"
                type="date"
                value={financial.issueDate ? financial.issueDate.substring(0, 10) : ''}
                onChange={(e) => setFinancial({ ...financial, issueDate: e.target.value })}
                required
                helperText="Must be issued within current financial year"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <Input
                label="Father's Primary Occupation"
                placeholder="e.g. Agriculture / Salaried / Business"
                value={financial.fatherOccupation}
                onChange={(e) => setFinancial({ ...financial, fatherOccupation: e.target.value })}
              />
              <Input
                label="Mother's Primary Occupation"
                placeholder="e.g. Homemaker / Self-employed"
                value={financial.motherOccupation}
                onChange={(e) => setFinancial({ ...financial, motherOccupation: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* ================= STEP 5: BANK DETAILS ================= */}
        {currentStep === 5 && (
          <div className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-5">
            <SectionHeading
              title="Step 5: Bank Account & Direct Benefit Transfer (DBT) Details"
              hindiTitle="बैंक खाता एवं डीबीटी विवरण"
              subtitle="Account must be in applicant's name and seeded with Aadhaar on the NPCI mapper"
              accentColor="blue"
            />

            <Alert variant="info" title="Direct Benefit Transfer (DBT) Mandate">
              Fellowship and maintenance allowances are disbursed electronically via PFMS/DBT gateway. Under no circumstances can third-party or joint accounts with parents be approved.
            </Alert>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <Input
                label="Bank Account Holder Name"
                placeholder="Strictly matching Aadhaar"
                value={bank.accountHolderName}
                onChange={(e) => setBank({ ...bank, accountHolderName: e.target.value })}
                required
              />
              <Input
                label="Bank Name"
                placeholder="e.g. State Bank of India, Punjab National Bank"
                value={bank.bankName}
                onChange={(e) => setBank({ ...bank, bankName: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <Input
                label="Bank Account Number"
                type="password"
                placeholder="Enter complete account number"
                value={bank.accountNumber}
                onChange={(e) => setBank({ ...bank, accountNumber: e.target.value })}
                required
              />
              <Input
                label="Confirm Bank Account Number"
                placeholder="Re-enter account number"
                value={bank.confirmAccountNumber}
                onChange={(e) => setBank({ ...bank, confirmAccountNumber: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <Input
                label="IFS Code (11 Characters)"
                placeholder="e.g. SBIN0000167"
                value={bank.ifscCode}
                onChange={(e) => setBank({ ...bank, ifscCode: e.target.value.toUpperCase() })}
                required
              />
              <Input
                label="Branch Name & City"
                placeholder="e.g. Main Branch, Ranchi"
                value={bank.branchName}
                onChange={(e) => setBank({ ...bank, branchName: e.target.value })}
                required
              />
            </div>

            <div className="pt-2 border-t border-slate-200">
              <Checkbox
                label="Aadhaar Seeding Confirmation"
                description="I certify that this bank account is actively seeded with my Aadhaar on the NPCI gateway for electronic DBT welfare transfers."
                checked={bank.isAadhaarSeeded}
                onChange={(e) => setBank({ ...bank, isAadhaarSeeded: e.target.checked })}
                required
              />
            </div>
          </div>
        )}

        {/* ================= STEP 6: DOCUMENTS ================= */}
        {currentStep === 6 && (
          <div className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-5">
            <SectionHeading
              title="Step 6: Upload Supporting Documents"
              hindiTitle="सहायक दस्तावेज़ अपलोड"
              subtitle="Upload clear scanned copies matching the statutory requirements for this scheme"
              accentColor="saffron"
            />

            <Alert variant="warning" title="Document Legibility Requirement">
              All certificates must be sharp, unblurred, and show official stamps/signatures clearly. Our assistive verification tools will cross-check names and certificate numbers against state databases.
            </Alert>

            <div className="space-y-4">
              {scheme?.requiredDocuments?.map((reqDoc) => {
                const attached = documents.find((d) => d.documentType === reqDoc.code && d.fileName);

                return (
                  <div key={reqDoc.code} className="border border-slate-200 rounded p-4 bg-slate-50/50">
                    <FileUpload
                      label={`${reqDoc.name} ${reqDoc.isMandatory ? '(Mandatory *)' : '(Optional)'}`}
                      name={reqDoc.code}
                      accept={reqDoc.allowedFormats?.join(',') || '.pdf'}
                      maxSizeMB={reqDoc.maxSizeMB || 2}
                      required={reqDoc.isMandatory}
                      value={attached ? { name: attached.fileName, size: attached.fileSizeMB * 1024 * 1024 } : null}
                      onChange={(file) => handleFileAttach(reqDoc.code, reqDoc.name, file)}
                      onRemove={() => handleFileRemove(reqDoc.code)}
                      helperText={reqDoc.description}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 7: REVIEW ================= */}
        {currentStep === 7 && (
          <div className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-6">
            <SectionHeading
              title="Step 7: Comprehensive Application Review"
              hindiTitle="आवेदन पत्र का संपूर्ण पुनरावलोकन"
              subtitle="Please verify all entries before proceeding to final submission"
              accentColor="blue"
            />

            {/* Review: Personal */}
            <div className="border border-slate-200 rounded p-4 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                <h4 className="font-bold text-[#0c2340] text-xs uppercase tracking-wider">
                  1. Personal Details
                </h4>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-[#0c2340] underline font-semibold cursor-pointer"
                >
                  Edit Step 1
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-700">
                <div><span className="text-slate-500 block text-[11px]">Full Name:</span> <strong>{personal.fullName}</strong></div>
                <div><span className="text-slate-500 block text-[11px]">Father's Name:</span> <span>{personal.fatherOrGuardianName}</span></div>
                <div><span className="text-slate-500 block text-[11px]">Gender & DOB:</span> <span>{personal.gender} • {personal.dateOfBirth?.substring(0, 10)}</span></div>
                <div><span className="text-slate-500 block text-[11px]">Tribe / Caste:</span> <strong>{personal.tribalCommunity}</strong></div>
                <div><span className="text-slate-500 block text-[11px]">Caste Cert No:</span> <span className="font-mono">{personal.casteCertificateNumber}</span></div>
                <div><span className="text-slate-500 block text-[11px]">Mobile:</span> <span className="font-mono">{personal.mobile}</span></div>
                <div><span className="text-slate-500 block text-[11px]">Email:</span> <span>{personal.email}</span></div>
                <div><span className="text-slate-500 block text-[11px]">State / District:</span> <span>{personal.state} ({personal.district})</span></div>
              </div>
            </div>

            {/* Review: Academic */}
            <div className="border border-slate-200 rounded p-4 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                <h4 className="font-bold text-[#0c2340] text-xs uppercase tracking-wider">
                  2. Academic & Enrollment Details
                </h4>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs text-[#0c2340] underline font-semibold cursor-pointer"
                >
                  Edit Step 2
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-700">
                <div><span className="text-slate-500 block text-[11px]">Qualifying Degree:</span> <strong>{academic.qualifyingDegree}</strong></div>
                <div><span className="text-slate-500 block text-[11px]">Marks / CGPA:</span> <span className="font-bold text-emerald-800">{academic.percentageOrCgpa}</span></div>
                <div><span className="text-slate-500 block text-[11px]">Enrolled Course:</span> <strong>{academic.enrolledCourse}</strong></div>
                <div><span className="text-slate-500 block text-[11px]">Enrolled University:</span> <span>{academic.enrolledInstitution}</span></div>
                {academic.researchTopic && (
                  <div className="col-span-2"><span className="text-slate-500 block text-[11px]">Research Topic:</span> <em>{academic.researchTopic}</em></div>
                )}
                {academic.supervisorName && (
                  <div className="col-span-2"><span className="text-slate-500 block text-[11px]">Research Supervisor:</span> <span>{academic.supervisorName}</span></div>
                )}
              </div>
            </div>

            {/* Review: Financial & Bank */}
            <div className="border border-slate-200 rounded p-4 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                <h4 className="font-bold text-[#0c2340] text-xs uppercase tracking-wider">
                  3. Financial & Bank (DBT) Information
                </h4>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="text-xs text-[#0c2340] underline font-semibold cursor-pointer"
                >
                  Edit Financial / Bank
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-700">
                <div><span className="text-slate-500 block text-[11px]">Annual Family Income:</span> <strong className="font-mono">₹{financial.annualFamilyIncome?.toLocaleString('en-IN')}</strong></div>
                <div><span className="text-slate-500 block text-[11px]">Income Cert No:</span> <span className="font-mono">{financial.incomeCertificateNumber}</span></div>
                <div><span className="text-slate-500 block text-[11px]">Bank Name:</span> <span>{bank.bankName}</span></div>
                <div><span className="text-slate-500 block text-[11px]">Account No:</span> <span className="font-mono font-bold">****{bank.accountNumber.slice(-4)}</span></div>
                <div><span className="text-slate-500 block text-[11px]">IFSC Code:</span> <span className="font-mono">{bank.ifscCode}</span></div>
                <div><span className="text-slate-500 block text-[11px]">Aadhaar Seeded:</span> <span className="text-emerald-700 font-semibold">Yes (Confirmed)</span></div>
              </div>
            </div>

            {/* Review: Documents */}
            <div className="border border-slate-200 rounded p-4 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                <h4 className="font-bold text-[#0c2340] text-xs uppercase tracking-wider">
                  4. Attached Supporting Documents
                </h4>
                <button
                  type="button"
                  onClick={() => setCurrentStep(6)}
                  className="text-xs text-[#0c2340] underline font-semibold cursor-pointer"
                >
                  Edit Documents
                </button>
              </div>

              <div className="space-y-1 text-xs">
                {documents.filter((d) => d.fileName).map((doc) => (
                  <div key={doc.documentType} className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                    <span className="font-medium text-slate-800">{doc.documentName}</span>
                    <span className="font-mono text-[11px] text-slate-500">{doc.fileName} ({doc.fileSizeMB} MB)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 8: STATUTORY DECLARATION & SUBMIT ================= */}
        {currentStep === 8 && (
          <div className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-6">
            <SectionHeading
              title="Step 8: Statutory Declaration & Final Submission"
              hindiTitle="वैधानिक घोषणा एवं अंतिम प्रस्तुति"
              subtitle="Legally binding undertaking under the Constitution of India"
              accentColor="saffron"
            />

            <div className="bg-slate-50 border border-slate-300 rounded p-5 space-y-3 text-xs text-slate-700 leading-relaxed">
              <h4 className="font-bold text-[#0c2340] text-xs uppercase tracking-wider">
                Statutory Undertaking by the Candidate:
              </h4>

              <p>
                1. I hereby solemnly declare that all statements made in this application are true, complete, and correct to the best of my knowledge and belief.
              </p>
              <p>
                2. I belong to the Scheduled Tribe (ST) community recognized by the President of India under Article 342 of the Constitution.
              </p>
              <p>
                3. I am not in receipt of any other regular fellowship or financial scholarship from any State Government, Central Government, or UGC during the tenure of this award.
              </p>
              <p>
                4. I fully understand that in the event of any information or certificate being found false, fraudulent, or in violation of scheme norms, my fellowship will be summarily cancelled and the entire disbursed grant shall be recovered with penal interest under the Revenue Recovery Act, besides criminal prosecution under Section 420 of the Indian Penal Code.
              </p>
            </div>

            <div className="p-4 border border-amber-300 bg-amber-50/70 rounded">
              <Checkbox
                label="I solemnly accept the above Statutory Declaration"
                description="I confirm that I have reviewed all entries in Step 7 and authorize the Ministry of Tribal Affairs to verify my certificates against statutory databases."
                checked={statutoryAgreed}
                onChange={(e) => setStatutoryAgreed(e.target.checked)}
                required
              />
            </div>
          </div>
        )}

        {/* Wizard Bottom Navigation Bar */}
        <div className="bg-white border border-slate-300 rounded p-4 shadow-xs flex items-center justify-between gap-3">
          <div>
            {currentStep > 1 ? (
              <Button variant="outline" size="sm" onClick={handlePrev} leftIcon={ChevronLeft}>
                Previous Step
              </Button>
            ) : (
              <Link to="/applicant/dashboard">
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSaveDraft}
              isLoading={savingDraft}
              leftIcon={Save}
            >
              Save Draft
            </Button>

            {currentStep < 8 ? (
              <Button variant="primary" size="sm" onClick={handleNext} rightIcon={ChevronRight}>
                Save & Proceed
              </Button>
            ) : (
              <Button
                variant="accent"
                size="md"
                onClick={handleFinalSubmit}
                isLoading={submitting}
                disabled={!statutoryAgreed || submitting}
                leftIcon={Send}
              >
                Submit Application (Lock)
              </Button>
            )}
          </div>
        </div>

      </div>
    </PageContainer>
  );
};

export default ApplyScheme;
