import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Scheme from '../models/Scheme.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const defaultUsers = [
  {
    name: 'Ministry IT Administrator',
    email: 'admin@mota.gov.in',
    password: 'Password@123',
    phone: '9876543210',
    role: 'admin',
    tribalCommunity: 'N/A'
  },
  {
    name: 'Dr. Ramesh Soren (Verification Desk)',
    email: 'verifier@mota.gov.in',
    password: 'Password@123',
    phone: '9876543211',
    role: 'verifier',
    tribalCommunity: 'Santhal'
  },
  {
    name: 'Shri Arvind Meena (Screening Officer)',
    email: 'screening@mota.gov.in',
    password: 'Password@123',
    phone: '9876543212',
    role: 'screening_officer',
    tribalCommunity: 'Meena'
  },
  {
    name: 'Birsa Munda (Demo Scholar)',
    email: 'applicant@test.com',
    password: 'Password@123',
    phone: '9876543213',
    role: 'applicant',
    tribalCommunity: 'Munda'
  }
];

const defaultSchemes = [
  {
    name: 'National Fellowship for Scheduled Tribe Students',
    code: 'NFST',
    hindiName: 'अनुसूचित जनजाति के छात्रों के लिए राष्ट्रीय अध्येतावृत्ति',
    type: 'fellowship',
    status: 'active',
    applicationStartDate: new Date('2026-08-01'),
    applicationEndDate: new Date('2026-10-31'),
    academicLevel: 'Regular & Full-time M.Phil / Ph.D.',
    annualSlots: '750 Scholars',
    incomeLimit: 'No Income Ceiling',
    description:
      'The scheme provides financial assistance to Scheduled Tribe scholars for pursuing higher studies leading to M.Phil. and Ph.D. degrees in Sciences, Humanities, Social Sciences and Engineering & Technology at recognized Indian universities/institutes.',
    eligibilityRules: [
      'Applicant must belong to a recognized Scheduled Tribe (ST) community holding an authentic ST certificate.',
      'Applicant must have completed a Post-Graduate degree with a minimum of 55% aggregate marks from a UGC-recognized university.',
      'The candidate must have secured confirmed regular admission/registration in M.Phil or Ph.D. in an Indian University/Institution.',
      'Scholars pursuing distance education or part-time research programs are not eligible.',
      'Total annual awards are capped at 750 slots nationwide across all states/UTs.'
    ],
    eligibilityCriteria: {
      stCertificateRequired: true,
      minQualification: 'Post-Graduate Degree',
      minMarksPercentage: 55,
      maxAgeYears: null,
      maxAnnualFamilyIncome: null,
      requireAdmissionLetter: true,
      topQsRankMax: null
    },
    requiredDocuments: [
      {
        name: 'Scheduled Tribe (ST) Certificate',
        code: 'CASTE_CERT',
        isMandatory: true,
        description: 'Issued by competent State Revenue Authority (Tehsildar / SDO / DM)',
        maxSizeMB: 2,
        allowedFormats: ['.pdf', '.jpg', '.jpeg']
      },
      {
        name: 'University Admission & Guide Endorsement',
        code: 'ADMISSION_LETTER',
        isMandatory: true,
        description: 'Confirmed admission letter endorsed by Head of Department / Registrar',
        maxSizeMB: 2,
        allowedFormats: ['.pdf']
      },
      {
        name: 'Post-Graduate Degree Marksheet',
        code: 'QUALIFYING_DEGREE',
        isMandatory: true,
        description: 'Marksheet demonstrating at least 55% aggregate marks in PG examination',
        maxSizeMB: 2,
        allowedFormats: ['.pdf']
      },
      {
        name: 'Research Topic Synopsis & Supervisor Consent',
        code: 'SYNOPSIS_GUIDE_CONSENT',
        isMandatory: true,
        description: 'Duly signed research proposal and research guide endorsement',
        maxSizeMB: 3,
        allowedFormats: ['.pdf']
      },
      {
        name: 'Aadhaar Card Copy',
        code: 'AADHAAR_PROOF',
        isMandatory: true,
        description: 'Clear scanned copy of applicant UIDAI Aadhaar for DBT authentication',
        maxSizeMB: 1,
        allowedFormats: ['.pdf', '.jpg']
      },
      {
        name: 'Bank Account Passbook / Cancelled Cheque',
        code: 'BANK_PASSBOOK',
        isMandatory: true,
        description: 'Aadhaar-seeded bank account with visible IFSC and Account Number',
        maxSizeMB: 2,
        allowedFormats: ['.pdf', '.jpg']
      }
    ],
    financialBenefits:
      'Junior Research Fellow (JRF): ₹37,000/- per month for first 2 years.\nSenior Research Fellow (SRF): ₹42,000/- per month for remaining tenure.\nContingency for Humanities & Social Sciences: ₹10,000/- per annum for first 2 years, ₹20,500/- per annum thereafter.\nContingency for Science & Engineering: ₹12,000/- per annum for first 2 years, ₹25,000/- per annum thereafter.\nHouse Rent Allowance (HRA) as per Central Government norms if hostel accommodation is not provided.\nEscorts/Reader assistance: ₹2,000/- per month for Divyangjan scholars.',
    guidelines: [
      'Fellowship is tenable for a maximum duration of 5 years (2 years JRF + 3 years SRF).',
      'Scholar must not draw any other regular salary, scholarship, or fellowship from State or Central Government.',
      'Continuation of fellowship is contingent upon satisfactory Annual Academic Progress Reports endorsed by the University Guide.',
      'Payments are remitted directly through the Direct Benefit Transfer (DBT) portal into Aadhaar-seeded accounts.'
    ],
    howToApply: [
      'Step 1: Register on the MoTA Portal with Aadhaar-seeded mobile number and verify OTP.',
      'Step 2: Complete personal profile, caste verification credentials, and demographic details.',
      'Step 3: Enter university enrollment number, research topic, and supervisor details.',
      'Step 4: Upload legible scanned copies of required certificates (PDF/JPEG up to 2MB).',
      'Step 5: Review application summary, accept statutory undertaking, and submit.',
      'Step 6: Track application status and address any scrutiny deficiency notices promptly.'
    ]
  },
  {
    name: 'National Overseas Scholarship for ST Candidates',
    code: 'NOS',
    hindiName: 'अनुसूचित जनजाति उम्मीदवारों के लिए राष्ट्रीय प्रवासी छात्रवृत्ति',
    type: 'overseas',
    status: 'active',
    applicationStartDate: new Date('2026-08-15'),
    applicationEndDate: new Date('2026-10-31'),
    academicLevel: 'Masters, Ph.D. and Post-Doctoral Abroad',
    annualSlots: '20 Scholars',
    incomeLimit: '₹6,00,000 per annum',
    description:
      'The National Overseas Scholarship facilitates meritorious Scheduled Tribe scholars to pursue Master-level courses, Ph.D., and Post-Doctoral research in premier foreign universities ranked within the top 500 QS World University Rankings.',
    eligibilityRules: [
      'Applicant must belong to a recognized Scheduled Tribe (ST) community of India.',
      'Total family income from all sources must not exceed ₹6.00 Lakhs per annum.',
      'Applicant must have obtained at least 55% marks or equivalent grade in the relevant qualifying degree.',
      'Applicant must have secured unconditional admission to a foreign university ranking within the Top 500 QS World Rankings.',
      'Maximum age of applicant should not exceed 35 years as on the first day of the application year.',
      'Not more than one child of the same parents/guardians can avail the award simultaneously.'
    ],
    eligibilityCriteria: {
      stCertificateRequired: true,
      minQualification: 'Graduation / Post-Graduation',
      minMarksPercentage: 55,
      maxAgeYears: 35,
      maxAnnualFamilyIncome: 600000,
      requireAdmissionLetter: true,
      topQsRankMax: 500
    },
    requiredDocuments: [
      {
        name: 'Scheduled Tribe (ST) Certificate',
        code: 'CASTE_CERT',
        isMandatory: true,
        description: 'Permanent caste certificate issued by competent state revenue authority',
        maxSizeMB: 2,
        allowedFormats: ['.pdf']
      },
      {
        name: 'Family Income Certificate / Form 16 / ITR',
        code: 'INCOME_CERT',
        isMandatory: true,
        description: 'Official income proof demonstrating total family income under ₹6.00 Lakhs',
        maxSizeMB: 2,
        allowedFormats: ['.pdf']
      },
      {
        name: 'Unconditional Admission Offer Letter from Foreign University',
        code: 'FOREIGN_OFFER_LETTER',
        isMandatory: true,
        description: 'Must specify course, fees, and session at Top 500 QS ranked university',
        maxSizeMB: 3,
        allowedFormats: ['.pdf']
      },
      {
        name: 'Valid Indian Passport Copy',
        code: 'PASSPORT_COPY',
        isMandatory: true,
        description: 'First and last page of passport valid for at least 18 months',
        maxSizeMB: 2,
        allowedFormats: ['.pdf']
      },
      {
        name: 'Qualifying Degree Marksheets & Transcripts',
        code: 'ACADEMIC_TRANSCRIPTS',
        isMandatory: true,
        description: 'Bachelors/Masters transcripts demonstrating at least 55% marks',
        maxSizeMB: 3,
        allowedFormats: ['.pdf']
      },
      {
        name: 'Language Proficiency Scorecard (IELTS / TOEFL)',
        code: 'LANGUAGE_SCORE',
        isMandatory: false,
        description: 'Official scorecard if mandated by host institution',
        maxSizeMB: 2,
        allowedFormats: ['.pdf']
      }
    ],
    financialBenefits:
      'Actual tuition fees paid directly to the foreign university.\nAnnual Maintenance Allowance: $15,400 USD (USA and other countries) / £9,900 GBP (United Kingdom).\nContingency Allowance: $1,500 USD / £1,100 GBP per annum for books, study tour and equipment.\nActual cost of Visa fees and Medical Insurance premium.\nEconomy class return airfare from India to host country.\nLocal travel expenses as approved under scheme norms.',
    guidelines: [
      'Scholar must execute a statutory Bond with two sureties agreeing to return to India after completion of study.',
      'Scholar cannot change course of study or university without prior sanction of Ministry of Tribal Affairs.',
      'Employment during fellowship tenure is strictly governed by student visa regulations and MoTA directives.',
      'Awardees must maintain satisfactory progress confirmed through semester reports from host university advisor.'
    ],
    howToApply: [
      'Step 1: Check QS World University Ranking of the admitting foreign institution (must rank within top 500).',
      'Step 2: Register on MoTA portal and upload income proof, caste proof, and passport.',
      'Step 3: Upload unconditional offer letter and fee structure breakdown.',
      'Step 4: Verification desk reviews income ceiling, eligibility marks, and ranking credentials.',
      'Step 5: Ministry Screening Committee compiles merit list based on qualifying degree marks.',
      'Step 6: Sanction letter and financial guarantee letter issued for foreign visa processing.'
    ]
  },
  {
    name: 'Post Matric Scholarship Scheme for ST Students',
    code: 'POST_MATRIC',
    hindiName: 'अनुसूचित जनजाति के छात्रों के लिए पोस्ट मैट्रिक छात्रवृत्ति',
    type: 'scholarship',
    status: 'active',
    applicationStartDate: new Date('2026-07-01'),
    applicationEndDate: new Date('2026-11-30'),
    academicLevel: 'Class 11 to Post-Graduation',
    annualSlots: 'Demand Based (All Eligible)',
    incomeLimit: '₹2,50,000 per annum',
    description:
      'Centrally sponsored scheme implemented through State Governments/UTs to provide financial support to Scheduled Tribe students studying at post-matriculation or post-secondary stages.',
    eligibilityRules: [
      'Applicant must be a permanent resident belonging to the Scheduled Tribe category.',
      'Family annual income from all sources must not exceed ₹2.50 Lakhs per annum.',
      'Student must be enrolled in a recognized post-matric course in an approved educational institution.'
    ],
    requiredDocuments: [
      {
        name: 'Scheduled Tribe (ST) Certificate',
        code: 'CASTE_CERT',
        isMandatory: true,
        description: 'State-issued digital caste certificate',
        maxSizeMB: 2,
        allowedFormats: ['.pdf']
      },
      {
        name: 'Annual Income Certificate',
        code: 'INCOME_CERT',
        isMandatory: true,
        description: 'Income proof demonstrating family income within ₹2.50 Lakhs limit',
        maxSizeMB: 2,
        allowedFormats: ['.pdf']
      },
      {
        name: 'Previous Examination Marksheet',
        code: 'PREV_MARKSHEET',
        isMandatory: true,
        description: 'Class 10 / Class 12 / Degree Marksheet',
        maxSizeMB: 2,
        allowedFormats: ['.pdf']
      },
      {
        name: 'College Fee Receipt & Bonafide Certificate',
        code: 'FEE_RECEIPT',
        isMandatory: true,
        description: 'Official fee receipt and enrollment certificate from college',
        maxSizeMB: 2,
        allowedFormats: ['.pdf']
      },
      {
        name: 'Aadhaar Card & Bank Passbook',
        code: 'BANK_PASSBOOK',
        isMandatory: true,
        description: 'Aadhaar-seeded bank account for DBT',
        maxSizeMB: 2,
        allowedFormats: ['.pdf']
      }
    ],
    financialBenefits:
      'Compulsory non-refundable tuition fees reimbursed.\nMaintenance allowance for hostellers: up to ₹1,200/- per month.\nMaintenance allowance for day scholars: up to ₹550/- per month.\nStudy tour charges, thesis typing charges, and book grant for professional courses.',
    guidelines: [
      'Scholarship is available for studies in India only.',
      'Direct credit of Central share (60%) and State share (40%) into student bank accounts.'
    ],
    howToApply: [
      'Step 1: Register on portal with student details.',
      'Step 2: Submit institutional enrollment and academic fee receipt.',
      'Step 3: Verification by Institute Nodal Officer (INO) and District Welfare Officer (DWO).'
    ]
  }
];

export const seedDatabase = async () => {
  try {
    // Seed default administrative & demonstration users
    for (const userData of defaultUsers) {
      const exists = await User.findOne({ email: userData.email });
      if (!exists) {
        await User.create(userData);
        console.log(`[Seed] Created default user: ${userData.email} (${userData.role})`);
      }
    }

    // Seed default schemes (NFST, NOS, Post-Matric)
    for (const schemeData of defaultSchemes) {
      await Scheme.findOneAndUpdate(
        { code: schemeData.code },
        { $set: schemeData },
        { upsert: true, new: true }
      );
      console.log(`[Seed] Synced default scheme: ${schemeData.code} - ${schemeData.name}`);
    }
  } catch (err) {
    console.error(`[Seed Error]: ${err.message}`);
  }
};

// Direct script execution support
if (process.argv[2] === '--run') {
  connectDB().then(async () => {
    await seedDatabase();
    console.log('[Seed] Database initialization complete.');
    process.exit(0);
  });
}
