// utils/upload.js
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, UPLOAD_DIR),
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `${Date.now()}-${uuidv4()}${ext}`);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   // Allow images for profile; docs could be images or pdf
//   if (file.fieldname === 'profileImage') {
//     if (file.mimetype.startsWith('image/')) return cb(null, true);
//     return cb(new Error('Profile image must be an image'));
//   }
//   if (file.fieldname === 'documentFile') {
//     if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') return cb(null, true);
//     return cb(new Error('Document must be image/pdf'));
//   }
//   cb(null, false);
// };

// const limits = { fileSize: 5 * 1024 * 1024 }; // 5MB max (adjust)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and images are allowed.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = upload;
// module.exports = multer({ storage, fileFilter, limits });
