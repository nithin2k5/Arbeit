'use client';

export default function DeleteModal({ onClose, onDelete }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Delete Account</h2>
        <p>Are you sure you want to delete your account? This action cannot be undone.</p>
        <div className="modal-actions">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="delete-button" onClick={onDelete}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
} 