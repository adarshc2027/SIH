import mongoose from 'mongoose';
import Scheme from '../models/Scheme.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logAudit } from '../services/auditService.js';

/**
 * @route   GET /api/schemes
 * @desc    Get all public schemes with optional filters
 * @access  Public
 */
export const getSchemes = async (req, res, next) => {
  try {
    const { type, status, search } = req.query;
    const filter = {};

    if (type) {
      filter.type = type;
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const schemes = await Scheme.find(filter).sort({ createdAt: -1 });

    return successResponse(res, `Retrieved ${schemes.length} schemes successfully`, {
      count: schemes.length,
      schemes
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/schemes/:id
 * @desc    Get detailed scheme by MongoDB ID or unique Scheme Code (e.g., NFST, NOS)
 * @access  Public
 */
export const getSchemeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let scheme;

    // Check if ID is a valid ObjectId, otherwise query by unique code
    if (mongoose.Types.ObjectId.isValid(id)) {
      scheme = await Scheme.findById(id);
    } else {
      scheme = await Scheme.findOne({ code: id.toUpperCase() });
    }

    if (!scheme) {
      return errorResponse(res, `Scheme '${id}' not found in Ministry catalog.`, 404);
    }

    return successResponse(res, 'Scheme details retrieved successfully', { scheme });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/admin/schemes
 * @desc    Create a new welfare scheme (Admin only)
 * @access  Private (Admin)
 */
export const createScheme = async (req, res, next) => {
  try {
    const {
      name,
      code,
      hindiName,
      description,
      type,
      status,
      applicationStartDate,
      applicationEndDate,
      academicLevel,
      annualSlots,
      incomeLimit,
      eligibilityRules,
      requiredDocuments,
      financialBenefits,
      guidelines,
      howToApply
    } = req.body;

    if (!name || !code || !description || !applicationStartDate || !applicationEndDate || !financialBenefits) {
      return errorResponse(
        res,
        'Please provide all mandatory fields: name, code, description, applicationStartDate, applicationEndDate, financialBenefits',
        400
      );
    }

    const existingScheme = await Scheme.findOne({ code: code.toUpperCase().trim() });
    if (existingScheme) {
      return errorResponse(res, `Scheme with code '${code}' already exists.`, 409);
    }

    const newScheme = await Scheme.create({
      name: name.trim(),
      code: code.toUpperCase().trim(),
      hindiName: hindiName ? hindiName.trim() : '',
      description: description.trim(),
      type: type || 'scholarship',
      status: status || 'active',
      applicationStartDate,
      applicationEndDate,
      academicLevel: academicLevel || 'M.Phil / Ph.D.',
      annualSlots: annualSlots || 'Demand Based',
      incomeLimit: incomeLimit || 'No Income Ceiling',
      eligibilityRules: Array.isArray(eligibilityRules) ? eligibilityRules : [],
      requiredDocuments: Array.isArray(requiredDocuments) ? requiredDocuments : [],
      financialBenefits: financialBenefits.trim(),
      guidelines: Array.isArray(guidelines) ? guidelines : [],
      howToApply: Array.isArray(howToApply) ? howToApply : []
    });

    return successResponse(res, `Scheme '${newScheme.code}' created successfully`, { scheme: newScheme }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/admin/schemes/:id
 * @desc    Update an existing scheme (Admin only)
 * @access  Private (Admin)
 */
export const updateScheme = async (req, res, next) => {
  try {
    const { id } = req.params;

    const scheme = await Scheme.findById(id);
    if (!scheme) {
      return errorResponse(res, 'Scheme not found', 404);
    }

    // Update allowed fields
    const fieldsToUpdate = [
      'name',
      'hindiName',
      'description',
      'type',
      'status',
      'applicationStartDate',
      'applicationEndDate',
      'academicLevel',
      'annualSlots',
      'incomeLimit',
      'eligibilityRules',
      'requiredDocuments',
      'financialBenefits',
      'guidelines',
      'howToApply'
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        scheme[field] = req.body[field];
      }
    });

    if (req.body.code) {
      scheme.code = req.body.code.toUpperCase().trim();
    }

    const prevStatus = scheme.status;

    const updatedScheme = await scheme.save();

    // Record statutory audit entry
    await logAudit({
      user: req.user,
      action: 'Scheme modified',
      entityType: 'Scheme',
      entityId: updatedScheme._id,
      previousStatus: prevStatus,
      newStatus: updatedScheme.status,
      remarks: `Scheme '${updatedScheme.code}' modified by Administrator ${req.user.name}.`
    });

    return successResponse(res, `Scheme '${updatedScheme.code}' updated successfully`, { scheme: updatedScheme });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/admin/schemes/:id
 * @desc    Delete a scheme (Admin only)
 * @access  Private (Admin)
 */
export const deleteScheme = async (req, res, next) => {
  try {
    const { id } = req.params;

    const scheme = await Scheme.findById(id);
    if (!scheme) {
      return errorResponse(res, 'Scheme not found', 404);
    }

    await Scheme.findByIdAndDelete(id);

    return successResponse(res, `Scheme '${scheme.code}' has been removed successfully.`);
  } catch (error) {
    next(error);
  }
};
