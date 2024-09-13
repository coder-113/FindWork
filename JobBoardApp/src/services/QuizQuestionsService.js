import axiosRequest from "../configs/axiosConfig";

// Fetch quiz details

export const fetchQuizDetails = async (quizId, count) => {
  try {
    const quizResponse = await axiosRequest.get(`/quizzes/${quizId}`);
    const questionsResponse = await getQuizQuestions(quizId, count);
    return { quizTitle: quizResponse.data.title, questions: questionsResponse.data };
  } catch (error) {
    throw new Error(`Error fetching quiz details for quizId ${quizId}: ${error.message}`);
  }
};
  
  export const submitQuiz = async (quizId, selectedAnswers) => {
    try {
      const submission = {
        quizId: parseInt(quizId),
        questions: Object.keys(selectedAnswers).map((questionId) => ({
          questionId: parseInt(questionId),
          selectedAnswer: selectedAnswers[questionId].split('.')[0].trim(),
        })),
      };
  
      const response = await axiosRequest.post('/quizzes/submit', submission);
      return response.data;
    } catch (error) {
      throw new Error(`Error submitting quiz for quizId ${quizId}: ${error.message}`);
    }
  };