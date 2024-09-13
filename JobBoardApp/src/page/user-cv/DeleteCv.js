import React, { useState } from 'react';
import './css/delete.css'
import axiosRequest from "../../configs/axiosConfig";

function DeleteCv({ cvId, onDelete, onCancel,cv }) {
  const [deleteQuestion, setDeleteQuestion] = useState(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [notification, setNotification] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  
  const generateRandomQuestion = () => {
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;

    let question, answer;

    switch (operation) {
      case '+':
        question = `What is ${num1} + ${num2}?`;
        answer = (num1 + num2).toString();
        break;
      case '-':
        question = `What is ${num1} - ${num2}?`;
        answer = (num1 - num2).toString();
        break;
      case '*':
        question = `What is ${num1} * ${num2}?`;
        answer = (num1 * num2).toString();
        break;
    }

    return { question, answer };
  };

  const handleDeleteClick = () => {
    const randomQ = generateRandomQuestion();
    setDeleteQuestion(randomQ);
    setShowQuestionForm(true);
    setWrongAttempts(0);
  };

  const handleAnswerSubmit = (userAnswer) => {
    if (userAnswer === deleteQuestion.answer) {
      confirmDelete();
    } else {
      const newWrongAttempts = wrongAttempts + 1;
      setWrongAttempts(newWrongAttempts);

      if (newWrongAttempts >= 3) {
        setNotification({ type: 'error', message: 'Too many incorrect attempts. Delete operation cancelled.' });
        setDeleteQuestion(null);
        setShowQuestionForm(false);
        setWrongAttempts(0);
      } else {
        setNotification({ type: 'error', message: `Incorrect answer. Try again. (Attempt ${newWrongAttempts}/3)` });
        setDeleteQuestion(generateRandomQuestion());
      }
    }
  }; 

  const confirmDelete = async () => {
    try {
      await axiosRequest.delete(`/usercv/delete-cv/${cvId}`);
      setNotification({ type: 'success', message: 'CV deleted successfully!' });
      setTimeout(() => {
        onDelete('CV deleted successfully!');
      }, 3000); // Increased to 3 seconds
    } catch (error) {
      console.error('Error deleting CV:', error);
      setNotification({ type: 'error', message: 'Failed to delete CV. Please try again.' });
    }
    setDeleteQuestion(null);
    setShowQuestionForm(false);
  };
  
  
  return (
    <div className="delete-confirmation">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      {!notification || notification.type !== 'success' ? (
        <>
          <h2><i className="fas fa-exclamation-triangle mr-2"></i> Delete Confirmation</h2>
          {!showQuestionForm ? (
            <>
              <p>Are you sure you want to delete <i className='text-danger'>{cv.cvTitle}</i> CV?</p>
              <button className="confirm-btn" onClick={handleDeleteClick}>Confirm Delete</button>
              <button className="cancel-btn" onClick={onCancel}>Cancel</button>
            </>
          ) : (
            <div className="question-form">
              <p className="text-danger">*Answer the following question to confirm delete:</p>
              <p>{deleteQuestion.question}</p>
              <input type="number" id="deleteAnswer" placeholder="Your answer" />
              <button className="confirm-btn" onClick={() => handleAnswerSubmit(document.getElementById('deleteAnswer').value)}>
                Submit Answer
              </button>
              <button className="cancel-btn" onClick={onCancel}>Cancel</button>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
          }  

export default DeleteCv;
