import React from 'react';
import { useNavigate } from 'react-router-dom';
import './dialog.css'; 
const DialogBox = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/signup');
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h3>Sign Up Required</h3>
        <p>You need to sign up or log in to select a template.</p>
        <div className="dialog-buttons">
          <button onClick={handleSignUp}>Sign Up</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DialogBox;
