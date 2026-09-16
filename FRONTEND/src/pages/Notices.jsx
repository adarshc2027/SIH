import React from 'react';
import { PageContainer, SectionHeading, Table, StatusBadge, Button } from '../components/ui';
import { FileDown, Bell } from 'lucide-react';

export const Notices = () => {
  const notices = [
    {
      id: 1,
      date: '15/09/2026',
      title: 'Opening of National Fellowship for ST (NFST) Application Window for Academic Year 2026-27',
      category: 'Notification',
      fileSize: '450 KB'
    },
    {
      id: 2,
      date: '02/09/2026',
      title: 'Clarification regarding mandatory linking of Aadhaar with Student Bank Accounts for DBT transfers',
      category: 'Advisory',
      fileSize: '320 KB'
    },
    {
      id: 3,
      date: '20/08/2026',
      title: 'Revised QS World University Ranking threshold for National Overseas Scholarship (NOS) 2026',
      category: 'Circular',
      fileSize: '580 KB'
    }
  ];

  const columns = [
    {
      header: 'Date',
      accessor: 'date',
      width: '120px',
      render: (val) => <span className="font-mono text-slate-700">{val}</span>
    },
    {
      header: 'Subject / Circular Title',
      accessor: 'title',
      render: (val) => <span className="font-medium text-slate-900">{val}</span>
    },
    {
      header: 'Category',
      accessor: 'category',
      width: '120px',
      render: (val) => <StatusBadge status="submitted" label={val} size="sm" />
    },
    {
      header: 'Action',
      accessor: 'fileSize',
      width: '140px',
      render: (val) => (
        <Button variant="ghost" size="sm" leftIcon={FileDown} className="text-[#0c2340]">
          PDF ({val})
        </Button>
      )
    }
  ];

  return (
    <PageContainer
      title="Public Notices & Circulars"
      hindiTitle="सार्वजनिक सूचनाएं एवं परिपत्र"
      description="Official notifications, amendments, press releases, and schedule timelines issued by the Ministry of Tribal Affairs."
      breadcrumbs={[{ label: 'Notices', href: '/notices' }]}
    >
      <div className="bg-white border border-slate-300 rounded p-6 shadow-2xs space-y-4">
        <SectionHeading
          title="Recent Announcements"
          hindiTitle="हाल की घोषणाएं"
          subtitle="Showing all circulars published for the current academic session"
        />

        <Table
          columns={columns}
          data={notices}
          footerSummary={<span>Total {notices.length} notices published</span>}
        />
      </div>
    </PageContainer>
  );
};

export default Notices;
