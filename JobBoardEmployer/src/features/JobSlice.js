import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { findAllJob, postJob, jobbyid, deleteJob as deleteJobService, searchJobs, updateJob } from "../services/JobService"; // Import các service cần thiết

// Thunk để lấy thông tin job theo id
export const fetchJobById = createAsyncThunk(
  "jobs/getOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await findAllJob(id);
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk để lấy thông tin job theo id
export const updateJobById = createAsyncThunk(
  "jobs/update",
  async ({ jobId, data }, { rejectWithValue }) => {
    try {
      const res = await updateJob(jobId, data);
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk để thêm job
export const addJob = createAsyncThunk(
  'job/create',
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const response = await postJob(userId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk để xóa job
export const deleteJob = createAsyncThunk(
  'jobs/delete',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await deleteJobService(jobId); // Call deleteJobService with jobId
      return jobId; // Return jobId to know which job was deleted
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk để lấy thông tin chi tiết job theo jobId
export const getJobById = createAsyncThunk(
  "jobs/getJobById",
  async (jobId, { rejectWithValue }) => {
    try {
      const res = await jobbyid(jobId);
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk để search job
export const searchJobsByQuery = createAsyncThunk(
  'jobs/search',
  async ({ userId, searchText }, { rejectWithValue }) => {
    try {
      const response = await searchJobs(userId, searchText);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    job: null,
    jobs: [],
    status: "idle",
    error: null,
    lastUpdated: null,
  },
  reducers: {
    addJobBySocket: (state, action) => {
      state.jobs.push(action.payload);
    },
    updateJobBySocket: (state, action) => {
      state.jobs = state.jobs.map((job) =>
        job.id === action.payload.id ? action.payload : job
      );
    },
    deleteJobBySocket: (state, action) => {
      state.jobs = state.jobs.filter((job) => job.id !== action.payload);
    },
    updateLastUpdated: (state, action) => {
      state.lastUpdated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.job = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addJob.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addJob.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.jobs.push(action.payload);
      })
      .addCase(addJob.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteJob.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.jobs = state.jobs.filter(job => job.id !== action.payload);
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getJobById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getJobById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.job = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(getJobById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(searchJobsByQuery.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchJobsByQuery.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.jobs = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(searchJobsByQuery.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  addJobBySocket,
  updateJobBySocket,
  deleteJobBySocket,
  updateLastUpdated,
} = jobSlice.actions;

export default jobSlice.reducer;
