import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import { fetchQuizResultsThunk } from "../../features/quizSlice";
import "./QuizResult.css";
import successImage from "../../assets/images/Do-hoa-02.png";
import badImage from "../../assets/images/fail-1.png";

const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { results, totalQuestions, quizId, score, status, error } = location.state || {};

  useEffect(() => {
    if (location.state && location.state.quizId) {
      dispatch(fetchQuizResultsThunk(location.state.quizId));
    }
  }, [location.state, dispatch]);

  const correctAnswersCount = results
    ? results.filter((result) => result.selectedAnswer === result.correctAnswer).length
    : 0;
  const percentage = totalQuestions > 0 ? ((correctAnswersCount / totalQuestions) * 100).toFixed(2) : 0;

  const images = {
    success: successImage,
    bad: badImage,
  };

  let message;
  let image;

  if (score <= 7) {
    image = images.bad;
    message = `You have not received the system's certificate as you have not made it into the top 20% of outstanding candidates. Don't be discouraged, you still have one more chance to retake the assessment. Try to pass!`;
  } else {
    image = images.success;
    message = `Congratulations on successfully passing the assessment and making it into the top 20% of candidates! 🎉
You have met all the requirements and demonstrated your excellence.
We are pleased to inform you that you have received the system's certificate.
We wish you continued success in your career!`;
  }

  const handleGoBack = () => {
    navigate('/quiz');
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <GlobalLayoutUser>
      <>
        <section
          className="section-hero overlay inner-page bg-image"
          style={{ backgroundImage: 'url("../../../../assets/images/hero_1.jpg")' }}
          id="home-section"
        >
          <div className="container">
            <div className="row">
              <div className="col-md-7">
                <h1 className="text-white font-weight-bold">JobBoard Skills</h1>
                <div className="custom-breadcrumbs">
                  <a href="/">Home</a> <span className="mx-2 slash">/</span>
                  <span className="text-white"><strong>Quiz</strong></span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="container">
          <div className="quiz-result-container">
            <h2>Quiz Results</h2>
            <div className="result-score">
              <img src={image} alt="result" className="result-image" />
              <p className="result-message">{message.split('\n').map((line, index) => (
                <React.Fragment key={index}>{line}<br /></React.Fragment>
              ))}</p>
            </div>
            <div className="result-actions">
              <button className="btn btn-secondary" onClick={handleGoBack}>Back to skill list</button>
            </div>
          </div>
        </div>
      </>
    </GlobalLayoutUser>
  );
};

export default QuizResult;
