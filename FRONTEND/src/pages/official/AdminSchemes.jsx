import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PageContainer,
  SectionHeading,
  Button,
  StatusBadge,
  Alert,
  Table,
  TableSkeleton,
  Modal,
  Input,
  Select,
  Textarea,
  Checkbox
} from '../../components/ui';
import {
  getSchemesApi,
  createSchemeApi,
  updateSchemeApi,
  deleteSchemeApi
} from '../../services/schemeApi';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  RefreshCw,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  FileCheck,
  CheckCircle2,
  X
} from 'lucide-react';

export const AdminSchemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmScheme, setDeleteConfirmScheme] = useState(null);

  // Form State
  const initialFormState = {
    name: '',
    code: '',
    hindiName: '',
    type: 'scholarship',
    status: 'active',
    academicLevel: 'M.Phil / Ph.D.',
    annualSlots: '750 Scholars',
    incomeLimit: 'No Income Ceiling',
    applicationStartDate: '2026-08-01',
    applicationEndDate: '2026-10-31',
    description: '',
    financialBenefits: '',
    eligibilityRules: ['Candidate must belong to a Scheduled Tribe (ST) category.'],
    requiredDocuments: [
      {
        name: 'Scheduled Tribe (ST) Certificate',
        code: 'CASTE_CERT',
        isMandatory: true,
        description: 'Issued by competent State Revenue Authority',
        maxSizeMB: 2,
        allowedFormats: ['.pdf']
      }
    ]
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchSchemes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSchemesApi();
      setSchemes(res.data?.schemes || []);
    } catch (err) {
      setError(err.message || 'Failed to load schemes for administration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const handleOpenCreate = () => {
    setEditingScheme(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (scheme) => {
    setEditingScheme(scheme);
    setFormData({
      name: scheme.name || '',
      code: scheme.code || '',
      hindiName: scheme.hindiName || '',
      type: scheme.type || 'scholarship',
      status: scheme.status || 'active',
      academicLevel: scheme.academicLevel || '',
      annualSlots: scheme.annualSlots || '',
      incomeLimit: scheme.incomeLimit || '',
      applicationStartDate: scheme.applicationStartDate ? scheme.applicationStartDate.substring(0, 10) : '',
      applicationEndDate: scheme.applicationEndDate ? scheme.applicationEndDate.substring(0, 10) : '',
      description: scheme.description || '',
      financialBenefits: scheme.financialBenefits || '',
      eligibilityRules: scheme.eligibilityRules?.length > 0 ? [...scheme.eligibilityRules] : [''],
      requiredDocuments: scheme.requiredDocuments?.length > 0 ? [...scheme.requiredDocuments] : []
    });
    setIsModalOpen(true);
  };

  // Dynamic Eligibility Rule Row Management
  const handleAddRule = () => {
    setFormData((prev) => ({
      ...prev,
      eligibilityRules: [...prev.eligibilityRules, '']
    }));
  };

  const handleRuleChange = (index, value) => {
    const updated = [...formData.eligibilityRules];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, eligibilityRules: updated }));
  };

  const handleRemoveRule = (index) => {
    const updated = formData.eligibilityRules.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, eligibilityRules: updated }));
  };

  // Dynamic Required Document Row Management
  const handleAddDocument = () => {
    setFormData((prev) => ({
      ...prev,
      requiredDocuments: [
        ...prev.requiredDocuments,
        {
          name: '',
          code: 'DOC_' + (prev.requiredDocuments.length + 1),
          isMandatory: true,
          description: '',
          maxSizeMB: 2,
          allowedFormats: ['.pdf']
        }
      ]
    }));
  };

  const handleDocumentChange = (index, field, value) => {
    const updated = [...formData.requiredDocuments];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, requiredDocuments: updated }));
  };

  const handleRemoveDocument = (index) => {
    const updated = formData.requiredDocuments.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, requiredDocuments: updated }));
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    // Clean eligibility rules
    const cleanRules = formData.eligibilityRules.filter((r) => r.trim() !== '');

    const payload = {
      ...formData,
      eligibilityRules: cleanRules
    };

    try {
      if (editingScheme) {
        await updateSchemeApi(editingScheme._id, payload);
        setFeedback({ type: 'success', message: `Scheme '${formData.code}' updated successfully.` });
      } else {
        await createSchemeApi(payload);
        setFeedback({ type: 'success', message: `New Scheme '${formData.code}' created and published.` });
      }
      setIsModalOpen(false);
      fetchSchemes();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Operation failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Handler
  const handleDeleteScheme = async () => {
    if (!deleteConfirmScheme) return;
    try {
      await deleteSchemeApi(deleteConfirmScheme._id);
      setFeedback({ type: 'success', message: `Scheme '${deleteConfirmScheme.code}' deleted successfully.` });
      setDeleteConfirmScheme(null);
      fetchSchemes();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete scheme.' });
    }
  };

  const columns = [
    {
      header: 'Code',
      accessor: 'code',
      width: '100px',
      render: (val) => <span className="font-mono font-bold text-[#0c2340] text-xs">{val}</span>
    },
    {
      header: 'Scheme Name',
      accessor: 'name',
      render: (val, row) => (
        <div>
          <strong className="text-slate-900 block text-xs">{val}</strong>
          {row.hindiName && <span className="text-[11px] text-slate-500 block">{row.hindiName}</span>}
          <span className="text-[10px] font-mono text-slate-500 uppercase">Type: {row.type}</span>
        </div>
      )
    },
    {
      header: 'Qualification',
      accessor: 'academicLevel',
      width: '180px',
      render: (val) => <span className="text-xs text-slate-700">{val}</span>
    },
    {
      header: 'Quota / Slots',
      accessor: 'annualSlots',
      width: '130px',
      render: (val) => <span className="text-xs font-semibold text-slate-800">{val}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      width: '100px',
      render: (val) => <StatusBadge status={val === 'active' ? 'verified' : val} label={val} size="sm" />
    },
    {
      header: 'Administration Actions',
      accessor: '_id',
      width: '200px',
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <Link to={`/schemes/${row.code || row._id}`} target="_blank">
            <Button variant="ghost" size="sm" title="View Public Page" leftIcon={Eye}>
              View
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenEdit(row)}
            leftIcon={Edit2}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteConfirmScheme(row)}
            leftIcon={Trash2}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <PageContainer
      title="Welfare Scheme Master Administration"
      hindiTitle="योजना मास्टर प्रबंधन"
      description="Manage Central Sector scholarship and fellowship schemes, configurable eligibility criteria, required documents, and application cycles."
      breadcrumbs={[
        { label: 'Admin Dashboard', href: '/admin/dashboard' },
        { label: 'Scheme Master' }
      ]}
      action={
        <div className="flex items-center gap-2">
          <Link to="/admin/dashboard">
            <Button variant="outline" size="sm" leftIcon={ArrowLeft}>
              Back to Desk
            </Button>
          </Link>
          <Button variant="primary" size="sm" onClick={handleOpenCreate} leftIcon={Plus}>
            Create New Scheme
          </Button>
        </div>
      }
    >
      <div className="space-y-6">

        {/* Feedback Alert */}
        {feedback && (
          <Alert
            variant={feedback.type === 'success' ? 'success' : 'error'}
            title={feedback.type === 'success' ? 'Success Notification' : 'Administration Error'}
            dismissible
            onDismiss={() => setFeedback(null)}
          >
            {feedback.message}
          </Alert>
        )}

        {/* Schemes Table Section */}
        <div className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-4">
          <SectionHeading
            title="Configured Schemes Registry"
            hindiTitle="योजनाओं की सूची"
            subtitle="Central Sector schemes published on the National MoTA portal"
            accentColor="blue"
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={fetchSchemes}
                isLoading={loading}
                leftIcon={RefreshCw}
              >
                Sync Registry
              </Button>
            }
          />

          {loading ? (
            <TableSkeleton rows={4} cols={5} />
          ) : error ? (
            <Alert variant="error" title="Registry Error">
              {error}
            </Alert>
          ) : (
            <Table
              columns={columns}
              data={schemes}
              emptyMessage="No schemes found in the database. Click 'Create New Scheme' to configure one."
              footerSummary={
                <span>
                  Total {schemes.length} schemes governed under Ministry database
                </span>
              }
            />
          )}
        </div>

      </div>

      {/* ================= MODAL: CREATE / EDIT SCHEME ================= */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingScheme ? `Edit Scheme: ${editingScheme.code}` : 'Configure New Welfare Scheme'}
        subtitle="All fields, eligibility rules, and document requirements are dynamically stored in MongoDB."
        maxWidth="max-w-3xl"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              isLoading={submitting}
            >
              {editingScheme ? 'Save Changes' : 'Publish Scheme'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Scheme Title (English)"
              placeholder="e.g. National Fellowship for ST"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Scheme Code (Unique)"
              placeholder="e.g. NFST / NOS"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Scheme Title (Hindi)"
              placeholder="e.g. राष्ट्रीय अध्येतावृत्ति"
              value={formData.hindiName}
              onChange={(e) => setFormData({ ...formData, hindiName: e.target.value })}
            />
            <Select
              label="Scheme Category"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={[
                { value: 'fellowship', label: 'Fellowship (M.Phil / Ph.D.)' },
                { value: 'overseas', label: 'Overseas Studies (Abroad)' },
                { value: 'scholarship', label: 'Post-Matric Scholarship' },
                { value: 'other', label: 'Other Welfare Scheme' }
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Academic Qualification Level"
              placeholder="e.g. Full-time M.Phil / Ph.D."
              value={formData.academicLevel}
              onChange={(e) => setFormData({ ...formData, academicLevel: e.target.value })}
              required
            />
            <Input
              label="Annual Quota / Slots"
              placeholder="e.g. 750 Scholars / Demand Based"
              value={formData.annualSlots}
              onChange={(e) => setFormData({ ...formData, annualSlots: e.target.value })}
              required
            />
            <Input
              label="Income Ceiling"
              placeholder="e.g. ₹6,00,000 / No Limit"
              value={formData.incomeLimit}
              onChange={(e) => setFormData({ ...formData, incomeLimit: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Application Start Date"
              type="date"
              value={formData.applicationStartDate}
              onChange={(e) => setFormData({ ...formData, applicationStartDate: e.target.value })}
              required
            />
            <Input
              label="Application End Date"
              type="date"
              value={formData.applicationEndDate}
              onChange={(e) => setFormData({ ...formData, applicationEndDate: e.target.value })}
              required
            />
            <Select
              label="Portal Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'active', label: 'Active / Open' },
                { value: 'closed', label: 'Closed' },
                { value: 'upcoming', label: 'Upcoming' }
              ]}
            />
          </div>

          <Textarea
            label="Scheme Description & Overview"
            rows={3}
            placeholder="Official background and scope of the scheme..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />

          <Textarea
            label="Financial Assistance & Entitlements Breakdown"
            rows={3}
            placeholder="Stipend amounts, contingency, HRA, tuition allowance..."
            value={formData.financialBenefits}
            onChange={(e) => setFormData({ ...formData, financialBenefits: e.target.value })}
            required
          />

          {/* DYNAMIC ELIGIBILITY RULES */}
          <div className="border border-slate-300 rounded p-3 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#0c2340] uppercase tracking-wider text-[11px] block">
                Configurable Eligibility Criteria ({formData.eligibilityRules.length})
              </label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddRule} leftIcon={Plus}>
                Add Criteria
              </Button>
            </div>

            <div className="space-y-2">
              {formData.eligibilityRules.map((rule, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-mono text-slate-500 text-xs w-5">{idx + 1}.</span>
                  <input
                    type="text"
                    value={rule}
                    onChange={(e) => handleRuleChange(idx, e.target.value)}
                    placeholder="Enter eligibility rule (e.g. Min 55% marks, ST Certificate)"
                    className="flex-1 bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800"
                  />
                  {formData.eligibilityRules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRule(idx)}
                      className="p-1 text-red-600 hover:text-red-800 cursor-pointer"
                      title="Remove rule"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* DYNAMIC REQUIRED DOCUMENTS */}
          <div className="border border-slate-300 rounded p-3 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#0c2340] uppercase tracking-wider text-[11px] block">
                Configurable Required Documents ({formData.requiredDocuments.length})
              </label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddDocument} leftIcon={Plus}>
                Add Document
              </Button>
            </div>

            <div className="space-y-2">
              {formData.requiredDocuments.map((doc, idx) => (
                <div key={idx} className="p-2.5 bg-white border border-slate-300 rounded grid grid-cols-12 gap-2 items-center text-xs">
                  <div className="col-span-5">
                    <input
                      type="text"
                      placeholder="Document Name (e.g., ST Certificate)"
                      value={doc.name}
                      onChange={(e) => handleDocumentChange(idx, 'name', e.target.value)}
                      className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
                      required
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      placeholder="Code (e.g., CASTE_CERT)"
                      value={doc.code}
                      onChange={(e) => handleDocumentChange(idx, 'code', e.target.value.toUpperCase())}
                      className="w-full border border-slate-300 rounded px-2 py-1 font-mono text-xs"
                      required
                    />
                  </div>
                  <div className="col-span-2 flex items-center gap-1">
                    <input
                      type="checkbox"
                      id={`mand-${idx}`}
                      checked={doc.isMandatory}
                      onChange={(e) => handleDocumentChange(idx, 'isMandatory', e.target.checked)}
                      className="rounded border-slate-300"
                    />
                    <label htmlFor={`mand-${idx}`} className="text-[11px] text-slate-700 cursor-pointer">
                      Mandatory
                    </label>
                  </div>
                  <div className="col-span-1">
                    <input
                      type="number"
                      title="Max size in MB"
                      value={doc.maxSizeMB}
                      onChange={(e) => handleDocumentChange(idx, 'maxSizeMB', Number(e.target.value))}
                      className="w-full border border-slate-300 rounded px-1 py-1 text-xs font-mono"
                    />
                  </div>
                  <div className="col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument(idx)}
                      className="p-1 text-red-600 hover:text-red-800 cursor-pointer"
                      title="Remove document"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </form>
      </Modal>

      {/* ================= MODAL: DELETE CONFIRMATION ================= */}
      <Modal
        isOpen={!!deleteConfirmScheme}
        onClose={() => setDeleteConfirmScheme(null)}
        title="Confirm Scheme Deletion"
        subtitle="This action will permanently remove the scheme from the portal"
        maxWidth="max-w-md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setDeleteConfirmScheme(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteScheme}>
              Yes, Delete Scheme
            </Button>
          </>
        }
      >
        {deleteConfirmScheme && (
          <div className="space-y-2 text-xs text-slate-700">
            <Alert variant="error" title="Warning">
              Are you sure you want to remove <strong>{deleteConfirmScheme.name}</strong> ({deleteConfirmScheme.code})? This will affect any linked applications.
            </Alert>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default AdminSchemes;
