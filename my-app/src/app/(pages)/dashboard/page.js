'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './page.css';

export default function Dashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [activeFilter, setActiveFilter] = useState('latest');

  const keywords = ['All', 'Remote', 'Full-Time', 'Part-Time', 'Contract', 'Engineering', 'Design', 'Marketing'];

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/jobs');
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = 
      departmentFilter === 'all' || 
      job.department.toLowerCase() === departmentFilter.toLowerCase();
    
    const matchesJobType = 
      jobTypeFilter === 'all' || 
      job.jobType.toLowerCase() === jobTypeFilter.toLowerCase();

    return matchesSearch && matchesDepartment && matchesJobType && job.status === 'Active';
  });

  const handleJobClick = (e, job) => {
    e.preventDefault(); // Prevent the Link from navigating immediately
    setSelectedJob(job);
  };

  const handleApplyClick = (job) => {
    router.push(`/dashboard/apply?jobId=${job.jobId}`);
  };

  if (loading) {
    return <div className="loading">Loading jobs...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Header One */}
      <header className="main-header">
        <div className="logo">
          <h1>Arbeit</h1>
        </div>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for jobs, companies, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button">Search</button>
        </div>

        <div className="header-buttons">
          <button className="action-button">Resume Generator</button>
          <button className="action-button">ATS Scanner</button>
          <div className="profile-button">
            <i className="fas fa-user"></i>
            <div className="profile-dropdown">
              <button onClick={() => router.push('/dashboard/settings')} className="dropdown-item">
                Settings
              </button>
              <button onClick={() => router.push('/auth')} className="dropdown-item">
                Log out
              </button>
            </div>
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
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="all">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
          </select>

          <select
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
          >
            <option value="all">All Job Types</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="jobs-grid">
          {filteredJobs.length === 0 ? (
            <div className="no-jobs">
              <h3>No jobs found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <Link 
                href={`/dashboard/apply?jobId=${job.jobId}`}
                key={job.jobId} 
                className={`job-card ${selectedJob?.jobId === job.jobId ? 'selected' : ''}`}
                onClick={(e) => handleJobClick(e, job)}
              >
                <div className="job-card-header">
                  <div className="company-logo">
                    {job.logo ? (
                      <img src={job.logo} alt={`${job.company} logo`} />
                    ) : (
                      <span>{job.company[0]}</span>
                    )}
                  </div>
                  <div className="job-info">
                    <h3>{job.title}</h3>
                    <p className="company">{job.company}</p>
                  </div>
                  <div className="job-id">#{job.jobId}</div>
                </div>
                <div className="job-details">
                  <div className="detail">
                    <span className="icon">📍</span>
                    <span>{job.location}</span>
                  </div>
                  <div className="detail">
                    <span className="icon">💼</span>
                    <span>{job.jobType}</span>
                  </div>
                  <div className="detail">
                    <span className="icon">🏢</span>
                    <span>{job.department}</span>
                  </div>
                  {!job.hideSalary && (
                    <div className="detail">
                      <span className="icon">💰</span>
                      <span>${job.salaryMin} - ${job.salaryMax}</span>
                    </div>
                  )}
                </div>
                <div className="job-footer">
                  <div className="tags">
                    {job.requirements.slice(0, 3).map((req, index) => (
                      <span key={index} className="tag">{req}</span>
                    ))}
                  </div>
                  <span className="posted-date">
                    Posted {new Date(job.postedDate).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Side Details Panel */}
        <div className="job-details-panel">
          {selectedJob ? (
            <div className="details-content">
              <div className="details-header">
                <div className="company-logo">
                  {selectedJob.logo ? (
                    <img src={selectedJob.logo} alt={`${selectedJob.company} logo`} />
                  ) : (
                    <span>{selectedJob.company[0]}</span>
                  )}
                </div>
                <div>
                  <h2>{selectedJob.title}</h2>
                  <p className="company">{selectedJob.company}</p>
                  <div className="job-id">#{selectedJob.jobId}</div>
                </div>
              </div>
              
              <div className="details-info">
                <div className="detail-section">
                  <h3>Job Details</h3>
                  <div className="detail-grid">
                    <div className="detail">
                      <span className="icon">📍</span>
                      <span>{selectedJob.location}</span>
                    </div>
                    <div className="detail">
                      <span className="icon">💼</span>
                      <span>{selectedJob.jobType}</span>
                    </div>
                    <div className="detail">
                      <span className="icon">🏢</span>
                      <span>{selectedJob.department}</span>
                    </div>
                    {!selectedJob.hideSalary && (
                      <div className="detail">
                        <span className="icon">💰</span>
                        <span>${selectedJob.salaryMin} - ${selectedJob.salaryMax}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Description</h3>
                  <p>{selectedJob.description}</p>
                </div>

                <div className="detail-section">
                  <h3>Requirements</h3>
                  <ul>
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="details-buttons">
                  <button 
                    className="apply-button"
                    onClick={() => handleApplyClick(selectedJob)}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
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
