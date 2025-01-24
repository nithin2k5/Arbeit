"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './page.css';

const commonSkills = [
  'JavaScript', 'Python', 'React', 'Node.js', 'SQL',
  'Java', 'C++', 'AWS', 'Docker', 'Git',
  'TypeScript', 'HTML/CSS', 'Angular', 'Vue.js', 'MongoDB',
  'Nothing yet'
];

export default function MentorshipInputPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    dreamRole: '',
    selectedSkills: new Set(),
  });
  const [error, setError] = useState(null);

  const toggleSkill = (skill) => {
    const newSkills = new Set(formData.selectedSkills);
    if (skill === 'Nothing yet') {
      newSkills.clear();
      newSkills.add('Nothing yet');
    } else {
      newSkills.delete('Nothing yet');
      if (newSkills.has(skill)) {
        newSkills.delete(skill);
      } else {
        newSkills.add(skill);
      }
    }
    setFormData({ ...formData, selectedSkills: newSkills });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/mentorship/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dreamRole: formData.dreamRole,
          currentSkills: Array.from(formData.selectedSkills).join(', ')
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate roadmap');
      }

      if (!data.roadmap) {
        throw new Error('No roadmap data received');
      }

      // Store the roadmap data in localStorage
      localStorage.setItem('mentorshipRoadmap', data.roadmap);
      localStorage.setItem('dreamRole', formData.dreamRole);
      
      // Navigate to the dashboard
      router.push('/dashboard/mentorship');
    } catch (err) {
      console.error('Roadmap generation error:', err);
      setError(
        err.message === 'API configuration error' 
          ? 'Service is not properly configured. Please try again later.'
          : err.message === 'Service temporarily unavailable'
          ? 'Service is temporarily unavailable. Please try again in a few minutes.'
          : 'Failed to generate your roadmap. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="input-container">
      <div className="input-content">
        <div className="input-header">
          <h1>Start Your Career Journey</h1>
          <p>Let's create a personalized roadmap to help you achieve your dream role</p>
        </div>

        <form onSubmit={handleSubmit} className="input-form">
          <div className="form-group">
            <label htmlFor="dreamRole">What's your dream role?</label>
            <input
              type="text"
              id="dreamRole"
              value={formData.dreamRole}
              onChange={(e) => setFormData({ ...formData, dreamRole: e.target.value })}
              placeholder="e.g. Senior Frontend Developer, AI Engineer, Product Manager"
              required
              disabled={isGenerating}
            />
          </div>

          <div className="form-group">
            <label>Select your current skills</label>
            <div className="skills-grid">
              {commonSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  className={`skill-btn ${formData.selectedSkills.has(skill) ? 'active' : ''}`}
                  onClick={() => toggleSkill(skill)}
                  disabled={isGenerating}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
              {error.includes('try again') && (
                <button 
                  type="button" 
                  className="retry-btn"
                  onClick={() => setError(null)}
                >
                  Dismiss
                </button>
              )}
            </div>
          )}

          <button 
            type="submit" 
            className="primary-btn" 
            disabled={isGenerating || !formData.dreamRole}
          >
            {isGenerating ? (
              <>
                <div className="btn-spinner"></div>
                Generating Your Roadmap...
              </>
            ) : (
              'Create My Career Roadmap'
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 