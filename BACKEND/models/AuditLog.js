import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    // Primary User who executed the action
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    // Action code or title (e.g., 'Application submitted', 'Document verified', etc.)
    action: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    // Target Entity classification: 'Application' | 'Document' | 'Deficiency' | 'Scheme' | 'User'
    entityType: {
      type: String,
      required: true,
      trim: true,
      default: 'Application',
      index: true
    },
    // Primary key reference of target entity
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true
    },
    // Associated Application reference (if applicable)
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      index: true
    },
    // Backward compatibility alias for application
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      index: true
    },
    // Status transition tracking
    previousStatus: {
      type: String,
      default: '',
      trim: true
    },
    newStatus: {
      type: String,
      default: '',
      trim: true
    },
    // Official justification or remarks
    remarks: {
      type: String,
      default: '',
      trim: true
    },
    // Official recorded timestamp
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    },

    // Backward compatibility helper fields for verifier and scrutiny logs
    actionLabel: {
      type: String,
      default: ''
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    performedByName: {
      type: String,
      default: ''
    },
    performedByRole: {
      type: String,
      default: ''
    },
    previousStage: {
      type: String,
      default: ''
    },
    newStage: {
      type: String,
      default: ''
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook to ensure backward-compatible mappings
auditLogSchema.pre('save', function (next) {
  if (!this.application && this.applicationId) {
    this.application = this.applicationId;
  }
  if (!this.applicationId && this.application) {
    this.applicationId = this.application;
  }
  if (!this.user && this.performedBy) {
    this.user = this.performedBy;
  }
  if (!this.performedBy && this.user) {
    this.performedBy = this.user;
  }
  if (!this.previousStatus && this.previousStage) {
    this.previousStatus = this.previousStage;
  }
  if (!this.newStatus && this.newStage) {
    this.newStatus = this.newStage;
  }
  if (!this.actionLabel) {
    this.actionLabel = this.action;
  }
  next();
});

// Indexes for high-performance administrative searching and filtering
auditLogSchema.index({ action: 1, entityType: 1, timestamp: -1 });
auditLogSchema.index({ user: 1, timestamp: -1 });
auditLogSchema.index({ applicationId: 1, timestamp: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;