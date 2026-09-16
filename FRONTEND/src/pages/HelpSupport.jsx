import React, { useState } from 'react';
import { PageContainer, SectionHeading, Input, Select, Textarea, Button, Alert } from '../components/ui';
import { APP_CONFIG } from '../utils/constants';
import { Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export const HelpSupport = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageContainer
      title="Helpdesk & Grievance Support"
      hindiTitle="सहायता एवं शिकायत निवारण"
      description="Connect with the Ministry of Tribal Affairs support cell for technical, eligibility, or application-related queries."
      breadcrumbs={[{ label: 'Help & Support', href: '/help-support' }]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Support Channels Card */}
        <div className="bg-white border border-slate-300 rounded p-6 shadow-2xs space-y-6">
          <SectionHeading
            title="Helpline Channels"
            hindiTitle="संपर्क सूत्र"
            subtitle="Official support contacts"
          />

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-100 border border-slate-200 rounded text-[#0c2340]">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-slate-900">National Toll-Free Helpline</strong>
                <span className="font-mono text-amber-700 font-bold text-base">{APP_CONFIG.HELPLINE}</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Mon to Fri, 9:30 AM - 5:30 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-100 border border-slate-200 rounded text-[#0c2340]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-slate-900">Official Support Email</strong>
                <span className="font-mono text-slate-800">{APP_CONFIG.SUPPORT_EMAIL}</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Response within 2-3 working days</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-100 border border-slate-200 rounded text-[#0c2340]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-slate-900">Physical Address</strong>
                <p className="text-slate-600 text-xs leading-relaxed mt-0.5">
                  Scholarship Section, Ministry of Tribal Affairs,<br />
                  Room No. 412, 'B' Wing, Shastri Bhawan,<br />
                  New Delhi - 110001
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Query Submission Form */}
        <div className="md:col-span-2 bg-white border border-slate-300 rounded p-6 shadow-2xs space-y-4">
          <SectionHeading
            title="Submit a Query or Grievance"
            hindiTitle="ऑनलाइन प्रश्न अथवा शिकायत दर्ज करें"
            subtitle="Fill out the form below to receive assistance from the MoTA grievance desk"
          />

          {submitted ? (
            <Alert variant="success" title="Query Lodged Successfully">
              Your grievance ticket has been registered. A confirmation has been generated and sent to the MoTA support cell. Reference ID: <strong>GRV/2026/0491</strong>.
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  placeholder="Enter applicant / scholar name"
                  required
                />
                <Input
                  label="Mobile Number"
                  placeholder="10-digit mobile number"
                  type="tel"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  placeholder="applicant@example.com"
                  type="email"
                  required
                />
                <Select
                  label="Related Scheme"
                  placeholder="-- Select Associated Scheme --"
                  options={[
                    { value: 'NFST', label: 'National Fellowship for ST (NFST)' },
                    { value: 'NOS', label: 'National Overseas Scholarship (NOS)' },
                    { value: 'POST_MATRIC', label: 'Post Matric Scholarship' },
                    { value: 'OTHER', label: 'General / Technical Portal Issue' }
                  ]}
                  required
                />
              </div>

              <Input
                label="Application Reference Number (if applicable)"
                placeholder="e.g. MOTA/NFST/2026/00142"
                helperText="Leave empty if you have not submitted an application yet."
              />

              <Textarea
                label="Grievance / Query Details"
                rows={4}
                maxLength={500}
                placeholder="Provide a specific description of your query or document issue..."
                required
              />

              <div className="pt-2 flex justify-end">
                <Button type="submit" variant="primary" leftIcon={Send}>
                  Submit Inquiry
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default HelpSupport;
