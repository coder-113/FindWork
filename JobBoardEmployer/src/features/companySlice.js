import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllCompany } from "../services/CompanyService";

// Thunk for fetching all jobs
export const fetchCompanyThunk = createAsyncThunk(
    "companies/fetchAll",
    async (_, { rejectWithValue }) =>
    {
        try
        {
            const companies = await getAllCompany();
            return companies;
        } catch (error)
        {
            return rejectWithValue(error.message);
        }
    }
);

// Initial state for the job slice
const initialState = {
    companies: [],
    status: "idle",  // Changed from `state` to `status` for clarity
    error: null,
};

// Creating the job slice
const companySlice = createSlice({
    name: "company",
    initialState,
    reducers: {},
    extraReducers: (builder) =>
    {
        builder
            .addCase(fetchCompanyThunk.pending, (state) =>
            {
                state.status = "loading";  // Updated to reflect loading state
                state.error = null;
            })
            .addCase(fetchCompanyThunk.fulfilled, (state, action) =>
            {
                state.companies = action.payload;
                state.status = "succeeded";  // Updated to reflect success state
                console.log(state.companies);
            })
            .addCase(fetchCompanyThunk.rejected, (state, action) =>
            {
                // @ts-ignore
                state.error = action.payload;
                state.status = "failed";  // Updated to reflect error state
            });
    },
});

export default companySlice.reducer;