import axiosRequest from "../configs/axiosConfig";

export const getQuizzes = () => {
  return axiosRequest.get('/quizzes');
};

export const getQuizDetails = (quizId) => {
  return axiosRequest.get(`/quizzes/${quizId}`);
};
export const getQuizQuestions = (quizId, count = 10) => {
  return axiosRequest.get(`/quizzes/${quizId}/questions`, {
    params: { count }
  });
};

export const submitQuiz = async (submission) => {
  try {
    const response = await axiosRequest.post('/quizzes/submit', submission);
    return response.data; // Assuming server returns an array of results
  } catch (error) {
    throw error; // Propagate the error back to the caller
  }
};
