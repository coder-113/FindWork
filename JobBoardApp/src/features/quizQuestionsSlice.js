import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosRequest from "../configs/axiosConfig";
import { submitQuiz } from "../services/QuizService";

export const fetchQuizDetails = createAsyncThunk(
  "quizQuestions/fetchQuizDetails",
  async (quizId, thunkAPI) => {
    try {
      const quizResponse = await axiosRequest.get(`/quizzes/${quizId}`);
      const questionsResponse = await axiosRequest.get(
        `/quizzes/${quizId}/questions`
      );
      return {
        quizTitle: quizResponse.data.title,
        questions: questionsResponse.data,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const submitQuizThunk = createAsyncThunk(
  "quizQuestions/submitQuiz",
  async ({ quizId, selectedAnswers }, thunkAPI) => {
    try {
      const response = await submitQuiz(quizId, selectedAnswers);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  quizTitle: "",
  questions: [],
  selectedAnswers: {},
  currentQuestionIndex: 0,
  timeLeft: 10 * 60, // Assuming 10 minutes in seconds
  showModal: false,
  showTimeUpModal: false,
  showScoreModal: false,
  showExitConfirmModal: false,
  score: null,
  totalQuestions: 0,
  loading: false,
  error: null,
  submissionResult: null,
};

const quizQuestionsSlice = createSlice({
  name: "quizQuestions",
  initialState,
  reducers: {
    setQuizTitle(state, action) {
      state.quizTitle = action.payload;
    },
    setQuestions(state, action) {
      state.questions = action.payload;
      state.totalQuestions = action.payload.length;
    },
    setSelectedAnswers(state, action) {
      state.selectedAnswers = action.payload;
    },
    setCurrentQuestionIndex(state, action) {
      state.currentQuestionIndex = action.payload;
    },
    setTimeLeft(state, action) {
      state.timeLeft = action.payload;
    },
    setShowModal(state, action) {
      state.showModal = action.payload;
    },
    setShowTimeUpModal(state, action) {
      state.showTimeUpModal = action.payload;
    },
    setShowScoreModal(state, action) {
      state.showScoreModal = action.payload;
    },
    setShowExitConfirmModal(state, action) {
      state.showExitConfirmModal = action.payload;
    },
    setScore(state, action) {
      state.score = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setSubmissionResult(state, action) {
      state.submissionResult = action.payload;
    },
    setTimeLeft: (state, action) => {
      state.timeLeft = action.payload;
    },
    decrementTimeLeft: (state) => {
      state.timeLeft -= 1;
    },
    decrementTimeLeft(state) {
      if (state.timeLeft > 0) {
        state.timeLeft -= 1;
      }
    },
    resetQuizState(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setQuizTitle,
  setQuestions,
  setSelectedAnswers,
  setCurrentQuestionIndex,
  setTimeLeft,
  setShowModal,
  setShowTimeUpModal,
  setShowScoreModal,

  setShowExitConfirmModal,
  setScore,
  setLoading,
  setError,
  setSubmissionResult,
  decrementTimeLeft,
  resetQuizState,
} = quizQuestionsSlice.actions;

export default quizQuestionsSlice.reducer;
