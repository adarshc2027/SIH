import AuditLog from '../models/AuditLog.js';
import User from '../models/User.js';

/**
 * Centrally records an administrative or citizen audit event.
 *
 * @param {Object} params
 * @param {string|mongoose.Types.ObjectId} params.user - User performing the action
 * @param {string} params.action - Human-readable or standardized action name
 * @param {string} [params.entityType='Application'] - 'Application' | 'Document' | 'Deficiency' | 'Scheme'
 * @param {string|mongoose.Types.ObjectId} [params.entityId] - Target entity ID
 * @param {string|mongoose.Types.ObjectId} [params.applicationId] - Associated application ID
 * @param {string} [params.previousStatus=''] - Status before action
 * @param {string} [params.newStatus=''] - Status after action
 * @param {string} [params.remarks=''] - Official rationale or officer remarks
 * @param {Object} [params.metadata={}] - Optional contextual metadata
 * @returns {Promise<AuditLog|null>}
 */
export const logAudit = async ({
  user,
  action,
  entityType = 'Application',
  entityId = null,
  applicationId = null,
  previousStatus = '',
  newStatus = '',
  remarks = '',
  metadata = {}
}) => {
  try {
    if (!user || !action) {
      console.warn('[AuditService] Missing required user or action');
      return null;
    }

    let userName = '';
    let userRole = '';

    // If user object passed with name/role
    if (typeof user === 'object' && user.name) {
      userName = user.name;
      userRole = user.role || '';
    } else {
      const userDoc = await User.findById(user).select('name role').lean();
      if (userDoc) {
        userName = userDoc.name;
        userRole = userDoc.role;
      }
    }

    const userId = typeof user === 'object' ? user._id : user;

    const auditEntry = await AuditLog.create({
      user: userId,
      performedBy: userId,
      performedByName: userName || 'Authorized User',
      performedByRole: userRole || 'user',
      action: action.trim(),
      actionLabel: action.trim(),
      entityType,
      entityId: entityId || undefined,
      applicationId: applicationId || undefined,
      application: applicationId || undefined,
      previousStatus: previousStatus || '',
      previousStage: previousStatus || '',
      newStatus: newStatus || '',
      newStage: newStatus || '',
      remarks: remarks ? remarks.trim() : '',
      metadata,
      timestamp: new Date()
    });

    return auditEntry;
  } catch (error) {
    console.error('[AuditService] Failed to record audit log:', error.message);
    return null;
  }
};
