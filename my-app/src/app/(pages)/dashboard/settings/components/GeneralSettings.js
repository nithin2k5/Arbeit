'use client';
import { FiTrash2 } from 'react-icons/fi';

export default function GeneralSettings({ demoUser, onDeleteClick }) {
  return (
    <section className="content-section">
      <h2>General Settings</h2>
      <div className="settings-form">
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" defaultValue={demoUser.name} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" defaultValue={demoUser.email} />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input type="tel" defaultValue={demoUser.phone} />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input type="text" defaultValue={demoUser.location} />
        </div>
        <div className="danger-zone">
          <h3>Danger Zone</h3>
          <button className="delete-button" onClick={onDeleteClick}>
            <FiTrash2 /> Delete Account
          </button>
        </div>
      </div>
    </section>
  );
} 