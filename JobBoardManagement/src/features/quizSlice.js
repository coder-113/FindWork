// quizSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchQuizzes,
  createQuiz,
  deleteQuiz,
  updateQuiz,
} from "../services/quiz_service";
import {
  createQuestionAsync,
  updateQuestionAsync,
  deleteQuestionAsync,
} from "../services/questionService";

const initialState = {
  quizzes: [],
  status: "idle",
  error: null,
};

export const fetchQuizzesAsync = createAsyncThunk(
  "quizzes/fetchQuizzes",
  async () => {
    const response = await fetchQuizzes();
    return response;
  }
);

export const createNewQuiz = createAsyncThunk(
  "quizzes/createQuiz",
  async (formData) => {
    const { title, description, imageFile,categoryId } = formData;
    const data = await createQuiz(title, description, imageFile,categoryId);

    return data;
  }
);

export const removeQuiz = createAsyncThunk(
  "quizzes/deleteQuiz",
  async (quizId) => {
    await deleteQuiz(quizId);
    return quizId;
  }
);

export const modifyQuiz = createAsyncThunk(
  "quizzes/updateQuiz",
  async ({ id, data, imageFile }) => {
    const response = await updateQuiz(id, data, imageFile);
    return response.data;
  }
);

export const deleteQuestion = createAsyncThunk(
  "quizzes/deleteQuestion",
  async ({ quizId, questionId }) => {
    await deleteQuestionAsync(quizId, questionId);
    return { quizId, questionId };
  }
);

const quizSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    createQuestion(state, action) {
      const { quizId, ...newQuestion } = action.payload;
      const quizIndex = state.quizzes.findIndex((quiz) => quiz.id === quizId);
      if (quizIndex !== -1) {
        state.quizzes[quizIndex].questions.push(newQuestion);
      }
    },
    updateQuestion(state, action) {
      const { quizId, questionId, ...updatedData } = action.payload;
      const quizIndex = state.quizzes.findIndex((quiz) => quiz.id === quizId);
      if (quizIndex !== -1) {
        const questionIndex = state.quizzes[quizIndex].questions.findIndex(
          (q) => q.id === questionId
        );
        if (questionIndex !== -1) {
          state.quizzes[quizIndex].questions[questionIndex] = {
            ...state.quizzes[quizIndex].questions[questionIndex],
            ...updatedData,
          };
        }
      }
    },
    removeQuestion(state, action) {
      const { quizId, questionId } = action.payload;
      const quizIndex = state.quizzes.findIndex((quiz) => quiz.id === quizId);
      if (quizIndex !== -1) {
        state.quizzes[quizIndex].questions = state.quizzes[
          quizIndex
        ].questions.filter((q) => q.id !== questionId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchQuizzesAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizzesAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createNewQuiz.fulfilled, (state, action) => {
        state.quizzes.push(action.payload);
      })
      .addCase(createNewQuiz.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(removeQuiz.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.filter(
          (quiz) => quiz.id !== action.payload
        );
      })
      .addCase(removeQuiz.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(modifyQuiz.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.map((quiz) =>
          quiz.id === action.payload.id ? action.payload : quiz
        );
      })
      .addCase(modifyQuiz.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        const { quizId, questionId } = action.payload;
        const quizIndex = state.quizzes.findIndex((quiz) => quiz.id === quizId);
        if (quizIndex !== -1) {
          state.quizzes[quizIndex].questions = state.quizzes[
            quizIndex
          ].questions.filter((q) => q.id !== questionId);
        }
      })
      .addMatcher(
        (action) =>
          action.type.endsWith("/pending") || action.type.endsWith("/rejected"),
        (state) => {
          state.status = "loading";
        }
      );
  },
});

export const { createQuestion, updateQuestion, removeQuestion } =
  quizSlice.actions;

export default quizSlice.reducer;
