import mongoose from 'mongoose';

/**
 * Deficiency Schema
 * Tracks formal deficiencies raised by scrutiny officers against scholarship applications
 * or specific supporting documents, applicant responses, resubmissions, and resolution workflows.
 */
const deficiencySchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: [true, 'Associated application reference is required'],
      index: true
    },
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      default: null,
      index: true
    },
    documentType: {
      type: String,
      uppercase: true,
      trim: true,
      default: ''
    },
    documentName: {
      type: String,
      default: ''
    },
    reason: {
      type: String,
      required: [true, 'Deficiency category/reason is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Detailed deficiency observation is required'],
      trim: true
    },
    requiredAction: {
      type: String,
      required: [true, 'Required applicant corrective action is required'],
      trim: true
    },
    deadline: {
      type: Date,
      required: [true, 'Corrective response deadline is required']
    },
    status: {
      type: String,
      enum: ['open', 'responded', 'resolved', 'closed'],
      default: 'open',
      index: true
    },
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Scrutiny officer user reference is required']
    },
    raisedByName: {
      type: String,
      default: 'Scrutiny Officer'
    },
    raisedAt: {
      type: Date,
      default: Date.now
    },
    // Applicant Response Data
    applicantRemarks: {
      type: String,
      default: ''
    },
    respondedAt: {
      type: Date
    },
    resubmittedDocument: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      default: null
    },
    // Official Resolution Data
    officerResolutionRemarks: {
      type: String,
      default: ''
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedByName: {
      type: String
    },
    resolvedAt: {
      type: Date
    },
    // Audit timeline history
    timeline: [
      {
        stage: {
          type: String,
          enum: ['raised', 'responded', 'resubmitted', 'reviewed', 'resolved', 'closed'],
          required: true
        },
        actor: {
          type: String,
          enum: ['officer', 'applicant', 'system'],
          required: true
        },
        actorName: {
          type: String,
          default: ''
        },
        remarks: {
          type: String,
          default: ''
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

deficiencySchema.index({ application: 1, status: 1 });

const Deficiency = mongoose.model('Deficiency', deficiencySchema);

export default Deficiency;