'use client';

import { useState } from 'react';
import './page.css';

export default function BusinessDashboard() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const [newJob, setNewJob] = useState({
    title: '',
    jobType: 'Full Time',
    qualification: '',
    department: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    hideSalary: false,
    hiringProcess: [],
    description: '',
    requirements: '',
    additionalInfo: '',
  });

  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Senior Software Engineer',
      department: 'Engineering',
      jobType: 'Full Time',
      qualification: 'Bachelor\'s in Computer Science',
      location: 'Remote',
      salaryMin: '80000',
      salaryMax: '120000',
      hideSalary: false,
      hiringProcess: ['Face to Face', 'Technical Test'],
      status: 'Active',
      applicants: 12,
      posted: '2024-03-15',
    },
    {
      id: 2,
      title: 'Product Manager',
      department: 'Product',
      jobType: 'Full Time',
      qualification: 'MBA/Bachelor\'s with experience',
      location: 'New York',
      salaryMin: '90000',
      salaryMax: '150000',
      hideSalary: true,
      hiringProcess: ['Virtual Interview', 'Case Study'],
      status: 'Active',
      applicants: 8,
      posted: '2024-03-14',
    },
  ]);

  const [applicants] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      jobTitle: 'Senior Software Engineer',
      email: 'sarah.j@example.com',
      experience: '5 years',
      education: 'MS in Computer Science',
      appliedDate: '2024-03-18',
      status: 'Under Review',
      skills: ['React', 'Node.js', 'Python'],
      matchScore: 85,
    },
    {
      id: 2,
      name: 'Michael Chen',
      jobTitle: 'Product Manager',
      email: 'michael.c@example.com',
      experience: '7 years',
      education: 'MBA',
      appliedDate: '2024-03-17',
      status: 'Shortlisted',
      skills: ['Product Strategy', 'Agile', 'Data Analysis'],
      matchScore: 92,
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      jobTitle: 'Senior Software Engineer',
      email: 'emily.r@example.com',
      experience: '4 years',
      education: 'BS in Computer Engineering',
      appliedDate: '2024-03-16',
      status: 'Under Review',
      skills: ['Java', 'Spring Boot', 'AWS'],
      matchScore: 78,
    },
  ]);

  const hiringProcessOptions = [
    'Face to Face',
    'Written-test',
    'Telephonic',
    'Group Discussion',
    'Virtual Interview',
    'Walk In'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'hideSalary') {
        setNewJob(prev => ({ ...prev, [name]: checked }));
      } else if (name.startsWith('hiringProcess-')) {
        const process = name.replace('hiringProcess-', '');
        setNewJob(prev => ({
          ...prev,
          hiringProcess: checked 
            ? [...prev.hiringProcess, process]
            : prev.hiringProcess.filter(p => p !== process)
        }));
      }
    } else {
      setNewJob(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newJobPost = {
      id: jobs.length + 1,
      ...newJob,
      status: 'Active',
      applicants: 0,
      posted: new Date().toISOString().split('T')[0],
    };
    setJobs(prev => [...prev, newJobPost]);
    setShowModal(false);
    setNewJob({
      title: '',
      jobType: 'Full Time',
      qualification: '',
      department: '',
      location: '',
      salaryMin: '',
      salaryMax: '',
      hideSalary: false,
      hiringProcess: [],
      description: '',
      requirements: '',
      additionalInfo: '',
    });
  };

  const handleDelete = (id) => {
    setJobs(prev => prev.filter(job => job.id !== id));
  };

  const handleStatusChange = (id) => {
    setJobs(prev => prev.map(job => 
      job.id === id 
        ? { ...job, status: job.status === 'Active' ? 'Closed' : 'Active' }
        : job
    ));
  };

  const filteredJobs = jobs
    .filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || job.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesDepartment = departmentFilter === 'all' || job.department.toLowerCase() === departmentFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesDepartment;
    });

  const analyticsData = {
    applicationsOverTime: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [45, 52, 68, 74, 82, 95],
    },
    hiringProgress: {
      total: 95,
      reviewed: 68,
      shortlisted: 24,
      interviewed: 12,
      hired: 8,
    },
    topJobCategories: [
      { name: 'Engineering', count: 45 },
      { name: 'Product', count: 28 },
      { name: 'Marketing', count: 15 },
      { name: 'Sales', count: 12 },
    ],
    applicationSources: [
      { name: 'Company Website', count: 42 },
      { name: 'LinkedIn', count: 35 },
      { name: 'Indeed', count: 28 },
      { name: 'Referrals', count: 15 },
    ],
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Company Dashboard</h1>
        <button className="primary-btn" onClick={() => setShowModal(true)}>+ Post New Job</button>
      </header>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Post Your Job</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="job-form">
              <div className="form-section">
                <h3 className="form-section-title">📋 Basic Information</h3>
                <div className="form-group">
                  <label htmlFor="title" className="required-field">Job Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Software Engineer/ Marketing executive/ Sales executive etc."
                    value={newJob.title}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="helper-text">Enter a clear and specific job title</span>
                </div>
                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="jobType" className="required-field">Job Type</label>
                    <select
                      id="jobType"
                      name="jobType"
                      value={newJob.jobType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div className="form-group half">
                    <label htmlFor="department" className="required-field">Department</label>
                    <select
                      id="department"
                      name="department"
                      value={newJob.department}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Product">Product</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">🎯 Requirements & Location</h3>
                <div className="form-group">
                  <label htmlFor="qualification" className="required-field">Qualification / Eligibility</label>
                  <input
                    type="text"
                    id="qualification"
                    name="qualification"
                    value={newJob.qualification}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Bachelor's in Computer Science, MBA, or relevant experience"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="location" className="required-field">Job Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={newJob.location}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., New York, Remote, Hybrid"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">💰 Compensation</h3>
                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="salaryMin" className="required-field">Monthly Salary (Min)</label>
                    <div className="currency-input">
                      <input
                        type="number"
                        id="salaryMin"
                        name="salaryMin"
                        value={newJob.salaryMin}
                        onChange={handleInputChange}
                        required
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="form-group half">
                    <label htmlFor="salaryMax" className="required-field">Monthly Salary (Max)</label>
                    <div className="currency-input">
                      <input
                        type="number"
                        id="salaryMax"
                        name="salaryMax"
                        value={newJob.salaryMax}
                        onChange={handleInputChange}
                        required
                        min="0"
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group checkbox">
                  <input
                    type="checkbox"
                    id="hideSalary"
                    name="hideSalary"
                    checked={newJob.hideSalary}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="hideSalary">Hide salary from applicants</label>
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">🤝 Hiring Process</h3>
                <div className="form-group">
                  <label>Selection Process</label>
                  <div className="checkbox-group">
                    {hiringProcessOptions.map(process => (
                      <div key={process} className="form-group checkbox">
                        <input
                          type="checkbox"
                          id={`hiringProcess-${process}`}
                          name={`hiringProcess-${process}`}
                          checked={newJob.hiringProcess.includes(process)}
                          onChange={handleInputChange}
                        />
                        <label htmlFor={`hiringProcess-${process}`}>{process}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">📝 Job Details</h3>
                <div className="form-group">
                  <label htmlFor="description" className="required-field">Job Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newJob.description}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    placeholder="Describe the role, responsibilities, and expectations..."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="additionalInfo">Additional Information</label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    value={newJob.additionalInfo}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Any additional details about the position, perks, or company culture..."
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="secondary-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="primary-btn">Post Job</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <nav className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          Jobs
        </button>
        <button 
          className={`tab ${activeTab === 'applicants' ? 'active' : ''}`}
          onClick={() => setActiveTab('applicants')}
        >
          Applicants
        </button>
        <button 
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </nav>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Active Jobs</h3>
          <p className="stat-number">{jobs.filter(job => job.status === 'Active').length}</p>
          <p className="stat-trend positive">↑ 20% from last month</p>
        </div>
        <div className="stat-card">
          <h3>Total Applicants</h3>
          <p className="stat-number">{jobs.reduce((sum, job) => sum + job.applicants, 0)}</p>
          <p className="stat-trend positive">↑ 15% from last month</p>
        </div>
        <div className="stat-card">
          <h3>Hired</h3>
          <p className="stat-number">8</p>
          <p className="stat-trend neutral">= Same as last month</p>
        </div>
      </div>

      <div className="dashboard-content">
        {activeTab === 'jobs' && (
          <div className="jobs-table">
            <div className="table-header">
              <div className="table-search">
                <input 
                  type="text" 
                  placeholder="Search jobs..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="table-filters">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                  <option value="draft">Draft</option>
                </select>
                <select 
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="all">All Departments</option>
                  <option value="engineering">Engineering</option>
                  <option value="product">Product</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                </select>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Department</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Applicants</th>
                  <th>Posted Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.title}</td>
                    <td>{job.department}</td>
                    <td>{job.location}</td>
                    <td>
                      <span className={`status ${job.status.toLowerCase()}`}>
                        {job.status}
                      </span>
                    </td>
                    <td>{job.applicants}</td>
                    <td>{job.posted}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="icon-btn" title="View Details">👁️</button>
                        <button 
                          className="icon-btn" 
                          title={job.status === 'Active' ? 'Close Job' : 'Reopen Job'}
                          onClick={() => handleStatusChange(job.id)}
                        >
                          {job.status === 'Active' ? '🔒' : '🔓'}
                        </button>
                        <button 
                          className="icon-btn" 
                          title="Delete Job"
                          onClick={() => handleDelete(job.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'applicants' && (
          <div className="applicants-grid">
            {applicants.map((applicant) => (
              <div key={applicant.id} className="applicant-card">
                <div className="applicant-header">
                  <div className="applicant-avatar">
                    {applicant.name.charAt(0)}
                  </div>
                  <div className="applicant-info">
                    <h4>{applicant.name}</h4>
                    <p>{applicant.jobTitle}</p>
                  </div>
                </div>
                <div className="applicant-details">
                  <div className="detail-row">
                    <span className="detail-label">Experience</span>
                    <span className="detail-value">{applicant.experience}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Education</span>
                    <span className="detail-value">{applicant.education}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Applied Date</span>
                    <span className="detail-value">{applicant.appliedDate}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status</span>
                    <span className="detail-value">{applicant.status}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Match Score</span>
                    <span className="detail-value">{applicant.matchScore}%</span>
                  </div>
                </div>
                <div className="applicant-actions">
                  <button className="action-btn approve">Approve</button>
                  <button className="action-btn reject">Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>Applications Over Time</h3>
              <div className="chart-container">
                <div className="chart-placeholder" style={{ 
                  height: '100%', 
                  background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.2))',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#3b82f6',
                  fontWeight: 500
                }}>
                  Applications Chart
                </div>
              </div>
            </div>
            <div className="analytics-card">
              <h3>Hiring Progress</h3>
              <div className="chart-container">
                <div className="chart-placeholder" style={{ 
                  height: '100%', 
                  background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.2))',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#3b82f6',
                  fontWeight: 500
                }}>
                  Hiring Progress Chart
                </div>
              </div>
            </div>
            <div className="analytics-card">
              <h3>Top Job Categories</h3>
              <div className="chart-container">
                <div className="chart-placeholder" style={{ 
                  height: '100%', 
                  background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.2))',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#3b82f6',
                  fontWeight: 500
                }}>
                  Categories Chart
                </div>
              </div>
            </div>
            <div className="analytics-card">
              <h3>Application Sources</h3>
              <div className="chart-container">
                <div className="chart-placeholder" style={{ 
                  height: '100%', 
                  background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.2))',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#3b82f6',
                  fontWeight: 500
                }}>
                  Sources Chart
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
