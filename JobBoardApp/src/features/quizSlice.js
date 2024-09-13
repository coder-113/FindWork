import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getQuizDetails, getQuizzes, getQuizQuestions, submitQuiz } from '../services/QuizService';
import axiosRequest from '../configs/axiosConfig';

// Async Thunks
export const fetchQuizDetailsThunk = createAsyncThunk(
  'quiz/fetchQuizDetails',
  async (quizId, thunkAPI) => {
    try {
      const response = await getQuizDetails(quizId);
      return response; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchQuizzesThunk = createAsyncThunk(
  'quizzes/fetchQuizzes',
  async (_, thunkAPI) => {
    try {
      const response = await getQuizzes();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchQuizQuestionsThunk = createAsyncThunk(
  'quiz/fetchQuizQuestions',
  async (quizId, thunkAPI) => {
    try {
      const response = await getQuizQuestions(quizId);
      return response; // Assuming response is an array of questions
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const submitQuizThunk = createAsyncThunk(
  'quiz/submitQuiz',
  async (submission, thunkAPI) => {
    try {
      const response = await submitQuiz(submission);
      return response; // Return the response from the API
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchQuizResultsThunk = createAsyncThunk(
  "quiz/fetchQuizResults",
  async (quizId, thunkAPI) => {
    try {
      console.log("Fetching quiz results for quizId:", quizId);  // Add this line
      const response = await axiosRequest.get(`/quizzes/results/${quizId}`);
      console.log("Received response:", response);  // Add this line
      return response.data;  // Ensure this line returns data property
    } catch (error) {
      console.error("Error fetching quiz results:", error);  // Add this line
      return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Initial State
const initialState = {
  quizTitle: '',
  questions: [],
  selectedAnswers: {},
  currentQuestionIndex: 0,
  timeLeft: 10 * 60,
  showModal: false,
  showTimeUpModal: false,
  showScoreModal: false,
  showExitConfirmModal: false,
  score: null,
  totalQuestions: 0,
  quizzes: [],
  results: [],
  quizId: null,
  status: 'idle',
  error: null,
  completedQuizzes: [],
};

// Redux Slice
const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setQuizResults(state, action) {
      const { results, totalQuestions, quizId, certificateUrl } = action.payload;
      state.results = results;
      state.totalQuestions = totalQuestions;
      state.quizId = quizId;
      state.certificateUrl = certificateUrl;
    },
    clearQuizResults(state) {
      state.results = [];
      state.totalQuestions = 0;
      state.quizId = null;
      state.certificateUrl = null;
    },
    completeQuiz: (state, action) => {
      state.completedQuizzes.push(action.payload);
    },

    // Add your reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizDetailsThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuizDetailsThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quizTitle = action.payload.title; // Assuming action.payload has title
      })
      .addCase(fetchQuizDetailsThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchQuizzesThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuizzesThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quizzes = action.payload; // Assuming action.payload is an array of quizzes
      })
      .addCase(fetchQuizzesThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchQuizQuestionsThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuizQuestionsThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.questions = action.payload; // Assuming action.payload is an array of questions
        state.totalQuestions = action.payload.length;
      })
      .addCase(fetchQuizQuestionsThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(submitQuizThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitQuizThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.results = action.payload.results; // Assuming action.payload is an object with results array and score
        state.score = action.payload.score;
      })
      .addCase(submitQuizThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchQuizResultsThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuizResultsThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.results = action.payload.results; // Assuming action.payload is an object with results array and score
        state.score = action.payload.score;
        state.quizId = action.payload.quizId;
      })
      .addCase(fetchQuizResultsThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});
export const { completeQuiz } = quizSlice.actions;

export const { setQuizResults, clearQuizResults } = quizSlice.actions;

export default quizSlice.reducer;
