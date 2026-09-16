import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const uploadDirectory = path.resolve('uploads', 'documents');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    // Sanitize and create unique timestamped filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitizedOriginal = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const ext = path.extname(sanitizedOriginal).toLowerCase();
    const baseName = path.basename(sanitizedOriginal, ext).substring(0, 30);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  }
});

// File Type Whitelist
const allowedMimeTypes = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg'
];

const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];

// Multer Filter
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedMimeTypes.includes(file.mimetype) || !allowedExtensions.includes(ext)) {
    return cb(
      new Error(`Unsupported file type '${ext}'. Only PDF, JPEG, JPG, and PNG documents are accepted by MoTA portal.`),
      false
    );
  }

  cb(null, true);
};

// 5MB maximum file size limit for government document uploads
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  }
});

export default upload;
