import express from 'express';
import { connect } from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import 'dotenv/config';
import authRouter from './routes/authRouter.js';
import resumeRouter from './routes/resumeRouter.js';

const app = express();
// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'https://ai-resume-analyzer-five-eosin.vercel.app'
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ''));
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());
async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-analyzer';
    await connect(mongoUri);
    console.log('Connected to MongoDB');
    
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }
}
connectDB();
// Routes
// Serve uploads statically for local fallback
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
// Connect APIs
app.use('/user-api/auth', authRouter);
app.use('/user-api/resumes', resumeRouter);
// 404 Route handler
app.use((req, res) => {
  res.status(404).json({ message: `${req.url} is Invalid path` });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  
  // Multer Error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      message: "File is too large. Maximum size allowed is 5MB.",
    });
  }
  
  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.errors,
    });
  }
  
  // Invalid ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID format",
    });
  }
  
  // Duplicate key
  if (err.code === 11000 || (err.cause && err.cause.code === 11000) || (err.name === 'MongooseError' && err.message.includes('already exists'))) {
    return res.status(409).json({
      message: "Email already registered",
    });
  }
  
  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

