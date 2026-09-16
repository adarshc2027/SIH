import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  PageContainer,
  SectionHeading,
  Button,
  StatusBadge,
  Alert,
  Modal,
  DeficiencyTimeline
} from '../../components/ui';
import {
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  PlusCircle,
  RotateCcw,
  Check
} from 'lucide-react';
import { getMyApplicationsApi } from '../../services/applicationApi';
import {
  getDeficienciesByApplicationApi,
  raiseDeficiencyApi,
  reviewDeficiencyApi
} from '../../services/deficiencyApi';

export const VerifierDashboard = () => {
  const { user, logout } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const [appDeficiencies, setAppDeficiencies] = useState([]);
  const [loadingDefs, setLoadingDefs] = useState(false);

  const [raiseModalOpen, setRaiseModalOpen] = useState(false);
  const [defReason, setDefReason] = useState('Caste Certificate Legibility');
  const [defDescription, setDefDescription] = useState('');
  const [defRequiredAction, setDefRequiredAction] = useState(
    'Please upload a clear scanned digital copy bearing official digital signature or QR code.'
  );
  const [defDeadlineDays, setDefDeadlineDays] = useState(7);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [submittingDef, setSubmittingDef] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedDeficiency, setSelectedDeficiency] = useState(null);
  const [officerReviewRemarks, setOfficerReviewRemarks] = useState('');
  const [reviewAction, setReviewAction] = useState('resolve');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchWorklist = async () => {
    try {
      setLoading(true);
      const res = await getMyApplicationsApi();
      if (res?.success && Array.isArray(res.data)) {
        setApplications(res.data);
        if (res.data.length > 0 && !selectedApp) {
          setSelectedApp(res.data[0]);
        }
      }
    } catch (err) {
      console.warn('Failed to load live worklist:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorklist();
  }, []);

  useEffect(() => {
    if (selectedApp?._id) {
      fetchApplicationDeficiencies(selectedApp._id);
    }
  }, [selectedApp]);

  const fetchApplicationDeficiencies = async (appId) => {
    try {
      setLoadingDefs(true);
      const res = await getDeficienciesByApplicationApi(appId);
      if (res?.success && Array.isArray(res.data?.deficiencies)) {
        setAppDeficiencies(res.data.deficiencies);
      }
    } catch (err) {
      console.warn('Failed to fetch deficiencies:', err.message);
    } finally {
      setLoadingDefs(false);
    }
  };

  const handleRaiseDeficiency = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      setSubmittingDef(true);
      setActionError('');
      setActionSuccess('');

      const payload = {
        applicationId: selectedApp._id,
        documentId: selectedDocId || undefined,
        reason: defReason,
        description: defDescription,
        requiredAction: defRequiredAction,
        deadlineDays: Number(defDeadlineDays)
      };

      const res = await raiseDeficiencyApi(payload);
      if (res?.success) {
        setActionSuccess('Deficiency successfully registered and applicant notified.');
        setRaiseModalOpen(false);
        setDefDescription('');
        fetchApplicationDeficiencies(selectedApp._id);
        fetchWorklist();
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to raise deficiency.');
    } finally {
      setSubmittingDef(false);
    }
  };

  const handleReviewDeficiency = async (e) => {
    e.preventDefault();
    if (!selectedDeficiency) return;

    try {
      setSubmittingReview(true);
      setActionError('');
      setActionSuccess('');

      const payload = {
        action: reviewAction,
        officerRemarks: officerReviewRemarks
      };

      const res = await reviewDeficiencyApi(selectedDeficiency._id, payload);
      if (res?.success) {
        setActionSuccess(`Deficiency action '${reviewAction}' processed successfully.`);
        setReviewModalOpen(false);
        setOfficerReviewRemarks('');
        fetchApplicationDeficiencies(selectedApp._id);
        fetchWorklist();
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to review deficiency.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <PageContainer
      title="Verification Officer Scrutiny Desk"
      hindiTitle="सत्यापन अधिकारी डेस्क"
      description="Official portal for Level-1 document scrutiny, Aadhaar validation, certificate consistency checking, and deficiency reporting."
      breadcrumbs={[{ label: 'Verifier Desk', href: '/verifier/dashboard' }]}
      action={
        <Button variant="outline" size="sm" onClick={logout} leftIcon={LogOut}>
          Sign Out
        </Button>
      }
    >
      <div className="space-y-6">
        <Alert variant="info" title="Authorized Official Desk Active">
          Authenticated as <strong>{user?.name}</strong> [Level-1 Scrutiny Officer]. All verification actions are logged in the statutory audit trail under Section 43 of the IT Act.
        </Alert>

        {actionSuccess && (
          <Alert variant="success" onClose={() => setActionSuccess('')}>
            {actionSuccess}
          </Alert>
        )}

        {actionError && (
          <Alert variant="error" onClose={() => setActionError('')}>
            {actionError}
          </Alert>
        )}

        {/* Officer Profile & Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-300 rounded p-4 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Officer Identity
            </span>
            <h3 className="font-bold text-slate-900 text-sm">{user?.name}</h3>
            <p className="text-xs text-slate-600 font-mono">{user?.email}</p>
            <div className="pt-1">
              <StatusBadge status="verified" label="Active Verifier" size="sm" />
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded p-4 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Assigned Queue
            </span>
            <span className="text-2xl font-bold font-mono text-[#0c2340]">
              {applications.length} Records
            </span>
            <p className="text-xs text-slate-500">Active applications awaiting scrutiny</p>
          </div>

          <div className="bg-white border border-slate-300 rounded p-4 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Deficiencies Active
            </span>
            <span className="text-2xl font-bold font-mono text-orange-700">
              {appDeficiencies.filter((d) => d.status === 'open').length} Open
            </span>
            <p className="text-xs text-slate-500">Awaiting applicant correction</p>
          </div>

          <div className="bg-white border border-slate-300 rounded p-4 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Responses to Review
            </span>
            <span className="text-2xl font-bold font-mono text-amber-600">
              {appDeficiencies.filter((d) => d.status === 'responded').length} Responded
            </span>
            <p className="text-xs text-slate-500">Applicant uploaded corrected documents</p>
          </div>
        </div>

        {/* Main Worklist & Inspection Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (5 Cols): Applications Worklist */}
          <div className="lg:col-span-5 bg-white border border-slate-300 rounded shadow-2xs overflow-hidden">
            <div className="p-3.5 bg-slate-100 border-b border-slate-300 flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase text-[#0c2340] tracking-wider">
                Scrutiny Worklist ({applications.length})
              </h3>
              <Button variant="ghost" size="sm" onClick={fetchWorklist}>
                Refresh
              </Button>
            </div>

            <div className="divide-y divide-slate-200 max-h-[600px] overflow-y-auto">
              {applications.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No active applications found in scrutiny queue.
                </div>
              ) : (
                applications.map((app) => {
                  const isSelected = selectedApp?._id === app._id;
                  return (
                    <div
                      key={app._id}
                      onClick={() => setSelectedApp(app)}
                      className={`p-3.5 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-blue-50/80 border-l-4 border-l-[#113f67]'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {app.applicationNumber}
                        </span>
                        <StatusBadge status={app.status} size="sm" />
                      </div>

                      <div className="mt-1 text-xs text-slate-600 space-y-0.5">
                        <p className="font-semibold text-[#0c2340]">
                          {app.personalDetails?.fullName || 'Applicant'}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {app.scheme?.name || 'Fellowship Scheme'}
                        </p>
                      </div>

                      <div className="mt-2 text-[10px] text-slate-400 font-mono flex items-center justify-between">
                        <span>Course: {app.academicDetails?.enrolledCourse || 'Research'}</span>
                        <span>{app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-IN') : ''}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column (7 Cols): Application Scrutiny & Deficiency Panel */}
          <div className="lg:col-span-7 space-y-5">
            {selectedApp ? (
              <>
                {/* Application Header Card */}
                <div className="bg-white border border-slate-300 rounded p-5 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#0c2340]">
                          {selectedApp.applicationNumber}
                        </h3>
                        <StatusBadge status={selectedApp.status} size="sm" />
                      </div>
                      <p className="text-xs text-slate-600">
                        {selectedApp.scheme?.name} ({selectedApp.scheme?.code})
                      </p>
                    </div>

                    <Button
                      variant="accent"
                      size="sm"
                      leftIcon={PlusCircle}
                      onClick={() => {
                        setSelectedDocId('');
                        setRaiseModalOpen(true);
                      }}
                    >
                      Raise Deficiency
                    </Button>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded border border-slate-200">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Applicant Name:</span>
                      <strong className="text-slate-800 font-semibold">
                        {selectedApp.personalDetails?.fullName}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Community / Tribe:</span>
                      <strong className="text-slate-800 font-semibold">
                        {selectedApp.personalDetails?.tribalCommunity || 'ST'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Caste Cert No:</span>
                      <strong className="font-mono text-slate-800">
                        {selectedApp.personalDetails?.casteCertificateNumber || 'N/A'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Annual Income:</span>
                      <strong className="font-mono text-slate-800">
                        ₹{selectedApp.financialDetails?.annualFamilyIncome?.toLocaleString('en-IN') || '0'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Institution:</span>
                      <strong className="text-slate-800 truncate block">
                        {selectedApp.academicDetails?.enrolledInstitution || 'Recognized University'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Submitted Date:</span>
                      <strong className="font-mono text-slate-800">
                        {selectedApp.submittedAt
                          ? new Date(selectedApp.submittedAt).toLocaleDateString('en-IN')
                          : 'In Draft'}
                      </strong>
                    </div>
                  </div>

                  {/* Documents Checklist for this Application */}
                  <div className="space-y-2 pt-2">
                    <h4 className="font-bold text-[#0c2340] text-xs uppercase tracking-wider">
                      Attached Documents ({selectedApp.documents?.length || 0})
                    </h4>
                    <div className="border border-slate-200 rounded overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                          <tr>
                            <th className="p-2 text-left">Document Type</th>
                            <th className="p-2 text-left">File Name</th>
                            <th className="p-2 text-center">Status</th>
                            <th className="p-2 text-right">Scrutiny Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {selectedApp.documents?.map((doc, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-2 font-semibold text-slate-800">
                                {doc.documentName || doc.documentType}
                              </td>
                              <td className="p-2 font-mono text-[11px] text-slate-600">
                                {doc.fileName}
                              </td>
                              <td className="p-2 text-center">
                                <StatusBadge status={doc.status} size="sm" />
                              </td>
                              <td className="p-2 text-right space-x-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setDefReason(`Discrepancy in ${doc.documentName || doc.documentType}`);
                                    setSelectedDocId('');
                                    setRaiseModalOpen(true);
                                  }}
                                >
                                  Flag Deficient
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Deficiencies Section for Selected Application */}
                <div className="bg-white border border-slate-300 rounded p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div>
                      <h4 className="font-bold text-[#0c2340] text-sm">
                        Deficiency Records & Resolution Workflow
                      </h4>
                      <p className="text-xs text-slate-500">
                        Formal notices issued against this application under MoTA operational guidelines
                      </p>
                    </div>

                    <span className="font-mono text-xs text-slate-500">
                      {appDeficiencies.length} Deficiency Logged
                    </span>
                  </div>

                  {appDeficiencies.length === 0 ? (
                    <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded text-center text-xs text-slate-500">
                      No deficiencies currently raised against this application. All documents verified clean.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {appDeficiencies.map((def) => (
                        <div
                          key={def._id}
                          className="border border-slate-300 rounded p-4 space-y-3 bg-white shadow-2xs"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-[#0c2340]">
                                {def.reason}
                              </span>
                              {def.documentType && (
                                <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                                  {def.documentType}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <StatusBadge status={def.status} size="sm" />
                              <span className="text-[11px] text-red-700 font-mono">
                                Due: {new Date(def.deadline).toLocaleDateString('en-IN')}
                              </span>
                            </div>
                          </div>

                          <div className="text-xs space-y-1.5 text-slate-700">
                            <div>
                              <strong className="text-slate-900 block text-[11px]">Observation / Reason:</strong>
                              <p className="bg-slate-50 p-2 rounded border border-slate-200">
                                {def.description}
                              </p>
                            </div>

                            <div>
                              <strong className="text-slate-900 block text-[11px]">Mandatory Action Required:</strong>
                              <p className="bg-amber-50/70 text-amber-950 p-2 rounded border border-amber-200">
                                {def.requiredAction}
                              </p>
                            </div>

                            {/* Applicant Response Block if submitted */}
                            {def.applicantRemarks && (
                              <div className="bg-blue-50/60 border border-blue-200 rounded p-2.5 space-y-1">
                                <div className="flex items-center justify-between text-[11px]">
                                  <strong className="text-[#0c2340]">Applicant Response & Undertaking:</strong>
                                  <span className="font-mono text-slate-500">
                                    Responded on: {new Date(def.respondedAt).toLocaleDateString('en-IN')}
                                  </span>
                                </div>
                                <p className="text-slate-800 leading-relaxed">
                                  {def.applicantRemarks}
                                </p>
                                {def.resubmittedDocument && (
                                  <div className="pt-1 flex items-center gap-1.5 text-[11px] text-emerald-800">
                                    <FileCheck className="w-3.5 h-3.5" />
                                    <span>Corrected document attached for re-scrutiny</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Officer Resolution remarks if already resolved */}
                            {def.officerResolutionRemarks && (
                              <div className="bg-emerald-50/60 border border-emerald-200 rounded p-2.5 space-y-1">
                                <div className="flex items-center justify-between text-[11px]">
                                  <strong className="text-emerald-950">Scrutiny Desk Resolution:</strong>
                                  <span className="font-mono text-slate-500">
                                    {def.resolvedAt && new Date(def.resolvedAt).toLocaleDateString('en-IN')}
                                  </span>
                                </div>
                                <p className="text-slate-800">
                                  {def.officerResolutionRemarks}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* 5-Step Visual Timeline Component */}
                          <DeficiencyTimeline deficiency={def} />

                          {/* Official Review Action Button for Open / Responded Deficiencies */}
                          {(def.status === 'responded' || def.status === 'open') && (
                            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                              <Button
                                variant="primary"
                                size="sm"
                                leftIcon={Check}
                                onClick={() => {
                                  setSelectedDeficiency(def);
                                  setReviewAction('resolve');
                                  setOfficerReviewRemarks('Document verified and deficiency resolved satisfactorily.');
                                  setReviewModalOpen(true);
                                }}
                              >
                                Accept & Resolve Deficiency
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                leftIcon={RotateCcw}
                                onClick={() => {
                                  setSelectedDeficiency(def);
                                  setReviewAction('request_correction');
                                  setOfficerReviewRemarks('Uploaded document is still not legible. Please resubmit.');
                                  setReviewModalOpen(true);
                                }}
                              >
                                Request Further Correction
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white border border-slate-300 rounded p-10 text-center space-y-2">
                <ShieldCheck className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">Select an Application</h4>
                <p className="text-xs text-slate-500">
                  Select an application from the scrutiny worklist on the left to review documents and manage deficiencies.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Raise Deficiency */}
      <Modal
        isOpen={raiseModalOpen}
        onClose={() => setRaiseModalOpen(false)}
        title="Raise Statutory Deficiency"
        subtitle={`Application: ${selectedApp?.applicationNumber || ''} • Ministry Scrutiny Desk`}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleRaiseDeficiency} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Deficiency Category / Reason *
            </label>
            <select
              value={defReason}
              onChange={(e) => setDefReason(e.target.value)}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white focus:ring-1 focus:ring-[#113f67] outline-hidden"
              required
            >
              <option value="Caste Certificate Legibility">Caste Certificate Legibility (Blurred seal/signature)</option>
              <option value="Income Certificate Expired">Income Certificate Expired / Not for current financial year</option>
              <option value="Academic Marksheet Discrepancy">Academic Marksheet Discrepancy (CGPA to % mismatch)</option>
              <option value="Admission Letter Not Confirmed">Admission Letter Not Confirmed / Provisional without fee</option>
              <option value="Host University QS Rank Outside Limit">Host University QS Ranking Discrepancy (NOS Scheme)</option>
              <option value="Aadhaar Seeding / DBT Issue">Bank Account Not Aadhaar-Seeded for DBT</option>
              <option value="Other Discrepancy">Other Statutory Discrepancy</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Detailed Observation / Reason *
            </label>
            <textarea
              value={defDescription}
              onChange={(e) => setDefDescription(e.target.value)}
              rows={3}
              placeholder="State clear reasons why the application/document cannot be accepted in its current state..."
              className="w-full border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-[#113f67] outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Mandatory Action Required from Applicant *
            </label>
            <textarea
              value={defRequiredAction}
              onChange={(e) => setDefRequiredAction(e.target.value)}
              rows={2}
              placeholder="Explicit instructions for the candidate (e.g., upload digital e-District certificate)..."
              className="w-full border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-[#113f67] outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Corrective Response Deadline (Calendar Days) *
            </label>
            <input
              type="number"
              min="3"
              max="30"
              value={defDeadlineDays}
              onChange={(e) => setDefDeadlineDays(e.target.value)}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#113f67] outline-hidden"
              required
            />
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Applicant will be given {defDeadlineDays} days to submit rectified response before application freeze.
            </span>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRaiseModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              size="sm"
              disabled={submittingDef}
            >
              {submittingDef ? 'Registering...' : 'Confirm & Raise Deficiency'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Review Deficiency */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Official Scrutiny: Review Applicant Response"
        subtitle={`Deficiency: ${selectedDeficiency?.reason || ''}`}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleReviewDeficiency} className="space-y-4 text-xs">
          <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
            <strong className="text-slate-900 block text-[11px]">Applicant Response:</strong>
            <p className="text-slate-700 italic">
              "{selectedDeficiency?.applicantRemarks || 'No statement provided'}"
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Officer Scrutiny Decision *
            </label>
            <select
              value={reviewAction}
              onChange={(e) => setReviewAction(e.target.value)}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white focus:ring-1 focus:ring-[#113f67] outline-hidden"
              required
            >
              <option value="resolve">Accept Response & Mark Deficiency Resolved</option>
              <option value="request_correction">Reject Correction & Re-open Deficiency</option>
              <option value="close">Close Administratively</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Officer Scrutiny Remarks *
            </label>
            <textarea
              value={officerReviewRemarks}
              onChange={(e) => setOfficerReviewRemarks(e.target.value)}
              rows={3}
              placeholder="Record remarks for statutory audit trail..."
              className="w-full border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-[#113f67] outline-hidden"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setReviewModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={submittingReview}
            >
              {submittingReview ? 'Submitting...' : 'Submit Official Decision'}
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
};

export default VerifierDashboard;
