import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import
{
  signInAysnc,
  signInOAuth2Async,
  signOutAsync,
  signUpAsync,
} from "../services/AuthService";
import { jwtDecode } from "jwt-decode"; // Correct import
import axios from "axios";

export const signIn = createAsyncThunk(
  "auth/signin",
  async (data, { rejectWithValue }) =>
  {
    try
    {
      const res = await signInAysnc(data);
      if (typeof res === "object" && res.verified === false)
      {
        return rejectWithValue({
          email: res.email,
          message: "Please check your email to verify your account.",
        });
      }
      if (res.userId)
      {
        localStorage.setItem("userId", res.userId.toString());
      }
      if (res.username)
      {
        localStorage.setItem("username", res.username);
      }
      return res;
    } catch (error)
    {
      console.log(">>>error sign in: ", error);
      const status = error.response.status;
      if (status === 401 || status === 403)
      {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const signInOAuth2 = createAsyncThunk(
  "auth/signInOAuth2",
  async (data, { rejectWithValue }) =>
  {
    try
    {
      const res = await signInOAuth2Async(data);
      return res;
    } catch (error)
    {
      console.log(">>> error oauth2: ", error);
      const status = error.response.status;
      if (status === 400)
      {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const signOut = createAsyncThunk(
  "auth/signOut",
  async (_, { rejectWithValue }) =>
  {
    try
    {
      const refreshToken = localStorage.getItem("refreshToken");
      const res = await signOutAsync(refreshToken);
      return res;
    } catch (error)
    {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);

export const signUp = createAsyncThunk(
  "auth/signup",
  async (data, { rejectWithValue }) =>
  {
    try
    {
      const res = await signUpAsync(data);
      return res;
    } catch (error)
    {
      const status = error.response.status;
      if (status === 400)
      {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const signUpEmployer = createAsyncThunk(
  "auth/signUpEmployer",
  async (employerData, { rejectWithValue }) =>
  {
    try
    {
      const response = await axios.post(
        "http://localhost:8080/api/auth/registerEmployer",
        employerData
      );
      return response.data;
    } catch (error)
    {
      return rejectWithValue(error.response.data);
    }
  }
);
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) =>
  {
    try
    {
      const response = await axios.post(
        `http://localhost:8080/api/auth/forgot-password?email=${email}`
      );
      return response.data.message;
    } catch (error)
    {
      return rejectWithValue(
        error.response
          ? error.response.data.message
          : "Something went wrong. Please try again later."
      );
    }
  }
);
export const setupCredentials = createAsyncThunk(
  "auth/setupCredentials",
  async (data, { rejectWithValue }) =>
  {
    try
    {
      const response = await axios.post(
        "http://localhost:8080/api/auth/setup-credentials",
        data
      );
      return response.data;
    } catch (error)
    {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);
const name = "auth";
const initialState = {
  error: null,
  status: "idle",
  signUpSuccess: false,
  signInSuccess: false,
  isVerified: true,
  verificationEmail: null,
  successMessage: "",
  errorMessage: "",
  verificationMessage: null,
  roles: [],
  user:
    localStorage.getItem("accessToken") &&
    jwtDecode(localStorage.getItem("accessToken")),
  currentUser: null,
};

const authSlice = createSlice({
  name,
  initialState,
  reducers: {
    resetSignUpSuccess (state)
    {
      state.signUpSuccess = false;
    },
    resetSignInSuccess (state)
    {
      state.signInSuccess = false;
    },
    logout (state)
    {
      state.user = null;
      state.roles = [];
      state.status = "idle";
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    resetVerificationMessage (state)
    {
      state.verificationMessage = null;
    },
    resetMessages (state)
    {
      state.error = null;
    },
    setCurrentUser (state, action)
    {
      state.currentUser = action.payload;
    },
    updateToken (state, action)
    {
      state.user = jwtDecode(action.payload);
      state.roles = state.user.role.map((r) => r.authority);
    },
  },
  extraReducers: (builder) =>
  {
    builder
      .addCase(signUp.pending, (state) =>
      {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state) =>
      {
        state.status = "succeeded";
        state.signUpSuccess = true;
      })
      .addCase(signUp.rejected, (state, action) =>
      {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(signIn.pending, (state) =>
      {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) =>
      {
        state.status = "succeeded";
        state.signInSuccess = true;
        state.isVerified = true;
        state.currentUser = action.payload.user;
        state.user = jwtDecode(action.payload.accessToken);
        console.log(">>>state user: ", state.user);
        state.roles = state.user.role.map((r) => r.authority);
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      })
      .addCase(signIn.rejected, (state, action) =>
      {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(forgotPassword.fulfilled, (state, action) =>
      {
        state.successMessage = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) =>
      {
        state.errorMessage = action.payload;
      })
      .addCase(signUpEmployer.pending, (state) =>
      {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signUpEmployer.fulfilled, (state) =>
      {
        state.status = "succeeded";
        state.signUpSuccess = true;
      })
      .addCase(signUpEmployer.rejected, (state, action) =>
      {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(setupCredentials.pending, (state) =>
      {
        state.status = "loading";
        state.error = null;
      })
      .addCase(setupCredentials.fulfilled, (state, action) =>
      {
        state.status = "succeeded";
        state.setupSuccess = true;
        state.successMessage = action.payload.message;
      })
      .addCase(setupCredentials.rejected, (state, action) =>
      {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(signInOAuth2.fulfilled, (state, action) =>
      {
        const user = jwtDecode(action.payload.accessToken);
        state.user = { ...user, refreshToken: action.payload.refreshToken };
        console.log(">>>state user: ", state.user);
        state.roles = state.user.role.map((r) => r.authority);
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      })
      .addCase(signInOAuth2.rejected, (state, action) =>
      {
        state.error = action.payload;
      })
      .addCase(signOut.fulfilled, (state) =>
      {
        state.user = null;
        state.roles = [];

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      });
  },
});

export const {
  resetSignUpSuccess,
  resetSignInSuccess,
  logout,
  resetVerificationMessage,
  resetMessages,
  updateToken,
} = authSlice.actions;
export const { setCurrentUser } = authSlice.actions;
export default authSlice.reducer;
