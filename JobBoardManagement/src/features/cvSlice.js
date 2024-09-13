import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchCVs,
  createCV,
  deleteCV as deleteCVApi,
  disableCV,
  unDisableCV,
  updateCV,
  uploadCV,
  fetchCVById,
} from '../services/cv_service';

export const fetchCVsAsync = createAsyncThunk('templates/fetchCVs', async () => {
  const response = await fetchCVs();
  return response;
});
export const disableCVAsync = createAsyncThunk('templates/disableCV', async (id) => {
  await disableCV(id);
  return id;
});
export const unDisableCVAsync = createAsyncThunk('templates/unDisableCV', async (id) => {
  await unDisableCV(id);
  return id;
});

export const fetchCVByIdAsync = createAsyncThunk('templates/fetchCVById', async () => {
  const response = await fetchCVById();
  return response;
});
export const createCVAsync = createAsyncThunk('templates/createCV', async (formData) => {
  const response = await createCV(formData);
  return response;
});

export const updateCVAsync = createAsyncThunk(
  'templates/updateCV',
  async ({ id, formData }) => {
    const response = await updateCV(id, formData);
    return response;
  }
);

export const deleteCVAsync = createAsyncThunk('templates/deleteCV', async (id) => {
  await deleteCVApi(id);
  return id;
});

export const uploadCVAsync = createAsyncThunk(
  'templates/uploadCV',
  async ({ file, templateName }) => {
    const response = await uploadCV(file, templateName);
    return response;
  }
);


const cvSlice = createSlice({
  name: 'templates',
  initialState: {
    templates: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCVsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCVsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.templates = action.payload;
      })
      .addCase(fetchCVsAsync.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.error.message;
      })
      
    
      
      
  },
});

export const selectAllCVs = (state) => state.templates.templates;
export const selectCVById = (state, cvId) =>
  state.templates.templates.find((cv) => cv.id === cvId);

export default cvSlice.reducer;
