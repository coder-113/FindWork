import React, { useState } from 'react';
import axiosRequest from '../../configs/axiosConfig';
import './applybox.css';

const ApplyBox = ({ jobId, company, userId,  }) => {
  const [name, setName] = useState('');
  const [cv, setCV] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    let formErrors = {};

    if (!name.trim()) {
      formErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      formErrors.name = 'Name must be at least 2 characters long';
    }

    if (!cv) {
      formErrors.cv = 'CV is required';
    } else if (cv.type !== 'application/pdf') {
      formErrors.cv = 'Only PDF files are allowed';
    } else if (cv.size > 3 * 1024 * 1024) {
      formErrors.cv = 'File size must be less than 3MB';
    }

    if (coverLetter.trim().length > 1000) {
      formErrors.coverLetter = 'Cover letter must be less than 1000 characters';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('employeeName', name);
      formData.append('cvFile', cv);
      formData.append('coverLetter', coverLetter);

      try {
        const response = await axiosRequest.post(`/application/${jobId}/${company.companyId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      
        if (response === "Application submitted successfully and notification email sent.") {
          setSuccessMessage('Application submitted successfully and you will recieve notification email from us!');
          
           
          setTimeout(() => {
            window.location.reload();  
          }, 5000);  
        }
      } catch (error) {
        console.error('Error submitting application:', error);
      }
      
      
    }
  };

  return (
    <div className="apply-box-overlay">
      <div className="apply-box">
        <h2>Apply for <i className='text-primary'>{company.title}</i></h2>
        {successMessage ? (
          <div className="alert alert-success mt-3" role="alert">
          <h3>{successMessage}</h3>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <small className="error text-danger">{errors.name}</small>}
            </div>

            <div className="form-group">
              <label htmlFor="cv">CV / Resume * (PDF only)</label>
              <input
                type="file"
                id="cv"
                onChange={(e) => setCV(e.target.files[0])}
                accept=".pdf"
              />
              {errors.cv && <small className="error text-danger">{errors.cv}</small>}
              <small className='text-danger'>Only PDF files are allowed. File size under 3MB.</small>
            </div>

            <div className="form-group">
              <label htmlFor="coverLetter">Cover Letter (Optional)</label>
              <textarea
                id="coverLetter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="What skills, projects, or achievements demonstrate that you're a strong candidate for this position?"
              />
              {errors.coverLetter && <p className="error text-danger">{errors.coverLetter}</p>}
            </div>

            <button type="submit" className="submit-button">Submit My Application</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplyBox;
