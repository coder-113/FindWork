import React, { useState } from 'react';
import './cv-selection-dialog.css';

const CVSelectionDialog = ({ isOpen, onClose, cvs, onSelect }) => {
  const [selectedCvId, setSelectedCvId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSelect(parseInt(selectedCvId));
  };

  return (
    <div className="cv-selection-dialog-overlay">
      <div className="cv-selection-dialog">
        <h2 className='select-title'>* Please select a CV before choose a template</h2>
        <form onSubmit={handleSubmit}>
          <select
            value={selectedCvId}
            onChange={(e) => setSelectedCvId(e.target.value)}
            required
          >
            <option value="">Choose a CV</option>
            {cvs.map((cv) => (
              <option key={cv.cvId} value={cv.cvId}>
                {cv.cvTitle}
              </option>
            ))}
          </select>
          <div className="button-group">
            <button type="submit" className="btn-primary">Select</button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CVSelectionDialog;