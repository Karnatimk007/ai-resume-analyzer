import { Router } from 'express';
import { upload, handleUpload } from '../middleware/upload.js';
import { parseResume } from '../utils/parserService.js';
import { analyzeResumeContent } from '../utils/aiService.js';
import Resume from '../Models/ResumeModel.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = Router();

// Apply auth middleware to all resume endpoints
router.use(verifyToken);

// 1. UPLOAD & ANALYZE RESUME
router.post('/analyze', upload.single('resume'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF or DOCX file.' });
    }

    const { jobDescription } = req.body;
    
    // Parse raw text from file buffer
    console.log(`Parsing file: ${req.file.originalname} (${req.file.mimetype})...`);
    const parsedText = await parseResume(req.file.buffer, req.file.mimetype);
    
    if (!parsedText || parsedText.trim().length === 0) {
      return res.status(400).json({ message: 'Failed to extract text from file. Please ensure it contains readable text.' });
    }

    // Call AI service for structured analysis
    console.log('Sending text to AI analysis service...');
    const analysis = await analyzeResumeContent(parsedText, jobDescription);

    // Upload file to cloud/local store
    console.log('Storing resume file...');
    const fileUrl = await handleUpload(req.file);

    // Save record to DB
    const newResume = new Resume({
      userId: req.user.id,
      fileName: req.file.originalname,
      fileUrl,
      parsedText,
      atsScore: analysis.atsScore || 0,
      roleCompared: jobDescription || 'General Analysis',
      analysisResult: analysis
    });

    await newResume.save();
    console.log('Analysis saved to database.');

    res.status(201).json(newResume);
  } catch (error) {
    console.error('Error during resume analysis:', error);
    next(error);
  }
});

// 2. GET USER RESUME HISTORY (sorted by newest first)
router.get('/history', async (req, res, next) => {
  try {
    const history = await Resume.find({ userId: req.user.id })
      .select('fileName fileUrl atsScore roleCompared createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json(history);
  } catch (error) {
    next(error);
  }
});

// 3. GET SINGLE RESUME DETAILS
router.get('/:id', async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume analysis not found' });
    }

    res.status(200).json(resume);
  } catch (error) {
    next(error);
  }
});

// 4. DELETE RESUME ANALYSIS RECORD
router.delete('/:id', async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume record not found' });
    }

    res.status(200).json({ message: 'Resume record deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
