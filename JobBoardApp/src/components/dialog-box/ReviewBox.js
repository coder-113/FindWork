import React from 'react';
import './reviewbox.css';
import { FaTimes } from 'react-icons/fa';

const ReviewBox = ({ isOpen, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <div className="dialog-header">
          <h5>*Please spend a minute, pay attention to this important note</h5>
          <FaTimes className="close-icon" onClick={handleClose} />
        </div>
        <ul>
          <li>You will move to this page to review your cv after choosing a template.</li>
          <li>Please scroll down to review the cv.</li>
          <li>On the bottom is an area called "Action".</li>
          <li>You are allow to click on any action that you want.</li>
          <li>You can also click on the "Print to PDF" button to print the cv to pdf.</li>
        </ul>
      </div>
    </div>
  );
};

export default ReviewBox;
