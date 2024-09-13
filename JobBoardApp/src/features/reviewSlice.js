import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllReviews, addReview, getReview, updateReview, hasReviewedCompany } from "../services/ReviewService";

// Thunks for review operations
export const fetchReviewsThunk = createAsyncThunk(
    "reviews/fetchAll",
    async (companyId, { rejectWithValue }) =>
    {
        try
        {
            const reviews = await getAllReviews(companyId);
            return reviews;
        } catch (error)
        {
            return rejectWithValue(error.message);
        }
    }
);

export const createReviewThunk = createAsyncThunk(
    "reviews/add",
    async ({ companyId, review }, { rejectWithValue }) =>
    {
        try
        {
            const data = await addReview(companyId, review);
            return data;
        } catch (error)
        {
            return rejectWithValue(error.message);
        }
    }
);

// export const fetchReviewThunk = createAsyncThunk(
//     "reviews/fetchOne",
//     async ({ companyId, reviewId }, { rejectWithValue }) =>
//     {
//         try
//         {
//             const data = await getReview(companyId, reviewId);
//             return data;
//         } catch (error)
//         {
//             return rejectWithValue(error.message);
//         }
//     }
// );

// export const updateReviewThunk = createAsyncThunk(
//     "reviews/update",
//     async ({ companyId, reviewId, review }, { rejectWithValue }) =>
//     {
//         try
//         {
//             const response = await updateReview(companyId, reviewId, review);
//             return response;
//         } catch (error)
//         {
//             return rejectWithValue(error.message);
//         }
//     }
// );

export const checkUserReviewThunk = createAsyncThunk(
    "reviews/check",
    async (companyId, { rejectWithValue }) =>
    {
        try
        {
            const reviewed = await hasReviewedCompany(companyId);
            return reviewed;
        } catch (error)
        {
            return rejectWithValue(error.message);
        }
    }
);

// Initial state for the review slice
const initialState = {
    reviews: [],
    review: null,
    hasReviewed: false,
    status: "idle",
    error: null,
};

// Creating the review slice
const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {},
    extraReducers: (builder) =>
    {
        builder
            .addCase(fetchReviewsThunk.pending, (state) =>
            {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchReviewsThunk.fulfilled, (state, action) =>
            {
                state.reviews = action.payload;
                state.status = "succeeded";
            })
            .addCase(fetchReviewsThunk.rejected, (state, action) =>
            {
                state.error = action.payload;
                state.status = "failed";
            })
            .addCase(createReviewThunk.fulfilled, (state, action) =>
            {
                state.reviews.push(action.payload);
            })
            .addCase(checkUserReviewThunk.fulfilled, (state, action) =>
            {
                state.hasReviewed = action.payload;
            });
    },
});

export default reviewSlice.reducer;
