'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import './page.css';

export default function ApplyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [resumeFile, setResumeFile] = useState(null);
  const [step, setStep] = useState(1);
  const [job, setJob] = useState(null);

  // Sample jobs data (in real app, this would come from an API/database)
  const jobs = [
    {
      id: 1,
      logo: '🏢',
      title: 'Senior Frontend Developer',
      company: 'Tech Corp',
      location: 'New York, NY',
      salary: '$120k - $150k',
      type: 'Full-Time',
      posted: '2 days ago',
      description: 'Looking for an experienced frontend developer with React expertise...',
      requirements: [
        '5+ years of React experience',
        'Strong TypeScript skills',
        'Experience with Next.js',
        'Understanding of modern UI/UX principles'
      ],
      benefits: [
        'Competitive salary',
        'Remote work options',
        'Health insurance',
        '401(k) matching'
      ]
    },
    {
      id: 2,
      logo: '💻',
      title: 'UX Designer',
      company: 'Design Masters',
      location: 'Remote',
      salary: '$90k - $120k',
      type: 'Remote',
      posted: '1 day ago',
      description: 'Creative UX Designer needed for innovative projects...',
      requirements: [
        '3+ years of UX design experience',
        'Proficiency in Figma',
        'Experience with user research',
        'Strong portfolio'
      ],
      benefits: [
        'Flexible hours',
        'Home office stipend',
        'Healthcare coverage',
        'Professional development budget'
      ]
    },
    {
      id: 3,
      logo: '🚀',
      title: 'Product Manager',
      company: 'Startup Inc',
      location: 'San Francisco, CA',
      salary: '$130k - $160k',
      type: 'Full-Time',
      posted: '3 days ago',
      description: 'Experienced PM for fast-growing startup...',
      requirements: [
        '5+ years of product management',
        'Experience with agile methodologies',
        'Strong analytical skills',
        'Excellent communication'
      ],
      benefits: [
        'Equity package',
        'Full benefits',
        'Unlimited PTO',
        'Gym membership'
      ]
    }
  ];

  useEffect(() => {
    const jobId = searchParams.get('job');
    if (!jobId) {
      router.push('/dashboard');
      return;
    }

    const selectedJob = jobs.find(j => j.id === parseInt(jobId));
    if (!selectedJob) {
      router.push('/dashboard');
      return;
    }

    setJob(selectedJob);
  }, [searchParams]);

  if (!job) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="apply-container">
      <div className="apply-header">
        <button className="back-button" onClick={() => router.push('/dashboard')}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <div className="steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <span>Review</span>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <span>Resume</span>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span>Submit</span>
          </div>
        </div>
      </div>

      <div className="apply-content">
        <div className="job-summary">
          <div className="summary-header">
            <div className="company-logo">{job.logo}</div>
            <div className="summary-info">
              <h2>{job.title}</h2>
              <h3>{job.company}</h3>
              <div className="summary-meta">
                <span><i className="fas fa-map-marker-alt"></i> {job.location}</span>
                <span><i className="fas fa-money-bill-wave"></i> {job.salary}</span>
                <span><i className="fas fa-briefcase"></i> {job.type}</span>
                <span><i className="fas fa-clock"></i> Posted {job.posted}</span>
              </div>
            </div>
          </div>

          <div className="job-details">
            <div className="details-section">
              <h4>Requirements</h4>
              <ul>
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="details-section">
              <h4>Benefits</h4>
              <ul>
                {job.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="apply-form">
          <div className="form-section">
            <h3>Upload Resume</h3>
            <div className="resume-upload">
              {resumeFile ? (
                <div className="uploaded-file">
                  <div className="file-info">
                    <i className="fas fa-file-pdf"></i>
                    <span>{resumeFile.name}</span>
                  </div>
                  <button onClick={() => setResumeFile(null)}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ) : (
                <div className="upload-area">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <h4>Drag & Drop Resume</h4>
                  <p>or <span>browse files</span></p>
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    onChange={(e) => setResumeFile(e.target.files[0])}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="form-divider">
            <span>OR</span>
          </div>

          <div className="form-section">
            <button className="generate-button">
              <i className="fas fa-magic"></i>
              Generate Tailored Resume
            </button>
            <p className="generate-info">
              Our AI will create a customized resume based on the job requirements
            </p>
          </div>

          <div className="form-actions">
            <button className="secondary-button" onClick={() => router.back()}>
              Cancel
            </button>
            <button className="submit-button">
              Submit Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 