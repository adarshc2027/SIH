import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: [true, 'Associated application reference is required'],
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Applicant user reference is required'],
      index: true
    },
    documentType: {
      type: String,
      required: [true, 'Document type/code is required'],
      uppercase: true,
      trim: true,
      index: true
    },
    documentName: {
      type: String,
      required: [true, 'Document descriptive name is required'],
      trim: true
    },
    fileName: {
      type: String,
      required: [true, 'Original file name is required']
    },
    storedFileName: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: [true, 'File access URL is required']
    },
    mimeType: {
      type: String,
      required: true
    },
    fileSizeBytes: {
      type: Number,
      required: true
    },
    fileSizeMB: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['missing', 'uploaded', 'verified', 'rejected', 'deficient', 'resubmitted'],
      default: 'uploaded',
      index: true
    },
    verificationStatus: {
      type: String,
      enum: ['unverified', 'pending', 'verified', 'rejected', 'deficient'],
      default: 'unverified'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    verifiedAt: {
      type: Date
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    remarks: {
      type: String,
      default: ''
    },
    ocrData: {
      extractedText: { type: String, default: '' },
      confidenceScore: { type: Number, default: 0 },
      isProcessed: { type: Boolean, default: false },
      processedAt: { type: Date }
    }
  },
  {
    timestamps: true
  }
);

documentSchema.index({ application: 1, documentType: 1 });

const Document = mongoose.model('Document', documentSchema);

export default Document;
