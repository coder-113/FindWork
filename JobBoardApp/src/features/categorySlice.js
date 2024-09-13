import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllCategory } from "../services/CategoryService";

export const fetchCategoryThunk = createAsyncThunk(
  "/categories/fetchAll",
  async () =>
  {
    try
    {
      return await getAllCategory();
    } catch (error)
    {
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
  name: "category",
  initialState,
  extraReducers: (builder) =>
    builder
      .addCase(fetchCategoryThunk.pending, (state) =>
      {
        state.state = "Loading...";
      })
      .addCase(fetchCategoryThunk.fulfilled, (state, action) =>
      {
        // Đảm bảo rằng action.payload là mảng
        if (Array.isArray(action.payload))
        {
          state.categories = action.payload;
        } else
        {
          state.categories = [];
        }
        state.state = "Fetch ok!";
      })
      .addCase(fetchCategoryThunk.rejected, (state, action) =>
      {
        state.error = action.payload;
        state.state = "Rejected!";
      }),
});

export default categorySlice.reducer;
