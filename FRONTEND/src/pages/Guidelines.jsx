import React from 'react';
import { PageContainer, SectionHeading, Alert, Button } from '../components/ui';
import { Download, FileCheck, HelpCircle } from 'lucide-react';

export const Guidelines = () => {
  return (
    <PageContainer
      title="Operational Guidelines & Eligibility Rules"
      hindiTitle="परिचालन दिशा-निर्देश"
      description="Official norms, income ceilings, qualification benchmarks, and document verification standards for MoTA scholarships."
      breadcrumbs={[{ label: 'Guidelines', href: '/guidelines' }]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-300 rounded p-6 shadow-2xs space-y-4">
          <SectionHeading
            title="National Fellowship for ST Students (NFST)"
            hindiTitle="एनएफएसटी दिशा-निर्देश"
            subtitle="Financial support for regular and full-time M.Phil and Ph.D. scholars"
            accentColor="blue"
          />

          <ul className="text-xs sm:text-sm text-slate-700 space-y-2 list-disc list-inside leading-relaxed">
            <li>Open strictly to Scheduled Tribe candidates holding a valid ST Certificate.</li>
            <li>Candidates must have secured regular admission into recognized Indian Universities/Institutes.</li>
            <li>Total annual fellowship slots allocated: <strong>750 scholars</strong>.</li>
            <li>Mandatory submission of Guide Confirmation, Caste Certificate, and Bank Passbook.</li>
          </ul>

          <div className="pt-2">
            <Button variant="secondary" size="sm" leftIcon={Download}>
              Download NFST Official PDF Guidelines (2.4 MB)
            </Button>
          </div>
        </div>

        <div className="bg-white border border-slate-300 rounded p-6 shadow-2xs space-y-4">
          <SectionHeading
            title="National Overseas Scholarship (NOS)"
            hindiTitle="एनओएस दिशा-निर्देश"
            subtitle="Financial assistance for Masters and Ph.D. degrees in premier overseas institutions"
            accentColor="saffron"
          />

          <ul className="text-xs sm:text-sm text-slate-700 space-y-2 list-disc list-inside leading-relaxed">
            <li>Total family income must not exceed <strong>₹6.00 Lakhs per annum</strong>.</li>
            <li>Must hold an unconditional admission offer letter from a foreign institution.</li>
            <li>Institution must rank within the top 500 QS World University Rankings.</li>
            <li>Total annual scholarship quota: <strong>20 awards</strong>.</li>
          </ul>

          <div className="pt-2">
            <Button variant="secondary" size="sm" leftIcon={Download}>
              Download NOS Official PDF Guidelines (3.1 MB)
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Guidelines;
