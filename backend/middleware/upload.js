import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { promises as fs } from 'fs';
import path from 'path';

// Multer memory storage (keeps file as buffer in memory)
const storage = multer.memoryStorage();

// File filter to allow only PDF & DOCX
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/octet-stream' // sometimes docx is uploaded as octet-stream
  ];
  
  if (allowedTypes.includes(file.mimetype) || file.originalname.endsWith('.pdf') || file.originalname.endsWith('.docx')) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and DOCX files are allowed!'), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

// Configure Cloudinary if keys are available
const isCloudinaryConfigured = () => {
  return (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_CLOUD_NAME !== ''
  );
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

/**
 * Handle file upload, uploading to Cloudinary or falling back to local file system
 * @param {object} file - Express multer file object
 * @returns {Promise<string>} URL of the uploaded file
 */
export const handleUpload = async (file) => {
  if (isCloudinaryConfigured()) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'resume-analyzer', resource_type: 'raw' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      );
      uploadStream.end(file.buffer);
    });
  } else {
    // Local storage fallback
    const uploadsDir = path.join(process.cwd(), 'uploads');
    
    // Ensure uploads directory exists
    await fs.mkdir(uploadsDir, { recursive: true });
    
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname) || (file.mimetype === 'application/pdf' ? '.pdf' : '.docx');
    const fileName = `${uniqueSuffix}${fileExt}`;
    const filePath = path.join(uploadsDir, fileName);
    
    await fs.writeFile(filePath, file.buffer);
    
    // Return local server URL
    const port = process.env.PORT || 5000;
    return `http://localhost:${port}/uploads/${fileName}`;
  }
};
