import Application from '../models/Application.js';

/**
 * Generate unique official application reference number
 * Format: MOTA/{SCHEME_CODE}/{YEAR}/{5_DIGIT_SEQUENCE}
 * Example: MOTA/NFST/2026/00142
 */
export const generateApplicationNumber = async (schemeCode = 'SCHEME') => {
  const year = new Date().getFullYear();
  const prefix = `MOTA/${schemeCode.toUpperCase()}/${year}/`;

  // Find the latest application for this scheme and year
  const latestApp = await Application.findOne({
    applicationNumber: new RegExp(`^${prefix}`)
  })
    .sort({ createdAt: -1 })
    .select('applicationNumber');

  let seq = 1;
  if (latestApp && latestApp.applicationNumber) {
    const parts = latestApp.applicationNumber.split('/');
    const lastSeq = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastSeq)) {
      seq = lastSeq + 1;
    }
  }

  const paddedSeq = String(seq).padStart(5, '0');
  return `${prefix}${paddedSeq}`;
};
