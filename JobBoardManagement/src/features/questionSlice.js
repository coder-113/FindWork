import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createQuestionAsync,
  updateQuestionAsync,
  deleteQuestionAsync,
} from "../services/questionService";

export const createQuestion = createAsyncThunk(
  "questions/createQuestion",
  async (formData) => {
    const response = await createQuestionAsync(formData.quizId, {
      questionText: formData.questionText,
      options: formData.options.split(","),
      correctAnswer: formData.correctAnswer,
    });
    return response.data;
  }
);

export const updateQuestion = createAsyncThunk(
  "questions/update",
  async ({ quizId, questionId, data }) => {
    const response = await updateQuestionAsync(quizId, questionId, data);
    return response.data;
  }
);

export const deleteQuestion = createAsyncThunk(
  "questions/delete",
  async ({ quizId, questionId }) => {
    await deleteQuestionAsync(quizId, questionId);
    return questionId;
  }
);

const initialState = {
  list: [],
  status: "idle",
  error: null,
};

const questionSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(createQuestion.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (question) => question.id !== action.payload
        );
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (question) => question.id === action.payload.id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export default questionSlice.reducer;
