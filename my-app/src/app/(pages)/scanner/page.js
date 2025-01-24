'use client';

import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

let pdfjsLib;
if (typeof window !== 'undefined') {
  pdfjsLib = require('pdfjs-dist/build/pdf');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;
}

export default function ScannerPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    
    // Check file type
    if (uploadedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      setFile(null);
      return;
    }
    
    // Check file size (5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (uploadedFile.size > MAX_FILE_SIZE) {
      setError('File size exceeds 5MB limit. Please upload a smaller file.');
      setFile(null);
      return;
    }
    
    setFile(uploadedFile);
    setError(null);
    setResult(null);
  };

  const extractTextFromPDF = async (file) => {
    if (!pdfjsLib) {
      throw new Error('PDF.js library not loaded');
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument(new Uint8Array(arrayBuffer));
      const pdf = await loadingTask.promise;
      let fullText = '';

      // Get total number of pages
      const numPages = pdf.numPages;
      
      // Extract text from each page
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map(item => item.str)
          .join(' ');
        fullText += pageText + '\\n';
      }

      return fullText;
    } catch (error) {
      console.error('PDF parsing error:', error);
      throw new Error('Failed to parse PDF file. Please make sure it\'s a valid PDF document.');
    }
  };

  const analyzeResume = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    
    try {
      // Extract text from PDF
      const fileContent = await extractTextFromPDF(file);
      
      if (!fileContent || fileContent.trim().length === 0) {
        throw new Error('Could not extract text from the PDF. Please make sure it\'s a text-based PDF and not a scanned image.');
      }

      // Initialize Gemini AI with proper error handling
      if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        throw new Error('Gemini API key is not configured');
      }

      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      // Prepare the prompt
      const prompt = `You are an expert ATS (Applicant Tracking System) analyzer. Analyze this resume and provide detailed feedback in the following format:

      OVERALL SCORE: [Score out of 100]

      KEY STRENGTHS:
      - [Strength 1]
      - [Strength 2]
      - [Strength 3]

      AREAS FOR IMPROVEMENT:
      - [Area 1]
      - [Area 2]
      - [Area 3]

      KEYWORD OPTIMIZATION:
      - Missing Important Keywords: [List keywords]
      - Suggested Keywords to Add: [List keywords]

      FORMAT AND STRUCTURE:
      - [Feedback on format]
      - [Feedback on structure]
      - [Feedback on readability]

      RECOMMENDATIONS:
      1. [Specific recommendation 1]
      2. [Specific recommendation 2]
      3. [Specific recommendation 3]

      Resume content to analyze:
      ${fileContent}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setResult(response.text());
      
    } catch (error) {
      console.error('Error analyzing resume:', error);
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        setError('API rate limit reached. Please try again in a few minutes.');
      } else if (error.message?.includes('API key')) {
        setError('Gemini API key is not properly configured. Please check your environment settings.');
      } else if (error.message?.includes('scanned image')) {
        setError('Could not extract text from the PDF. Please make sure it\'s a text-based PDF and not a scanned image.');
      } else if (error.message?.includes('PDF')) {
        setError('Error reading PDF file. Please make sure it\'s a valid PDF document.');
      } else {
        setError('Error analyzing resume. Please try again or contact support if the issue persists.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ATS Resume Scanner</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Upload your resume (PDF only)
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          <p className="mt-2 text-sm text-gray-500">
            Maximum file size: 5MB. Text-based PDFs only (scanned documents may not work).
          </p>
        </div>

        <button
          onClick={analyzeResume}
          disabled={!file || loading}
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md
            hover:bg-blue-700 transition-colors
            ${(!file || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </span>
          ) : 'Analyze Resume'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Analysis Results</h2>
          <div className="whitespace-pre-wrap prose max-w-none">{result}</div>
        </div>
      )}
    </div>
  );
}
