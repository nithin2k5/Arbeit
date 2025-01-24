'use client';

export default function JobPreferences({ demoUser }) {
  return (
    <section className="content-section">
      <h2>Job Preferences</h2>
      <div className="settings-form">
        <div className="form-group">
          <label>Professional Summary</label>
          <textarea defaultValue={demoUser.summary} rows={4} />
        </div>
        <div className="form-group">
          <label>Resume</label>
          <div className="resume-upload">
            <span>{demoUser.resume}</span>
            <button className="upload-button">Upload New</button>
          </div>
        </div>
      </div>
    </section>
  );
} 