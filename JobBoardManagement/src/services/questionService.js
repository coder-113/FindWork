// // src/services/questionService.js
import axiosRequest from "../configs/axiosConfig";

const URL = "/quizzes";

// // export const getAllQuestionsByQuizIdAsync = async (quizId) =>
// //   await axiosRequest.get(`${URL}/${quizId}/questions`);

export const createQuestionAsync = async (quizId, data) =>
  await axiosRequest.post(`${URL}/${quizId}/questions`, data);

export const updateQuestionAsync = async (quizId, questionId, data) =>
  await axiosRequest.put(`${URL}/${quizId}/questions/${questionId}`, data);

export const deleteQuestionAsync = async (quizId, questionId) =>
  await axiosRequest.delete(`${URL}/${quizId}/questions/${questionId}`);
  