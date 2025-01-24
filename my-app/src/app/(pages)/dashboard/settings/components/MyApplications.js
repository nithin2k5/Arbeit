'use client';

export default function MyApplications() {
  return (
    <section className="content-section">
      <h2>My Applications</h2>
      <div className="applications-list">
        <div className="application-card">
          <h3>Senior Frontend Developer</h3>
          <p>Google</p>
          <span className="status pending">Pending</span>
        </div>
        <div className="application-card">
          <h3>Full Stack Engineer</h3>
          <p>Microsoft</p>
          <span className="status rejected">Rejected</span>
        </div>
        <div className="application-card">
          <h3>UI/UX Designer</h3>
          <p>Apple</p>
          <span className="status accepted">Accepted</span>
        </div>
      </div>
    </section>
  );
} 