import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
      index: true
    },
    action: {
      type: String,
      required: true, // e.g., 'VERIFY_DOCUMENT', 'REJECT_DOCUMENT', 'RAISE_DEFICIENCY', 'FORWARD_TO_SCREENING', 'REQUEST_MANUAL_REVIEW', 'VERIFY_APPLICATION'
      uppercase: true,
      trim: true,
      index: true
    },
    actionLabel: {
      type: String,
      required: true
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    performedByName: {
      type: String,
      required: true
    },
    performedByRole: {
      type: String,
      required: true
    },
    previousStage: {
      type: String,
      default: ''
    },
    newStage: {
      type: String,
      default: ''
    },
    remarks: {
      type: String,
      default: ''
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;