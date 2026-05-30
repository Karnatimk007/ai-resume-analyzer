import { createRequire } from 'module';
import mammoth from 'mammoth';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

/**
 * Extract text content from a file buffer based on mimetype.
 * Supports PDF and DOCX.
 * @param {Buffer} buffer - File buffer
 * @param {string} mimetype - Mimetype of the file
 * @returns {Promise<string>} Parsed text content
 */
export const parseResume = async (buffer, mimetype) => {
  if (mimetype === 'application/pdf') {
    const instance = new pdfParse.PDFParse({ data: buffer });
    try {
      const data = await instance.getText();
      return data.text;
    } finally {
      await instance.destroy();
    }
  } else if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
    mimetype === 'application/octet-stream' // sometimes docx returns octet-stream
  ) {
    const data = await mammoth.extractRawText({ buffer });
    return data.value;
  } else {
    throw new Error('Unsupported file format. Please upload a PDF or DOCX file.');
  }
};
