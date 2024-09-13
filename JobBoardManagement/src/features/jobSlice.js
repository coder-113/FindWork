import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllJobs,
  createJob,
  getJobById,
  updateJob,
  deleteJob,
} from "../services/job_service";

// Fetch all jobs
export const fetchJobs = createAsyncThunk(
  "jobs/fetchAll",
  async () => {
    try {
      const response = await getAllJobs();
      return response; // Adjust based on your response structure
    } catch (error) {
      throw new Error("Error fetching jobs: " + error.message);
    }
  }
);

// Fetch job by ID
export const fetchJobById = createAsyncThunk(
  "jobs/fetchById",
  async (jobId) => {
    try {
      const response = await getJobById(jobId);
      return response; // Adjust based on your response structure
    } catch (error) {
      throw new Error("Error fetching job by ID: " + error.message);
    }
  }
);

// Create a new job
export const addJob = createAsyncThunk(
  "jobs/add",
  async ({ companyId, categoryId, jobData }) => {
    try {
      const response = await createJob(companyId, categoryId, jobData);
      return response; // Adjust based on your response structure
    } catch (error) {
      throw new Error("Error creating job: " + error.message);
    }
  }
);
  
// Update a job by ID
export const updateJobById = createAsyncThunk(
  "jobs/update",
  async ({ jobId, jobData }) => {
    try {
      const response = await updateJob(jobId, jobData);
      return response; // Adjust based on your response structure
    } catch (error) {
      throw new Error("Error updating job: " + error.message);
    }
  }
);

// Delete a job by ID
export const deleteJobById = createAsyncThunk(
  "jobs/delete",
  async (jobId) => {
    try {
      await deleteJob(jobId);
      return jobId;
    } catch (error) {
      throw new Error("Error deleting job: " + error.message);
    }
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    list: [],
    currentJob: null,
    status: "idle",
    error: null,
  },
  reducers: {
    setCurrentJob: (state, action) => {
      state.currentJob = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload; // Ensure this matches the structure of the response data
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.currentJob = action.payload;
      })
      .addCase(addJob.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(deleteJobById.fulfilled, (state, action) => {
        state.list = state.list.filter((job) => job.id !== action.payload);
      })
      .addCase(updateJobById.fulfilled, (state, action) => {
        state.list = state.list.map((job) =>
          job.id === action.payload.id ? action.payload : job
        );
      });
  },
});

export const { setCurrentJob } = jobSlice.actions;
export default jobSlice.reducer;
