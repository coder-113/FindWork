import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllCategory } from "../services/CategoryService";

export const fetchCategoryThunk = createAsyncThunk(
  "/categories/fetchAll",
  async () => {
    try {
      return await getAllCategory();
    } catch (error) {
      return error.message;
    }
  }
);

const initialState = {
  categories: [],
  state: "idle",
  error: null,
};

const categorySlice = createSlice({
  initialState,
  name: "category",
  extraReducers: (builder) =>
    builder
      .addCase(fetchCategoryThunk.pending, (state, action) => {
        state.state = "Loading...";
      })
      .addCase(fetchCategoryThunk.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.state = "Fetch ok!";
      })
      .addCase(fetchCategoryThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.state = "Rejected!";
      }),
});

export default categorySlice.reducer;
