import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createBlog,
  deleteBlog as deleteBlogApi,
  updateBlog,
  getAllBlogsByQuery,
  getAllHashtag,
  updateIsArchiveStatus,
} from "../services/blog_service";

export const getHashTags = createAsyncThunk(
  "blogs/hashtags",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllHashtag();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateIsArchiveStatusThunk = createAsyncThunk(
  "/blogs/archive",
  async ({ selectedIds, status }, { rejectWithValue }) => {
    try {
      const data = await updateIsArchiveStatus({
        selectedIds,
        status,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchBlogs = createAsyncThunk(
  "blogs/searchBlogs",
  async (
    { query, page, size, type, visibility, archive },
    { rejectWithValue }
  ) => {
    try {
      const response = await getAllBlogsByQuery(
        query,
        type,
        visibility,
        page,
        size,
        archive
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addBlog = createAsyncThunk(
  "blogs/addBlog",
  async (newBlog, { rejectWithValue }) => {
    try {
      const response = await createBlog(newBlog);
      return response;
    } catch (error) {
      if (typeof error.response.data === "string") {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "blogs/deleteBlog",
  async (id, { rejectWithValue }) => {
    try {
      await deleteBlogApi(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editBlog = createAsyncThunk(
  "blogs/updateBlog",
  async ({ newBlog, id }, { rejectWithValue }) => {
    try {
      const res = await updateBlog(newBlog, id);
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
const blogsSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: [],
    status: "idle",
    totalPages: 0,
    error: null,
    hashTags: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchBlogs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchBlogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.blogs = action.payload.content;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(searchBlogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addBlog.fulfilled, (state, action) => {
        state.blogs.push(action.payload);
      })

      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
      })
      .addCase(editBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(updateIsArchiveStatusThunk.fulfilled, (state, action) => {
        console.log(action.payload);
      })
      .addCase(getHashTags.fulfilled, (state, action) => {
        state.hashTags = action.payload;
      });
  },
});

export default blogsSlice.reducer;
