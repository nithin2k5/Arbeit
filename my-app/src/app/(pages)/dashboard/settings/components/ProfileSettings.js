'use client';
import { FiLock } from 'react-icons/fi';

export default function ProfileSettings() {
  return (
    <section className="content-section">
      <h2>Profile Settings</h2>
      <div className="settings-form">
        <div className="form-group">
          <label>Current Password</label>
          <input type="password" />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input type="password" />
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input type="password" />
        </div>
        <button className="save-button">
          <FiLock /> Update Password
        </button>
      </div>
    </section>
  );
} 