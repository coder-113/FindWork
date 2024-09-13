import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  findBlogById,
  getAllBlog,
  getAllBlogFilter,
  getAllHashTags,
  getBlogPopular,
} from "../services/BlogService";
import { getAllBlogCategories } from "../services/BlogCategoryService";

export const fetchBlogById = createAsyncThunk(
  "blogs/getOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await findBlogById(id);
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllCategories = createAsyncThunk(
  "blog-category",
  async () => {
    try {
      const res = await getAllBlogCategories();
      return res;
    } catch (error) {
      return error;
    }
  }
);

export const fetchAllBlog = createAsyncThunk(
  "blogs/getALL",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllBlog();
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchBlogPopular = createAsyncThunk(
  "blogs/getPopular",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getBlogPopular();
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async ({ query, page, size, type, order }, { rejectWithValue }) => {
    try {
      const response = await getAllBlogFilter(query, type, page, size, order);
      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);
export const fetchHashtags = createAsyncThunk(
  "hashtags/fetchHashtags",
  async () => {
    const data = await getAllHashTags();
    return data;
  }
);
const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blog: null,
    blogs: [],
    blogsFilter: [],
    status: "idle",
    error: null,
    categories: [],
    author: null,
    lastUpdated: null,
    totalPages: 0,
    hashtags: [],
    popular: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.blog = action.payload;
        state.author = action.payload.user;
        state.lastUpdated = Date.now(); // Cập nhật lastUpdated khi fetch thành công
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchAllBlog.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllBlog.fulfilled, (state, action) => {
        state.blogs = action.payload;
        state.status = "succeeded";

        state.lastUpdated = Date.now(); // Cập nhật lastUpdated khi fetch thành công
      })
      .addCase(fetchAllBlog.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchBlogPopular.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBlogPopular.fulfilled, (state, action) => {
        state.popular = action.payload;
        state.status = "succeeded";
        state.lastUpdated = Date.now(); // Cập nhật lastUpdated khi fetch thành công
      })
      .addCase(fetchBlogPopular.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchAllCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.categories = action.payload.slice(0, 3);
        state.lastUpdated = Date.now(); // Cập nhật lastUpdated khi fetch thành công
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchBlogs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(">>>filter: ", action.payload);
        state.blogsFilter = action.payload.content;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchHashtags.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHashtags.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.hashtags = action.payload;
      })
      .addCase(fetchHashtags.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {
  addBlogBySocket,
  updateBlogBySocket,
  deleteBlogBySocket,
  updateLastUpdated,
} = blogSlice.actions;

export default blogSlice.reducer;
