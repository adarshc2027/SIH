import api from './api';

/**
 * Upload or replace a document for an application
 * @param {FormData} formData - Contains file, applicationId, documentType, documentName
 */
export const uploadDocumentApi = async (formData) => {
  return await api.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

/**
 * Get document details by document ID
 * @param {string} id
 */
export const getDocumentByIdApi = async (id) => {
  return await api.get(`/documents/${id}`);
};

/**
 * Get all documents uploaded for a specific application
 * @param {string} applicationId
 */
export const getDocumentsByApplicationApi = async (applicationId) => {
  return await api.get(`/documents/application/${applicationId}`);
};

/**
 * Delete a document from a draft application
 * @param {string} id
 */
export const deleteDocumentApi = async (id) => {
  return await api.delete(`/documents/${id}`);
};
