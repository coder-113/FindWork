import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllCategoriesQuiz,
  createCategoryQuiz,
  deleteCategoryQuizAsync,
  updateCategoryQuizAsync,
} from "../services/quiz_category_service";

export const fetchCategoryQuiz = createAsyncThunk(
  "categoryQuiz/fetch",
  async () => {
    const response = await getAllCategoriesQuiz();
    return response;
  }
);

export const addCategoryQuiz = createAsyncThunk(
    "categoryQuiz/add",
    async (formData) => {
      const { name } = formData;
      const data = await createCategoryQuiz(name);
  
      return data;
    }
  );

export const deleteCategoryQuiz = createAsyncThunk(
  "categoryQuiz/delete",
  async (id) => {
    try {
      await deleteCategoryQuizAsync(id);
      return id;
    } catch (error) {
      throw new Error("Error to delete");
    }
  }
);

export const updateCategoryQuiz = createAsyncThunk(
  "categoryQuiz/update",
  async (data) => {
    try {
      return await updateCategoryQuizAsync(data);
    } catch (error) {
      throw new Error("Error to update");
    }
  }
);

const categoryQuizSlice = createSlice({
  name: "categoryQuiz",
  initialState: {
    categoryQuiz: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryQuiz.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategoryQuiz.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categoryQuiz = action.payload;
      })
      .addCase(fetchCategoryQuiz.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addCategoryQuiz.fulfilled, (state, action) => {
        state.categoryQuiz.push(action.payload);
      })
      .addCase(addCategoryQuiz.rejected, (state, action) => {
        console.log("rejected!");
      })
      .addCase(deleteCategoryQuiz.fulfilled, (state, action) => {
        state.categoryQuiz = state.categoryQuiz.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(updateCategoryQuiz.fulfilled, (state, action) => {
        state.categoryQuiz = state.categoryQuiz.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      });
  },
});

export default categoryQuizSlice.reducer;