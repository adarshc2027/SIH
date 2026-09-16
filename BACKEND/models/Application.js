import mongoose from 'mongoose';

const applicationDocumentSchema = new mongoose.Schema(
  {
    documentType: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    documentName: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      default: ''
    },
    fileSizeMB: {
      type: Number,
      default: 0
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'deficient'],
      default: 'pending'
    }
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Applicant user reference is required'],
      index: true
    },
    scheme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scheme',
      required: [true, 'Scheme reference is required'],
      index: true
    },
    applicationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    personalDetails: {
      fullName: { type: String, default: '' },
      fatherOrGuardianName: { type: String, default: '' },
      motherName: { type: String, default: '' },
      dateOfBirth: { type: Date },
      gender: { type: String, enum: ['Male', 'Female', 'Transgender', ''], default: '' },
      aadhaarNumber: { type: String, default: '' },
      mobile: { type: String, default: '' },
      email: { type: String, default: '' },
      tribalCommunity: { type: String, default: '' },
      casteCertificateNumber: { type: String, default: '' },
      state: { type: String, default: '' },
      district: { type: String, default: '' },
      address: { type: String, default: '' },
      pincode: { type: String, default: '' },
      isDivyangjan: { type: Boolean, default: false },
      disabilityPercentage: { type: Number, default: 0 }
    },
    academicDetails: {
      qualifyingDegree: { type: String, default: '' },
      institution: { type: String, default: '' },
      passingYear: { type: Number },
      percentageOrCgpa: { type: String, default: '' },
      enrolledCourse: { type: String, default: '' },
      enrolledInstitution: { type: String, default: '' },
      registrationNumber: { type: String, default: '' },
      admissionDate: { type: Date },
      researchTopic: { type: String, default: '' },
      supervisorName: { type: String, default: '' },
      foreignUniversityRanking: { type: String, default: '' },
      hostCountry: { type: String, default: '' }
    },
    financialDetails: {
      annualFamilyIncome: { type: Number, default: 0 },
      incomeCertificateNumber: { type: String, default: '' },
      issuingAuthority: { type: String, default: '' },
      issueDate: { type: Date },
      fatherOccupation: { type: String, default: '' },
      motherOccupation: { type: String, default: '' }
    },
    bankDetails: {
      accountHolderName: { type: String, default: '' },
      bankName: { type: String, default: '' },
      accountNumber: { type: String, default: '' },
      ifscCode: { type: String, default: '' },
      branchName: { type: String, default: '' },
      isAadhaarSeeded: { type: Boolean, default: true }
    },
    documents: {
      type: [applicationDocumentSchema],
      default: []
    },
    status: {
      type: String,
      enum: [
        'draft',
        'submitted',
        'under_verification',
        'deficiency_raised',
        'verified',
        'under_screening',
        'selected',
        'rejected'
      ],
      default: 'draft',
      index: true
    },
    eligibilityResult: {
      isEligible: { type: Boolean, default: true },
      matchedCriteria: { type: [String], default: [] },
      flags: { type: [String], default: [] },
      checkedAt: { type: Date }
    },
    currentStage: {
      type: String,
      default: 'DRAFT'
    },
    assignedOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    remarks: [
      {
        officer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        officerName: { type: String },
        remark: { type: String, required: true },
        stage: { type: String },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    submittedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Compound index to prevent duplicate active applications per user & scheme
applicationSchema.index({ user: 1, scheme: 1 });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
