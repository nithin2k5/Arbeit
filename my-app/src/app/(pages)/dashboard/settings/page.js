'use client';
import { useState } from 'react';
import { FiUser, FiSettings, FiFileText, FiFolder, FiArrowLeft } from 'react-icons/fi';
import './page.css';
import { useRouter } from 'next/navigation';

import GeneralSettings from './components/GeneralSettings';
import JobPreferences from './components/JobPreferences';
import MyApplications from './components/MyApplications';
import ProfileSettings from './components/ProfileSettings';
import DeleteModal from './components/DeleteModal';
    
const demoUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 234 567 8900',
  location: 'New York, USA',
  summary: 'Experienced software developer with 5 years of experience in full-stack development.',
  resume: 'john_doe_resume.pdf'
};

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('settings');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteAccount = () => {
    // Handle account deletion logic here
    setShowDeleteModal(false);
  };

  const GoToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="settings-container">
      {/* Header */}
      <header className="settings-header">
        <div className="header-content">
          <h1>Arbeit</h1>
          <div className="user-profile">
            <div className="user-avatar">
              <FiUser />
            </div>
            <span>{demoUser.name}</span>
          </div>
          <button onClick={GoToDashboard} className="back-button">
            <FiArrowLeft />
          </button>
        </div>
      </header>

      <div className="settings-layout">
        {/* Sidebar */}
        <aside className="settings-sidebar">
          <nav>
            <button
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <FiSettings /> General Settings
            </button>
            <button
              className={`nav-item ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              <FiFileText /> Job Preferences
            </button>
            <button
              className={`nav-item ${activeTab === 'applications' ? 'active' : ''}`}
              onClick={() => setActiveTab('applications')}
            >
              <FiFolder /> My Applications
            </button>
            <button
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <FiUser /> Profile
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="settings-content">
          {activeTab === 'settings' && (
            <GeneralSettings 
              demoUser={demoUser} 
              onDeleteClick={() => setShowDeleteModal(true)} 
            />
          )}

          {activeTab === 'preferences' && (
            <JobPreferences demoUser={demoUser} />
          )}

          {activeTab === 'applications' && (
            <MyApplications />
          )}

          {activeTab === 'profile' && (
            <ProfileSettings />
          )}
        </main>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDeleteAccount}
        />
      )}
    </div>
  );
}
