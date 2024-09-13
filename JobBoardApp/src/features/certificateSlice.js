import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCertificatesByUserId, createCertificate, updateCertificate, deleteCertificate,getCertificateAsync } from "../services/certificateService";

// Thunk for fetching certificates by user ID
export const fetchCertificatesByUserIdThunk = createAsyncThunk(
    "certificates/fetchByUserId",
    async (userId, { rejectWithValue }) => {
        try {
            const certificates = await getCertificatesByUserId(userId);
            return certificates;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk for creating a new certificate
export const createCertificateThunk = createAsyncThunk(
    "certificates/create",
    async (certificateDTO, { rejectWithValue }) => {
        try {
            const newCertificate = await createCertificate(certificateDTO);
            return newCertificate;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk for updating an existing certificate
export const updateCertificateThunk = createAsyncThunk(
    "certificates/update",
    async ({ id, certificateDTO }, { rejectWithValue }) => {
        try {
            const updatedCertificate = await updateCertificate(id, certificateDTO);
            return updatedCertificate;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk for deleting a certificate
export const deleteCertificateThunk = createAsyncThunk(
    "certificates/delete",
    async (id, { rejectWithValue }) => {
        try {
            await deleteCertificate(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchCertificateThunk = createAsyncThunk(
    "certificates/fetchCertificate",
    async (filename, { rejectWithValue }) => {
      try {
        const response = await getCertificateAsync(filename);
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        return url;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

const initialState = {
    certificates: [],
    certificate: null,  // Add certificate to initial state
    status: "idle",
    error: null,
};

const certificateSlice = createSlice({
    name: "certificates",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCertificatesByUserIdThunk.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchCertificatesByUserIdThunk.fulfilled, (state, action) => {
                state.certificates = action.payload;
                state.status = "succeeded";
            })
            .addCase(fetchCertificatesByUserIdThunk.rejected, (state, action) => {
                state.error = action.payload;
                state.status = "failed";
            })
            .addCase(createCertificateThunk.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(createCertificateThunk.fulfilled, (state, action) => {
                state.certificates.push(action.payload);
                state.status = "succeeded";
            })
            .addCase(createCertificateThunk.rejected, (state, action) => {
                state.error = action.payload;
                state.status = "failed";
            })
            .addCase(updateCertificateThunk.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(updateCertificateThunk.fulfilled, (state, action) => {
                const index = state.certificates.findIndex(cert => cert.id === action.payload.id);
                if (index >= 0) {
                    state.certificates[index] = action.payload;
                }
                state.status = "succeeded";
            })
            .addCase(updateCertificateThunk.rejected, (state, action) => {
                state.error = action.payload;
                state.status = "failed";
            })
            .addCase(deleteCertificateThunk.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(deleteCertificateThunk.fulfilled, (state, action) => {
                state.certificates = state.certificates.filter(cert => cert.id !== action.payload);
                state.status = "succeeded";
            })
            .addCase(deleteCertificateThunk.rejected, (state, action) => {
                state.error = action.payload;
                state.status = "failed";
            })
            .addCase(fetchCertificateThunk.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchCertificateThunk.fulfilled, (state, action) => {
                state.certificate = action.payload;
                state.status = "succeeded";
            })
            .addCase(fetchCertificateThunk.rejected, (state, action) => {
                state.error = action.payload;
                state.status = "failed";
            });
    },
});

export default certificateSlice.reducer;
