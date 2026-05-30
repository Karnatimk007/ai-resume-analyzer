# ResuMind 🧠 - AI-Powered Resume Analyzer & ATS Optimizer

ResuMind is a premium, full-stack web application designed to help job seekers evaluate, optimize, and customize their resumes to bypass Applicant Tracking Systems (ATS) and match specific job descriptions. 

Using advanced AI, the platform parses uploaded documents, calculates a realistic ATS score, highlights missing keywords, suggests structural improvements, and lets users edit and download an optimized resume as a clean, professionally formatted PDF.

---

## 🌟 Key Features

* **Secure Authentication**: JWT-based login and registration with automated session restoration via secure, HTTP-only refresh token rotation.
* **Document Parsing**: Direct text extraction from **PDF** and **DOCX** files in real-time.
* **ATS Compatibility Scoring**: Instant, animated visual scoring gauge mapping out how search filters evaluate your credentials.
* **Job Role Matching**: Copy and paste target job descriptions to analyze skill gaps, align terminology, and receive role-relevance comments.
* **Core Assessments**: Clear card breakdowns highlighting your resume's key strengths and critical areas for improvement.
* **Interactive Resume Editor**: Customize and tweak the AI-recommended resume template within a built-in markdown editor.
* **A4 PDF Downloader**: Compile and export your optimized resume directly to a standard A4 print format with professional typography.
* **Resume History Dashboard**: An analytical hub displaying your upload stats, average ATS score, and historical reports.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** & **Vite** (Ultra-fast client bundling)
- **Tailwind CSS v4** (Modern utility-first styling with native CSS @theme configurations)
- **Lucide React** (Crisp vector iconography)

### Backend
- **Node.js** & **Express** (Robust RESTful API design)
- **MongoDB** & **Mongoose** (Document schemas and session storage)
- **Multer** & **pdf-parse / mammoth** (File stream handling and document text extraction)

### Core Services
- **Google Gemini 1.5 Flash API** (Default primary AI parsing engine)
- **OpenAI API** (Secondary AI option)
- **Cloudinary API** (Cloud asset uploads, automatically falling back to secure local file storage if left unconfigured)

---

## 🚀 Installation & Local Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and [MongoDB](https://www.mongodb.com/) installed and running locally.

### 1. Clone the Repository
```bash
git clone https://github.com/Karnatimk007/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2. Configure the Backend
Navigate to the `backend` folder and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file from the provided template:
```bash
cp .env.example .env
```
Open `.env` and fill in your keys:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume-analyzer
JWT_ACCESS_SECRET=your_jwt_access_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here

# AI Credentials
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Cloud Storage (Optional - Fallbacks to backend/uploads/)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

FRONTEND_URL=http://localhost:5173
```

Start the backend development server:
```bash
npm run dev
```

### 3. Configure the Frontend
Open a new terminal window, navigate to the `frontend` folder, and install dependencies:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser!

---

## 🛰️ API Endpoints Reference

### Authentication Routing (`/user-api/auth`)
* `POST /register`: Registers a new user.
* `POST /login`: Validates credentials, sets an HTTP-only Refresh Token cookie, and returns a short-lived Access Token.
* `POST /refresh`: Verifies the cookie and rotates in a new Access Token.
* `POST /logout`: Invalidates session tokens and clears cookies.

### Resume Routing (`/user-api/resumes`) *(Requires Bearer Authorization Header)*
* `POST /analyze`: Accepts file uploads (`PDF`/`DOCX`) and parses contents against an optional target `jobDescription`.
* `GET /history`: Retrieves the user's historical upload cards and scores.
* `GET /:id`: Retrieves the detailed analysis record, strengths, missing keywords, and markdown template of a single resume.
* `DELETE /:id`: Deletes a resume analysis record.

---

## 🔒 Security Best Practices

1. **Secret Encryption**: Cryptographic salts are applied to passwords using `bcrypt`.
2. **Tokens Isolation**: Short-lived Access Tokens are stored in frontend application state memory. Long-lived Refresh Tokens are stored in secure, `HttpOnly` same-site cookies to block cross-site scripting (XSS) vectors.
3. **Data Sanitization**: Direct substring comparisons are used on user-controlled file data rather than passing inputs straight to regex execution systems (preventing regex injection vulnerability).
4. **Local Isolation**: If cloud keys are absent, uploaded documents are sandboxed locally rather than failing requests.

---

## 📄 License
This project is licensed under the ISC License.
