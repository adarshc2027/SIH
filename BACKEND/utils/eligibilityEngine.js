/**
 * Configurable Eligibility Engine for MoTA Schemes
 * 
 * Reusable rule evaluator that evaluates an Application against
 * scheme-specific rules and parameters defined in the Scheme model.
 * 
 * Important:
 * - Does NOT hardcode scheme-specific rules in controllers.
 * - Assistive tool only: provides recommendations ('passed', 'manual_review', 'failed', 'not_applicable')
 * - Does NOT autonomously reject applications.
 */

export const evaluateApplicationEligibility = (application, scheme) => {
  if (!scheme) {
    return {
      eligible: false,
      overallStatus: 'manual_review',
      rules: [
        {
          rule: 'Scheme Guidelines Compliance',
          category: 'system',
          status: 'manual_review',
          details: 'Scheme configuration record missing or not loaded.',
          critical: true
        }
      ]
    };
  }

  const rules = [];
  const criteria = scheme.eligibilityCriteria || {};
  const personal = application.personalDetails || {};
  const academic = application.academicDetails || {};
  const financial = application.financialDetails || {};
  const documents = application.documents || [];

  // 1. Scheduled Tribe (ST) Certificate & Community Verification
  if (criteria.stCertificateRequired !== false) {
    const hasCasteNumber = Boolean(personal.casteCertificateNumber && personal.casteCertificateNumber.trim());
    const hasCasteDoc = documents.some(
      (d) => (d.documentType === 'CASTE_CERT' || d.documentName?.toLowerCase().includes('caste') || d.documentName?.toLowerCase().includes('st certificate')) && Boolean(d.fileName)
    );
    const hasTribalCommunity = Boolean(personal.tribalCommunity && personal.tribalCommunity.trim());

    if (hasCasteNumber && hasCasteDoc && hasTribalCommunity) {
      rules.push({
        rule: 'Scheduled Tribe (ST) Statutory Certification',
        category: 'community',
        status: 'passed',
        details: `ST certificate number '${personal.casteCertificateNumber}' and authentic document attached for community '${personal.tribalCommunity}'.`,
        critical: true
      });
    } else if (hasCasteNumber && !hasCasteDoc) {
      rules.push({
        rule: 'Scheduled Tribe (ST) Statutory Certification',
        category: 'community',
        status: 'manual_review',
        details: `Caste certificate number '${personal.casteCertificateNumber}' entered, but document scan is awaiting scrutiny or verification.`,
        critical: true
      });
    } else {
      rules.push({
        rule: 'Scheduled Tribe (ST) Statutory Certification',
        category: 'community',
        status: 'failed',
        details: 'Mandatory Scheduled Tribe certificate number or certificate upload missing.',
        critical: true
      });
    }
  }

  // 2. Minimum Academic Qualification & Marks
  if (criteria.minMarksPercentage) {
    let parsedPercentage = null;
    if (academic.percentageOrCgpa) {
      const match = String(academic.percentageOrCgpa).match(/(\d+(p\.\d+)?)/);
      if (match) {
        let num = parseFloat(match[0]);
        if (num <= 10 && num > 0) {
          num = num * 9.5;
        }
        parsedPercentage = num;
      }
    }

    const minRequired = criteria.minMarksPercentage;

    if (parsedPercentage !== null) {
      if (parsedPercentage >= minRequired) {
        rules.push({
          rule: `Minimum Academic Performance (>= ${minRequired}%)`,
          category: 'academic',
          status: 'passed',
          details: `Declared qualification score: ${parsedPercentage.toFixed(1)}% (Threshold: ${minRequired}%).`,
          critical: true
        });
      } else {
        rules.push({
          rule: `Minimum Academic Performance (>= ${minRequired}%)`,
          category: 'academic',
          status: 'failed',
          details: `Declared score (${parsedPercentage.toFixed(1)}%) is below the prescribed threshold of ${minRequired}%.`,
          critical: true
        });
      }
    } else {
      rules.push({
        rule: `Minimum Academic Performance (>= ${minRequired}%)`,
        category: 'academic',
        status: 'manual_review',
        details: 'Academic marks / CGPA grade requires manual verification from official grade transcript.',
        critical: false
      });
    }
  }

  // 3. Family Income Ceiling
  if (criteria.maxAnnualFamilyIncome !== null && criteria.maxAnnualFamilyIncome !== undefined && criteria.maxAnnualFamilyIncome > 0) {
    const declaredIncome = financial.annualFamilyIncome !== undefined ? Number(financial.annualFamilyIncome) : null;
    const maxAllowed = criteria.maxAnnualFamilyIncome;
    const maxFormatted = '‹' + maxAllowed.toLocaleString('en-IN');

    if (declaredIncome !== null && !isNaN(declaredIncome)) {
      if (declaredIncome <= maxAllowed) {
        rules.push({
          rule: `Annual Family Income Limit (<= ${maxFormatted})`,
          category: 'income',
          status: 'passed',
          details: `Declared annual family income: ₹${declaredIncome.toLocaleString('en-IN')} is within the limit of ${maxFormatted}.`,
          critical: true
        });
      } else {
        rules.push({
          rule: `Annual Family Income Limit (<= ${maxFormatted})`,
          category: 'income',
          status: 'failed',
          details: `Declared income ₹${declaredIncome.toLocaleString('en-IN')} exceeds the scheme ceiling of ${maxFormatted}.`,
          critical: true
        });
      }
    } else {
      rules.push({
        rule: `Annual Family Income Limit (<= ${maxFormatted})`,
         category: 'income',
          status: 'manual_review',
          details: 'Income certificate details pending officer review.',
          critical: true
      });
    }
  } else {
    rules.push({
      rule: 'Annual Family Income Limit',
      category: 'income',
      status: 'not_applicable',
      details: 'This welfare scheme has no upper family income restriction. Open to all ST scholars.',
      critical: false
    });
  }

  // 4. Age Ceiling Check
  if (criteria.maxAgeYears) {
    const dob = personal.dateOfBirth ? new Date(personal.dateOfBirth) : null;
    const maxAge = criteria.maxAgeYears;

    if (dob && !isNaN(dob.getTime())) {
      const now = new Date();
      let age = now.getFullYear() - dob.getFullYear();
      const m = now.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
        age--;
      }

      if (age <= maxAge) {
        rules.push({
          rule: `Maximum Candidate Age Limit (<= ${maxAge} Years)`,
          category: 'age',
          status: 'passed',
          details: `Calculated age: ${age} years (Maximum permitted: ${maxAge} years).`,
          critical: true
        });
      } else {
        rules.push({
          rule: `Maximum Candidate Age Limit (<= ${maxAge} Years)`,
          category: 'age',
          status: 'failed',
          details: `Calculated age of ${age} years exceeds the maximum age limit of ${maxAge} years.`,
          critical: true
        });
      }
    } else {
      rules.push({
        rule: `Maximum Candidate Age Limit (<= ${maxAge} Years)`,
        category: 'age',
        status: 'manual_review',
        details: 'Date of Birth requires verification against Class X Matriculation Certificate.',
        critical: false
      });
    }
  }

  // 5. Confirmed Admission / Registration Letter
  if (criteria.requireAdmissionLetter) {
    const hasAdmissionDetails = Boolean(academic.enrolledInstitution || academic.institution);
    const hasAdmissionDoc = documents.some(
      (d) => (d.documentType === 'ADMISSION_LETTER' || d.documentType === 'OFFER_LETTER' || d.documentName?.toLowerCase().includes('admission')) && Boolean(d.fileName)
    );

    if (hasAdmissionDetails && hasAdmissionDoc) {
      rules.push({
        rule: 'Confirmed University Admission / Registration',
        category: 'admission',
        status: 'passed',
        details: `Admission at '${academic.enrolledInstitution || academic.institution}' supported by uploaded verification letter.`,
        critical: true
      });
    } else if (hasAdmissionDetails) {
      rules.push({
        rule: 'Confirmed University Admission / Registration',
        category: 'admission',
        status: 'manual_review',
        details: 'Institution specified, but confirmation letter requires physical or INO scrutiny.',
        critical: true
      });
    } else {
      rules.push({
        rule: 'Confirmed University Admission / Registration',
        category: 'admission',
        status: 'failed',
        details: 'No valid admission or university enrollment details provided.',
        critical: true
      });
    }
  }

  // 6. QS World University Ranking (For Overseas Schemes like NOS)
  if (criteria.topQsRankMax) {
    const rankingStr = academic.foreignUniversityRanking || '';
    const maxRank = criteria.topQsRankMax;
    const match = rankingStr.match(/(\d+)/);

    if (match) {
      const rankNum = parseInt(match[0], 10);
      if (rankNum <= maxRank) {
        rules.push({
          rule: `Host University QS World Ranking (Within Top ${maxRank})`,
          category: 'qs_rank',
          status: 'passed',
          details: `Institution ranking (Rank ${rankNum}) meets the MoTATop ${maxRank} mandate.`,
          critical: true
        });
      } else {
        rules.push({
          rule: `Host University QS World Ranking (Within Top ${maxRank})`,
          category: 'qs_rank',
          status: 'failed',
          details: `Institution ranking (Rank ${rankNum}) is outside the Top ${maxRank} QS World list.`,
          critical: true
        });
      }
    } else if (rankingStr) {
      rules.push({
        rule: `Host University QS World Ranking (Within Top ${maxRank})`,
         category: 'qs_rank',
          status: 'manual_review',
          details: `Ranking declared as '${rankingStr}'. Official QS directory verification required by Officer.`,
          critical: true
        });
    } else {
      rules.push({
        rule: `Host University QS World Ranking (Within Top ${maxRank})`,
          category: 'qs_rank',
          status: 'failed',
          details: 'Foreign university QS World Ranking information missing.',
          critical: true
        });
    }
  }

  // 7. Mandatory Supporting Documents Completeness
  if (scheme.requiredDocuments && scheme.requiredDocuments.length > 0) {
    const mandatoryList = scheme.requiredDocuments.filter ((d) => d.isMandatory);
    const missingDocs = mandatoryList.filter(
      (mDoc) => !documents.some((d) => d.documentType === mDoc.code && Boolean(d.fileName))
    );

    if (missingDocs.length === 0) {
      rules.push({
        rule: 'Mandatory Statutory Documents Completeness',
        category: 'documents',
        status: 'passed',
        details: `All ${mandatoryList.length} mandatory statutory documents have been uploaded for verification.`,
        critical: true
      });
    } else {
      rules.push({
        rule: 'Mandatory Statutory Documents Completeness',
        category: 'documents',
        status: 'manual_review',
        details: `${missingDocs.length} required document(s) pending: ${missingDocs.map((m) => m.name).join(', ')}.`,
        critical: true
      });
    }
  }

  const hasFailedCritical = rules.some((r) => r.critical && r.status === 'failed');
  const hasManualReview = rules.some((r) => r.status === 'manual_review');

  const eligible = !hasFailedCritical;
  let overallStatus = 'passed';
  if (hasFailedCritical) {
    overallStatus = 'failed';
  } else if (hasManualReview) {
    overallStatus = 'manual_review';
  }

  return {
    eligible,
    overallStatus,
    evaluatedAt: new Date().toISOString(),
    rules
  };
};

export default evaluateApplicationEligibility;