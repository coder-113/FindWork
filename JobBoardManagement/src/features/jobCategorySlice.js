import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllBlogCategories,
  updateBlogCategoryAsync,
} from "../services/blog_category_service";
import {
  createCategoryAsync,
  deleteCategoryAsync,
  getAllCategoryAsync,
  updateCategoryAsync,
} from "../services/job_category_service";

export const fetchJobCategory = createAsyncThunk(
  "job-category/fetch",
  async () => {
    const response = await getAllCategoryAsync();
    console.log("Fetched categories:", response);
    return response;
  }
);

export const addJobCategory = createAsyncThunk(
  "job-category/add",
  async (data) => {
    try {
      const response = await createCategoryAsync(data);
      console.log(response);
      return response;
    } catch (error) {
      throw new Error("Error to create!");
    }
  }
);

export const deleteJobCategory = createAsyncThunk(
  "job-category/delete",
  async (id) => {
    try {
      await deleteCategoryAsync(id);
      return id;
    } catch (error) {
      console.log(error);
      throw new Error("Error to delete");
    }
  }
);

export const updateJobCategory = createAsyncThunk(
  "job-category/update",
  async ({ data, categoryId }) => {
    try {
      console.log(data, categoryId);
      return await updateCategoryAsync(data, categoryId);
    } catch (error) {
      console.log(error);
      throw new Error("Error to update");
    }
  }
);

const jobCategorySlice = createSlice({
  name: "jobCategory",
  initialState: {
    list: [],
    status: "idle",
    error: null,
    isEdit: null,
  },
  reducers: {
    setIsEdit: (state, action) => {
      state.isEdit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchJobCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchJobCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addJobCategory.fulfilled, (state, action) => {
        console.log(action.payload);
        state.list.push(action.payload);
      })
      .addCase(addJobCategory.rejected, (state, action) => {
        console.log("rejected!");
      })
      .addCase(deleteJobCategory.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (item) => item.categoryId !== action.payload
        );
      })
      .addCase(updateJobCategory.fulfilled, (state, action) => {
        console.log(action.payload);

        state.list = state.list.map((item) =>
          item.categoryId === action.payload.categoryId ? action.payload : item
        );
      });
  },
});

export const { setIsEdit } = jobCategorySlice.actions;
export default jobCategorySlice.reducer;
