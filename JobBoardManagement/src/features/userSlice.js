import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createModeratorAsync,
  deleteUserAsync,
  getAllPermission,
  getAllUserAsync,
  updatePermissionModerator,
  updateUserEnableStatusAsync,
} from "../services/user_service";
export const getUserThunk = createAsyncThunk(
  "user/getUser",
  async ({ query, role, page, size }, { rejectWithValue }) => {
    try {
      return await getAllUserAsync(query, role, page, size);
    } catch (error) {
      const status = error.response.status;
      if (status === 400) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUserThunk = createAsyncThunk(
  "user/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await deleteUserAsync(id);
      return id;
    } catch (error) {
      console.log("error: ", error.response.data);

      return rejectWithValue(error.message);
    }
  }
);

export const updateUserStatusThunk = createAsyncThunk(
  "user/update",
  async ({ userId, isEnabled }, { rejectWithValue }) => {
    try {
      console.log(">>> isEnabled: ", isEnabled);
      const res = await updateUserEnableStatusAsync(userId, isEnabled);
      return res;
    } catch (error) {
      console.log("error: ", error);
      return rejectWithValue(error.message);
    }
  }
);

export const createModeratorThunk = createAsyncThunk(
  "user/add-moderator",
  async (data, { rejectWithValue }) => {
    try {
      const res = await createModeratorAsync(data);
      return res;
    } catch (error) {
      console.log("error: ", error);
      return rejectWithValue(error.message);
    }
  }
);

export const updatePermissionsThunk = createAsyncThunk(
  "user/updatePermissions",
  async ({ userId, permissions }, { rejectWithValue }) => {
    try {
      const res = await updatePermissionModerator({ userId, permissions });
      return res;
    } catch (error) {
      console.log("error: ", error);
      return rejectWithValue(error.message);
    }
  }
);

export const getAllPermissionThunk = createAsyncThunk(
  "/user/permissions",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllPermission();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  initialState: {
    list: [],
    totalPages: 0,
    status: "idle",
    error: null,
    permissions: [],
  },
  name: "user",
  reducers: {
    updateIsOnlineThunk: (state, action) => {
      state.list = state.list.map((user) =>
        user.id === action.payload.id ? action.payload : user
      );
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(getUserThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(">>>list: ", action.payload);
        state.list = action.payload.content;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload;
      })
      .addCase(updateUserStatusThunk.fulfilled, (state, action) => {
        state.list = state.list.map((user) =>
          user.id === action.payload.id ? action.payload : user
        );
      })

      .addCase(createModeratorThunk.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.list = state.list.filter((user) => user.id !== action.payload);
      })
      .addCase(updatePermissionsThunk.fulfilled, (state, action) => {
        state.list = state.list.map((user) =>
          user.id === action.payload.id ? action.payload : user
        );
      })
      .addCase(getAllPermissionThunk.fulfilled, (state, action) => {
        state.permissions = action.payload;
      }),
});

export const { updateIsOnlineThunk } = userSlice.actions;
export default userSlice.reducer;
