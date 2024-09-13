import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createContact } from "../services/contact_service";

export const postContactThunk = createAsyncThunk(
  "/contacts/post",
  async (contactData, thunkAPI) => {
    try {
      return await createContact(contactData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  contact: {},
  state: "idle",
  error: null,
};

const contactsSlice = createSlice({
  initialState,
  name: "contacts",
  extraReducers: (builder) =>
    builder
      .addCase(postContactThunk.pending, (state, action) => {
        state.state = "Loading...";
      })
      .addCase(postContactThunk.fulfilled, (state, action) => {
        state.contact = action.payload;
        state.state = "Post ok!";
      })
      .addCase(postContactThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.state = "Rejected!";
      }),
});

export default contactsSlice.reducer;
