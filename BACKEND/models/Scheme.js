import mongoose from 'mongoose';

const requiredDocumentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    isMandatory: {
      type: Boolean,
      default: true
    },
    description: {
      type: String,
      default: ''
    },
    maxSizeMB: {
      type: Number,
      default: 2
    },
    allowedFormats: {
      type: [String],
      default: ['.pdf', '.jpg', '.jpeg', '.png']
    }
  },
  { _id: false }
);

const schemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Scheme title is required'],
      trim: true
    },
    code: {
      type: String,
      required: [true, 'Scheme code is required (e.g., NFST, NOS)'],
      unique: true,
      uppercase: true,
      trim: true
    },
    hindiName: {
      type: String,
      trim: true,
      default: ''
    },
    description: {
      type: String,
      required: [true, 'Scheme description is required']
    },
    type: {
      type: String,
      enum: {
        values: ['fellowship', 'scholarship', 'overseas', 'other'],
        message: '{VALUE} is not a valid scheme type'
      },
      default: 'scholarship'
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'closed', 'upcoming'],
        message: '{VALUE} is not a valid status'
      },
      default: 'active'
    },
    applicationStartDate: {
      type: Date,
      required: [true, 'Application start date is required']
    },
    applicationEndDate: {
      type: Date,
      required: [true, 'Application end date is required']
    },
    academicLevel: {
      type: String,
      required: [true, 'Target academic level is required (e.g., M.Phil / Ph.D.)'],
      trim: true
    },
    annualSlots: {
      type: String,
      required: true,
      default: 'Demand Based'
    },
    incomeLimit: {
      type: String,
      default: 'No Income Ceiling'
    },
    eligibilityRules: {
      type: [String],
      default: []
    },
    eligibilityCriteria: {
      stCertificateRequired: { type: Boolean, default: true },
      minQualification: { type: String, default: '' },
      minMarksPercentage: { type: Number, default: 0 },
      maxAgeYears: { type: Number, default: null },
      maxAnnualFamilyIncome: { type: Number, default: null },
      requireAdmissionLetter: { type: Boolean, default: true },
      topQsRankMax: { type: Number, default: null }
    },
    requiredDocuments: {
      type: [requiredDocumentSchema],
      default: []
    },
    financialBenefits: {
      type: String,
      required: [true, 'Financial benefits description is required']
    },
    guidelines: {
      type: [String],
      default: []
    },
    howToApply: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Scheme = mongoose.model('Scheme', schemeSchema);

export default Scheme;
