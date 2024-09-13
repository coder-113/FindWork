import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { useSelector } from "react-redux";
import "./Quiz.css";

export const Quiz = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [attemptsInfo, setAttemptsInfo] = useState({});
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const isAuthenticated = () => {
      return localStorage.getItem("accessToken") !== null;
    };

    if (!isAuthenticated()) {
      navigate("/login");
    } else {
      setLoggedIn(true);
      fetchCategoriesAndQuizzes();
      fetchCompletedQuizzes();
      const intervalId = setInterval(() => {
        fetchCategoriesAndQuizzes();
        fetchCompletedQuizzes();
      }, 10000); // Polling every 10 seconds

      return () => clearInterval(intervalId);
    }
  }, [navigate, user]);

  useEffect(() => {
    applyFilters();
  }, [categories, searchTerm, selectedStatus, filterCategory]);

  const fetchCategoriesAndQuizzes = () => {
    const accessToken = localStorage.getItem("accessToken");
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/categoriesquiz`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setCategories(response.data);
        response.data.forEach((category) => {
          category.quizzes.forEach((quiz) => {
            axios
              .get(
                `${process.env.REACT_APP_API_ENDPOINT}/quizzes/${quiz.id}/attempts`,
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                  params: {
                    userId: user.id,
                  },
                }
              )
              .then((response) => {
                setAttemptsInfo((prev) => ({
                  ...prev,
                  [quiz.id]: response.data,
                }));
              })
              .catch((error) => {
                console.error(
                  "There was an error fetching the attempts info!",
                  error
                );
              });
          });
        });
      })
      .catch((error) => {
        console.error("There was an error fetching the categories!", error);
      });
  };

  const fetchCompletedQuizzes = () => {
    const accessToken = localStorage.getItem("accessToken");
    axios
      .get(
        `${process.env.REACT_APP_API_ENDPOINT}/quizzes/${user.id}/completed-quizzes`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        setCompletedQuizzes(response.data);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the completed quizzes!",
          error
        );
      });
  };

  const handleStartQuiz = (quiz) => {
    const accessToken = localStorage.getItem("accessToken");
    const attemptsLeft = attemptsInfo[quiz.id]?.attemptsLeft || 0;
    const timeLeft = attemptsInfo[quiz.id]?.timeLeft || 0;

    if (attemptsLeft > 0 || timeLeft === 0) {
      setSelectedQuiz(quiz);
      setOpen(true);
    } else {
      alert(
        `You have reached the maximum number of attempts. Please wait for ${timeLeft} seconds to retake the quiz.`
      );
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedQuiz(null);
  };

  const handleConfirmStart = () => {
    const accessToken = localStorage.getItem("accessToken");
    localStorage.removeItem(`questions_${selectedQuiz.id}`);
    localStorage.removeItem(`sessionId_${selectedQuiz.id}`);
    axios
      .get(
        `${process.env.REACT_APP_API_ENDPOINT}/quizzes/${selectedQuiz.id}/questions`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            count: 10,
          },
        }
      )
      .then((response) => {
        const questions = response.data;
        localStorage.setItem(
          `questions_${selectedQuiz.id}`,
          JSON.stringify(questions)
        );
        navigate(`/quiz/${selectedQuiz.id}`);
      })
      .catch((error) => {
        console.error("There was an error fetching the questions!", error);
      });
  };

  const handleQuizCompletion = (quizId) => {
    const accessToken = localStorage.getItem("accessToken");
    axios
      .post(
        `${process.env.REACT_APP_API_ENDPOINT}/quizzes/${quizId}/complete`,
        {
          userId: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        fetchCategoriesAndQuizzes();
        fetchCompletedQuizzes();
      })
      .catch((error) => {
        console.error("There was an error completing the quiz!", error);
      });
  };

  const calculateNextAttemptDate = (seconds) => {
    const nextAttemptDate = new Date(Date.now() + seconds * 1000);
    return nextAttemptDate.toLocaleDateString("vi-VN");
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setFilterCategory(event.target.value);
  };

  const applyFilters = () => {
    let filtered = categories;

    if (filterCategory !== "all") {
      filtered = filtered.filter(
        (category) => category.name === filterCategory
      );
    }

    filtered = filtered.map((category) => {
      const filteredQuizzes = category.quizzes.filter((quiz) => {
        const matchesSearchTerm =
          searchTerm === "" ||
          quiz.title.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          selectedStatus === "all" ||
          (selectedStatus === "completed" &&
            completedQuizzes.includes(quiz.id)) ||
          (selectedStatus === "incomplete" &&
            !completedQuizzes.includes(quiz.id));

        return matchesSearchTerm && matchesStatus;
      });
      return { ...category, quizzes: filteredQuizzes };
    });

    setFilteredCategories(filtered);
  };

  if (!loggedIn) {
    return null;
  }

  return (
    <GlobalLayoutUser>
      <>
        <section
          className="section-hero overlay inner-page bg-image"
          style={{
            backgroundImage: 'url("../../../../assets/images/hero_1.jpg")',
          }}
          id="home-section"
        >
          <div className="container">
            <div className="row">
              <div className="col-md-7">
                <h1 className="text-white font-weight-bold">ITGrove Skills</h1>
                <div className="custom-breadcrumbs">
                  <a href="/">Home</a> <span className="mx-2 slash">/</span>
                  <span className="text-white">
                    <strong>Quiz</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="site-section">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h3 className="mb-4 font-weight-bold">
                  Candidate Skill Assessment System
                </h3>
                <p className="lead">
                  Assert your career skills through diverse tests from various
                  fields. The system will verify skills based on your CV, making
                  your CV stand out to employers and increasing your chances of
                  getting hired at your desired companies.
                </p>
              </div>
            </div>
            <div className="row mb-4">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter search keyword"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="col-md-4">
                <select
                  className="form-control"
                  value={selectedStatus}
                  onChange={handleStatusChange}
                >
                  <option value="all">All</option>
                  <option value="completed">Completed</option>
                  <option value="incomplete">Incomplete</option>
                </select>
              </div>
              <div className="col-md-4">
                <select
                  className="form-control"
                  value={filterCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="all">All categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row">
              {filteredCategories.map((category) => (
                <div key={category.id} className="col-md-12">
                  <h4 className="category-title">{category.name}</h4>
                  <div className="row">
                    {category.quizzes.map((quiz) => (
                      <div className="col-lg-4 mb-4" key={quiz.id}>
                        <div className="quiz-card border rounded p-4">
                          <img
                            src={quiz.imageUrl}
                            alt={quiz.title}
                            className="img-fluid mb-3"
                          />
                          <h3>{quiz.title}</h3>
                          <div className="quiz-details">
                            <div className="quiz-categories">
                              {category.name || "No Category"}
                            </div>
                            <div className="quiz-candidates">
                              {quiz.numberOfUsers || 0}+ Number of candidates
                              taking this quiz
                            </div>
                          </div>
                          {completedQuizzes.includes(quiz.id) ? (
                            <div className="quizsuccess">
                              You have completed this quiz.
                            </div>
                          ) : attemptsInfo[quiz.id]?.locked ? (
                            <div className="quizwarning">
                              You have no attempts left. Please come back on{" "}
                              {calculateNextAttemptDate(
                                attemptsInfo[quiz.id]?.timeLeft
                              )}
                              .
                            </div>
                          ) : (
                            <button
                              className="btn btn-success"
                              onClick={() => handleStartQuiz(quiz)}
                            >
                              Take Quiz
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Dialog
          open={open}
          onClose={handleClose}
          classes={{ paper: "custom-dialog" }}
        >
          <DialogTitle className="custom-dialog-title">
            Quiz Information
          </DialogTitle>
          <DialogContent className="custom-dialog-content">
            {selectedQuiz && (
              <>
                <DialogContentText>
                  <div className="quiz-info">
                    <div className="info-item">
                      <i className="fas fa-book"></i>
                      <p>Topic: {selectedQuiz.title}</p>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-question"></i>
                      <p>10 multiple-choice questions</p>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-clock"></i>
                      <p>10 minutes</p>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-users"></i>
                      <p>
                        {selectedQuiz.numberOfUsers || 0}+ Number of candidates
                        who have taken this quiz
                      </p>
                    </div>
                  </div>
                  <p className="top-info">
                    * You will receive a completion certificate if you are in
                    the top 20% of candidates
                  </p>
                  <div className="custom-dialog-description">
                    <p>Quiz Description</p>
                    <p>{selectedQuiz.description}</p>
                    <p>
                      <strong>Remaining Attempts: </strong>
                      {attemptsInfo[selectedQuiz.id]?.attemptsLeft}
                    </p>
                    {attemptsInfo[selectedQuiz.id]?.timeLeft > 0 && (
                      <p>
                        Wait Time: {attemptsInfo[selectedQuiz.id]?.timeLeft}{" "}
                        seconds
                      </p>
                    )}
                    <p style={{ color: "red" }}>
                      Warning: Do not close the website while taking the quiz,
                      or you will lose all your answers.
                    </p>
                  </div>
                </DialogContentText>
              </>
            )}
          </DialogContent>
          <DialogActions className="custom-dialog-actions">
            <Button
              onClick={handleClose}
              className="custom-dialog-button"
              color="primary"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                handleConfirmStart();
                handleQuizCompletion(selectedQuiz.id);
              }}
              className="custom-dialog-button"
              color="primary"
              autoFocus
            >
              Start Quiz
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </GlobalLayoutUser>
  );
};
