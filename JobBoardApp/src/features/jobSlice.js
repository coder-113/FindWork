import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllJob } from "../services/JobService";

// Thunk for fetching all jobs
export const fetchJobThunk = createAsyncThunk(
    "jobs/fetchAll",
    async (_, { rejectWithValue }) =>
    {
        try
        {
            const jobs = await getAllJob();
            return jobs;
        } catch (error)
        {
            return rejectWithValue(error.message);
        }
    }
);

// Initial state for the job slice
const initialState = {
    jobs: [],
    status: "idle",  // Changed from `state` to `status` for clarity
    error: null,
};

// Creating the job slice
const jobSlice = createSlice({
    name: "job",
    initialState,
    reducers: {},
    extraReducers: (builder) =>
    {
        builder
            .addCase(fetchJobThunk.pending, (state) =>
            {
                state.status = "loading";  // Updated to reflect loading state
                state.error = null;
            })
            .addCase(fetchJobThunk.fulfilled, (state, action) =>
            {
                state.jobs = action.payload;
                state.status = "succeeded";  // Updated to reflect success state
                console.log(state.jobs);
            })
            .addCase(fetchJobThunk.rejected, (state, action) =>
            {
                // @ts-ignore
                state.error = action.payload;
                state.status = "failed";  // Updated to reflect error state
            });
    },
});

export default jobSlice.reducer;
