import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllEmployers,
  approveEmployer,
} from "../services/employer_service";

const initialState = {
  employers: [],
  status: "idle",
  error: null,
};

export const fetchAllEmployersAsync = createAsyncThunk(
  "employers/fetchAllEmployers",
  async () => {
    const response = await fetchAllEmployers();
    return response;
  }
);

export const approveEmployerAsync = createAsyncThunk(
  "employers/approveEmployer",
  async (id) => {
    const response = await approveEmployer(id);
    return response;
  }
);

const employerSlice = createSlice({
  name: "employers",
  initialState,
  reducers: {
    // Bạn có thể thêm các reducer ở đây nếu cần
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllEmployersAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllEmployersAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.employers = action.payload;
      })
      .addCase(fetchAllEmployersAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(approveEmployerAsync.fulfilled, (state, action) => {
        const approvedEmployerId = action.payload.id;
        state.employers = state.employers.map((employer) =>
          employer.id === approvedEmployerId
            ? { ...employer, approved: true }
            : employer
        );
      })
      .addCase(approveEmployerAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default employerSlice.reducer;
