import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createBlogCategory,
  deleteBlogCategoryAsync,
  getAllBlogCategories,
  updateBlogCategoryAsync,
} from "../services/blog_category_service";

export const fetchBlogCategory = createAsyncThunk(
  "blog-category/fetch",
  async () => {
    const response = await getAllBlogCategories();
    return response;
  }
);

export const addBlogCategory = createAsyncThunk(
  "blog-category/add",
  async (data) => {
    try {
      const response = await createBlogCategory(data);
      console.log(response);
      return response;
    } catch (error) {
      throw new Error("Error to create!");
    }
  }
);

export const deleteBlogCategory = createAsyncThunk(
  "blog-category/delete",
  async (id) => {
    try {
      await deleteBlogCategoryAsync(id);
      return id;
    } catch (error) {
      throw new Error("Error to delete");
    }
  }
);

export const updateBlogCategory = createAsyncThunk(
  "blog-category/update",
  async (data) => {
    try {
      return await updateBlogCategoryAsync(data);
    } catch (error) {
      throw new Error("Error to update");
    }
  }
);

const blogCategorySlice = createSlice({
  name: "blogCategory",
  initialState: {
    blogCategory: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBlogCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.blogCategory = action.payload;
      })
      .addCase(fetchBlogCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addBlogCategory.fulfilled, (state, action) => {
        console.log(action.payload);
        state.blogCategory.push(action.payload);
      })
      .addCase(addBlogCategory.rejected, (state, action) => {
        console.log("rejected!");
      })
      .addCase(deleteBlogCategory.fulfilled, (state, action) => {
        state.blogCategory = state.blogCategory.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(updateBlogCategory.fulfilled, (state, action) => {
        console.log(action.payload);

        state.blogCategory = state.blogCategory.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      });
  },
});

export default blogCategorySlice.reducer;
