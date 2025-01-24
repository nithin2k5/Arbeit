'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import './page.css';

export default function ApplyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [job, setJob] = useState(null);
  const [applicationData, setApplicationData] = useState({
    resume: null,
    coverLetter: '',
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      linkedin: '',
    },
    questions: []
  });

  useEffect(() => {
    const fetchJob = async () => {
      const jobId = searchParams.get('job');
      if (!jobId) {
        toast.error('No job selected');
        router.push('/dashboard');
        return;
      }

      try {
        // In a real app, this would be an API call
        // For now, simulating with setTimeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulated job data
        const jobData = {
          id: jobId,
          title: 'Senior Frontend Developer',
          company: 'Tech Corp',
          logo: '/company-logo.svg',
          location: 'Remote / New York, NY',
          salary: '$120k - $150k',
          type: 'Full-Time',
          postedDate: new Date('2024-03-01'),
          description: `We're looking for a Senior Frontend Developer to join our growing team. 
            You'll be working on cutting-edge projects using the latest technologies.`,
          requirements: [
            '5+ years of React experience',
            'Strong TypeScript skills',
            'Experience with Next.js',
            'Understanding of modern UI/UX principles'
          ],
          benefits: [
            'Competitive salary & equity',
            'Remote-first culture',
            'Comprehensive health insurance',
            'Unlimited PTO',
            'Learning & development budget'
          ],
          screeningQuestions: [
            {
              id: 1,
              question: 'How many years of React experience do you have?',
              type: 'text'
            },
            {
              id: 2,
              question: 'Are you authorized to work in the United States?',
              type: 'boolean'
            }
          ]
        };

        setJob(jobData);
        setApplicationData(prev => ({
          ...prev,
          questions: jobData.screeningQuestions.map(q => ({ questionId: q.id, answer: '' }))
        }));
      } catch (error) {
        toast.error('Failed to load job details');
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [searchParams]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type.includes('word'))) {
      setApplicationData(prev => ({
        ...prev,
        resume: file
      }));
      toast.success('Resume uploaded successfully');
    } else {
      toast.error('Please upload a PDF or Word document');
    }
  };

  const updatePersonalInfo = (field, value) => {
    setApplicationData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const handleQuestionAnswer = (questionId, answer) => {
    setApplicationData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.questionId === questionId ? { ...q, answer } : q
      )
    }));
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      // Validate all required fields
      if (!applicationData.resume) {
        throw new Error('Please upload your resume');
      }

      if (!applicationData.questions.every(q => q.answer)) {
        throw new Error('Please answer all screening questions');
      }

      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Application submitted successfully!');
      router.push('/dashboard/applications');
    } catch (error) {
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!job) {
    return null;
  }

  const steps = [
    { number: 1, title: 'Job Details' },
    { number: 2, title: 'Personal Info' },
    { number: 3, title: 'Documents' },
    { number: 4, title: 'Questions' },
    { number: 5, title: 'Review' }
  ];

  return (
    <div className="apply-container">
      {/* Progress Bar */}
      <div className="progress-bar">
        {steps.map((step, index) => (
          <div 
            key={step.number}
            className={`step-indicator ${currentStep >= step.number ? 'active' : ''}`}
            onClick={() => currentStep > step.number && setCurrentStep(step.number)}
          >
            <div className="step-number">{step.number}</div>
            <span className="step-title">{step.title}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="apply-content"
        >
          {currentStep === 1 && (
            <div className="job-details-section">
              <div className="job-header">
                <img src={job.logo} alt={job.company} className="company-logo" />
                <div>
                  <h1>{job.title}</h1>
                  <h2>{job.company}</h2>
                  <div className="job-meta">
                    <span>{job.location}</span>
                    <span>{job.salary}</span>
                    <span>{job.type}</span>
                  </div>
                </div>
              </div>
              
              <div className="job-description">
                <p>{job.description}</p>
                
                <h3>Requirements</h3>
                <ul>
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>

                <h3>Benefits</h3>
                <ul>
                  {job.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="personal-info-section">
              <h2>Personal Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={applicationData.personalInfo.fullName}
                    onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={applicationData.personalInfo.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={applicationData.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div className="form-group">
                  <label>LinkedIn Profile</label>
                  <input
                    type="url"
                    value={applicationData.personalInfo.linkedin}
                    onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/johndoe"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="documents-section">
              <h2>Upload Documents</h2>
              
              <div className="upload-area">
                <div className={`resume-upload ${applicationData.resume ? 'has-file' : ''}`}>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload">
                    {applicationData.resume ? (
                      <>
                        <i className="fas fa-file-alt" />
                        <span>{applicationData.resume.name}</span>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            setApplicationData(prev => ({ ...prev, resume: null }));
                          }}
                          className="remove-file"
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-cloud-upload-alt" />
                        <span>Drop your resume here or click to browse</span>
                        <small>PDF or Word documents only</small>
                      </>
                    )}
                  </label>
                </div>

                <div className="cover-letter">
                  <label>Cover Letter (Optional)</label>
                  <textarea
                    value={applicationData.coverLetter}
                    onChange={(e) => setApplicationData(prev => ({
                      ...prev,
                      coverLetter: e.target.value
                    }))}
                    placeholder="Write your cover letter here..."
                    rows={6}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="questions-section">
              <h2>Screening Questions</h2>
              
              {job.screeningQuestions.map((question) => (
                <div key={question.id} className="question-item">
                  <label>{question.question}</label>
                  {question.type === 'boolean' ? (
                    <div className="boolean-options">
                      <button
                        className={applicationData.questions.find(q => q.questionId === question.id)?.answer === 'Yes' ? 'active' : ''}
                        onClick={() => handleQuestionAnswer(question.id, 'Yes')}
                      >
                        Yes
                      </button>
                      <button
                        className={applicationData.questions.find(q => q.questionId === question.id)?.answer === 'No' ? 'active' : ''}
                        onClick={() => handleQuestionAnswer(question.id, 'No')}
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={applicationData.questions.find(q => q.questionId === question.id)?.answer || ''}
                      onChange={(e) => handleQuestionAnswer(question.id, e.target.value)}
                      placeholder="Your answer"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {currentStep === 5 && (
            <div className="review-section">
              <h2>Review Your Application</h2>
              
              <div className="review-content">
                <div className="review-section">
                  <h3>Personal Information</h3>
                  <div className="review-grid">
                    <div>
                      <label>Full Name</label>
                      <p>{applicationData.personalInfo.fullName}</p>
                    </div>
                    <div>
                      <label>Email</label>
                      <p>{applicationData.personalInfo.email}</p>
                    </div>
                    <div>
                      <label>Phone</label>
                      <p>{applicationData.personalInfo.phone}</p>
                    </div>
                    <div>
                      <label>LinkedIn</label>
                      <p>{applicationData.personalInfo.linkedin}</p>
                    </div>
                  </div>
                </div>

                <div className="review-section">
                  <h3>Documents</h3>
                  <div>
                    <label>Resume</label>
                    <p>{applicationData.resume?.name}</p>
                  </div>
                  {applicationData.coverLetter && (
                    <div>
                      <label>Cover Letter</label>
                      <p>{applicationData.coverLetter}</p>
                    </div>
                  )}
                </div>

                <div className="review-section">
                  <h3>Screening Questions</h3>
                  {job.screeningQuestions.map((question) => (
                    <div key={question.id}>
                      <label>{question.question}</label>
                      <p>{applicationData.questions.find(q => q.questionId === question.id)?.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="apply-actions">
        {currentStep > 1 && (
          <button 
            className="secondary-button"
            onClick={() => setCurrentStep(prev => prev - 1)}
          >
            Back
          </button>
        )}
        
        {currentStep < 5 ? (
          <button 
            className="primary-button"
            onClick={() => setCurrentStep(prev => prev + 1)}
          >
            Continue
          </button>
        ) : (
          <button
            className="submit-button"
            onClick={handleSubmit(onSubmit)}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        )}
      </div>
    </div>
  );
} 