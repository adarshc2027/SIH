import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PageContainer,
  SectionHeading,
  Table,
  StatusBadge,
  Button,
  Alert,
  Input,
  Select,
  TableSkeleton,
  ErrorState
} from '../components/ui';
import { getSchemesApi } from '../services/schemeApi';
import {
  FileText,
  ArrowRight,
  Search,
  Filter,
  Calendar,
  GraduationCap,
  Plane,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export const Schemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const fetchSchemes = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (typeFilter) params.type = typeFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await getSchemesApi(params);
      setSchemes(res.data?.schemes || []);
    } catch (err) {
      setError(err.message || 'Failed to load welfare schemes from Ministry servers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [typeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSchemes();
  };

  const columns = [
    {
      header: 'Scheme Code',
      accessor: 'code',
      width: '130px',
      render: (val, row) => (
        <span className="font-mono font-bold text-[#0c2340]">
          {val}
        </span>
      )
    },
    {
      header: 'Scheme Title & Category',
      accessor: 'name',
      render: (val, row) => (
        <div>
          <Link
            to={`/schemes/${row.code || row._id}`}
            className="font-bold text-[#0c2340] hover:underline block leading-snug"
          >
            {val}
          </Link>
          {row.hindiName && (
            <span className="text-xs text-slate-500 block mt-0.5">{row.hindiName}</span>
          )}
          <span className="inline-block uppercase text-[10px] font-mono text-slate-500 mt-1">
            Type: {row.type}
          </span>
        </div>
      )
    },
    {
      header: 'Target Qualification',
      accessor: 'academicLevel',
      width: '200px',
      render: (val) => <span className="text-xs text-slate-700">{val}</span>
    },
    {
      header: 'Annual Slots',
      accessor: 'annualSlots',
      width: '140px',
      render: (val) => <span className="font-semibold text-slate-800 text-xs">{val}</span>
    },
    {
      header: 'Income Ceiling',
      accessor: 'incomeLimit',
      width: '150px',
      render: (val) => <span className="text-xs text-slate-600 font-mono">{val || 'No Ceiling'}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      width: '120px',
      render: (val) => <StatusBadge status={val === 'active' ? 'verified' : val} label={val === 'active' ? 'Open' : val} size="sm" />
    },
    {
      header: 'Actions',
      accessor: '_id',
      width: '140px',
      render: (_, row) => (
        <Link to={`/schemes/${row.code || row._id}`}>
          <Button variant="secondary" size="sm" rightIcon={ArrowRight}>
            View Details
          </Button>
        </Link>
      )
    }
  ];

  return (
    <PageContainer
      title="Central Sector Scholarship & Fellowship Schemes"
      hindiTitle="छात्रवृत्ति एवं अध्येतावृत्ति योजनाएं"
      description="Official catalog of welfare scholarship schemes administered by the Ministry of Tribal Affairs (MoTA), Government of India, for Scheduled Tribe (ST) students."
      breadcrumbs={[{ label: 'Schemes', href: '/schemes' }]}
    >
      <div className="space-y-6">
        
        {/* Notice Banner */}
        <Alert variant="info" title="Academic Session AY 2026-27 Application Cycle">
          Applications are invited under the Central Sector National Fellowship for Scheduled Tribe (NFST) and National Overseas Scholarship (NOS). Review the eligibility criteria and required documents before applying.
        </Alert>

        {/* Filter & Search Bar */}
        <div className="bg-white border border-slate-300 rounded p-4 shadow-xs">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-6">
              <Input
                placeholder="Search scheme by title or code (e.g., NFST, NOS)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={Search}
              />
            </div>

            <div className="sm:col-span-4">
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                placeholder="-- All Scheme Types --"
                options={[
                  { value: '', label: 'All Scheme Types' },
                  { value: 'fellowship', label: 'Fellowships (M.Phil / Ph.D.)' },
                  { value: 'overseas', label: 'Overseas Studies (Abroad)' },
                  { value: 'scholarship', label: 'Post-Matric Scholarships' }
                ]}
              />
            </div>

            <div className="sm:col-span-2 flex gap-2">
              <Button type="submit" variant="primary" size="md" className="w-full">
                Filter
              </Button>
            </div>
          </form>
        </div>

        {/* Schemes Catalog Section */}
        <div className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-4">
          <SectionHeading
            title="Available Schemes Catalog"
            hindiTitle="उपलब्ध योजनाएं"
            subtitle="Central Sector Grants funded by Government of India"
            accentColor="blue"
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={fetchSchemes}
                isLoading={loading}
                leftIcon={RefreshCw}
              >
                Refresh Schemes
              </Button>
            }
          />

          {loading ? (
            <TableSkeleton rows={4} cols={5} />
          ) : error ? (
            <ErrorState
              title="Catalog Loading Error"
              message={error}
              onRetry={fetchSchemes}
            />
          ) : (
            <Table
              columns={columns}
              data={schemes}
              emptyMessage="No welfare schemes match your selected search criteria."
              footerSummary={
                <span>
                  Showing {schemes.length} schemes configured under MoTA portal
                </span>
              }
            />
          )}
        </div>

      </div>
    </PageContainer>
  );
};

export default Schemes;
