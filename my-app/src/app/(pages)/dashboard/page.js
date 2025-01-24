'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './page.css';

export default function DashboardPage() {
  const router = useRouter();
  const [selectedJob, setSelectedJob] = useState(null);
  const [activeFilter, setActiveFilter] = useState('latest');

  const keywords = ['All', 'Remote', 'Full-Time', 'Part-Time', 'Contract', 'Engineering', 'Design', 'Marketing'];

  const jobs = [
    {
      id: 1,
      logo: '🏢',
      title: 'Senior Frontend Developer',
      company: 'Tech Corp',
      description: 'Looking for an experienced frontend developer with React expertise...',
      fullDescription: `We are seeking a Senior Frontend Developer to join our dynamic team.

      Requirements:
      • 5+ years of React experience
      • Strong TypeScript skills
      • Experience with Next.js
      • Understanding of modern UI/UX principles

      Benefits:
      • Competitive salary
      • Remote work options
      • Health insurance
      • 401(k) matching`,
      location: 'New York, NY',
      salary: '$120k - $150k',
      type: 'Full-Time',
      posted: '2 days ago'
    },
    {
      id: 2,
      logo: '💻',
      title: 'UX Designer',
      company: 'Design Masters',
      description: 'Creative UX Designer needed for innovative projects...',
      fullDescription: 'Detailed UX Designer role description...',
      location: 'Remote',
      salary: '$90k - $120k',
      type: 'Remote',
      posted: '1 day ago'
    },
    {
      id: 3,
      logo: '🚀',
      title: 'Product Manager',
      company: 'Startup Inc',
      description: 'Experienced PM for fast-growing startup...',
      fullDescription: 'Detailed Product Manager role description...',
      location: 'San Francisco, CA',
      salary: '$130k - $160k',
      type: 'Full-Time',
      posted: '3 days ago'
    },
    // Add more job listings as needed
  ];

  const handleApply = (job) => {
    router.push(`/dashboard/apply?job=${job.id}`);
  };

  return (
    <div className="dashboard-container">
      {/* Header One */}
      <header className="main-header">
        <div className="logo">
          <h1>Arbeit</h1>
        </div>
        
        <div className="search-bar">
          <input type="text" placeholder="Search for jobs, companies, or keywords..." />
          <button className="search-button">Search</button>
        </div>

        <div className="header-buttons">
          <button className="action-button">Resume Generator</button>
          <button className="action-button">ATS Scanner</button>
          <div className="profile-button">
            <i className="fas fa-user"></i>
          </div>
        </div>
      </header>

      {/* Header Two - Filters */}
      <div className="filters-header">
        <div className="filter-group">
          <button className={`filter-btn ${activeFilter === 'latest' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('latest')}>
            Latest
          </button>
          <button className={`filter-btn ${activeFilter === 'old' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('old')}>
            Oldest
          </button>
        </div>

        <div className="filter-dropdowns">
          <select className="filter-select">
            <option value="">Location</option>
            <option>Remote</option>
            <option>New York</option>
            <option>San Francisco</option>
          </select>

          <select className="filter-select">
            <option value="">Experience</option>
            <option>Entry Level</option>
            <option>Mid Level</option>
            <option>Senior Level</option>
          </select>

          <select className="filter-select">
            <option value="">Salary Range</option>
            <option>$0 - $50k</option>
            <option>$50k - $100k</option>
            <option>$100k+</option>
          </select>

          <select className="filter-select">
            <option value="">Role</option>
            <option>Frontend Developer</option>
            <option>Backend Developer</option>
            <option>Full Stack Developer</option>
          </select>

          <select className="filter-select">
            <option value="">Job Type</option>
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Contract</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="job-listings">
          {jobs.map(job => (
            <div 
              key={job.id} 
              className={`job-card ${selectedJob?.id === job.id ? 'selected' : ''}`}
              onClick={() => setSelectedJob(job)}
            >
              <div className="job-logo">{job.logo}</div>
              <div className="job-info">
                <div className="job-header">
                  <h3>{job.title}</h3>
                  <span className="job-type">{job.type}</span>
                </div>
                <p className="company-name">{job.company}</p>
                <p className="job-description">{job.description}</p>
                <div className="job-meta">
                  <span><i className="fas fa-map-marker-alt"></i> {job.location}</span>
                  <span><i className="fas fa-money-bill-wave"></i> {job.salary}</span>
                  <span><i className="fas fa-clock"></i> {job.posted}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="job-details">
          {selectedJob ? (
            <>
              <div className="details-header">
                <div className="details-logo">{selectedJob.logo}</div>
                <div>
                  <h2>{selectedJob.title}</h2>
                  <h3>{selectedJob.company}</h3>
                </div>
              </div>
              <div className="details-meta">
                <span><i className="fas fa-map-marker-alt"></i> {selectedJob.location}</span>
                <span><i className="fas fa-money-bill-wave"></i> {selectedJob.salary}</span>
                <span><i className="fas fa-clock"></i> Posted {selectedJob.posted}</span>
              </div>
              <div className="details-content">
                <pre>{selectedJob.fullDescription}</pre>
              </div>
              <div className="details-buttons">
                <button className="apply-button" onClick={() => handleApply(selectedJob)}>
                  Apply Now
                </button>
                <button className="generate-resume-button">
                  Generate Resume
                </button>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <p>Select a job to view details</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
