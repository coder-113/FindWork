import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  signInAysnc,
  signUpAsync,
  updateUserAsync,
  getUserByIDAsync,
} from '../services/AuthService'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

const userNotFound = 'User not found'
const badCredentials = 'Bad credentials'

export const signIn = createAsyncThunk('auth/signin', async (data, { rejectWithValue }) => {
  try {
    const res = await signInAysnc(data)
    if (typeof res === 'string') {
      switch (res) {
        case badCredentials:
          return rejectWithValue({
            message: 'Your username or password is incorrect.',
          })
        case userNotFound:
          return rejectWithValue({
            message: 'User not found',
          })
      }
    }
    if (typeof res === 'object' && res.verified === false) {
      return rejectWithValue({
        email: res.email,
        message: 'Please check your email to verify your account.',
      })
    }
    return res
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const signUp = createAsyncThunk('auth/signup', async (data, { rejectWithValue }) => {
  try {
    const res = await signUpAsync(data)
    return res
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const updateUserThunk = createAsyncThunk(
  'user/update',
  async ({ formData, userId }, { rejectWithValue }) => {
    try {
      const res = await updateUserAsync(formData, userId)
      if (res.error) {
        return rejectWithValue(res.error)
      }
      return res
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const getUserByIDThunk = createAsyncThunk('user/getOne', async (id, { rejectWithValue }) => {
  try {
    const res = await getUserByIDAsync(id)
    console.log(res)
    return res
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const signUpEmployer = createAsyncThunk(
  'auth/signUpEmployer',
  async (employerData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/registerEmployer',
        employerData,
      )
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  },
)
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/auth/forgot-password?email=${email}`,
      )
      return response.data.message
    } catch (error) {
      return rejectWithValue(
        error.response
          ? error.response.data.message
          : 'Something went wrong. Please try again later.',
      )
    }
  },
)
export const setupCredentials = createAsyncThunk(
  'auth/setupCredentials',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/setup-credentials', data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong')
    }
  },
)
const name = 'auth'
const initialState = {
  error: null,
  state: 'idle',
  signUpSuccess: false,
  signInSuccess: false,
  isVerified: true,
  verificationEmail: null,
  successMessage: '',
  errorMessage: '',
  verificationMessage: null,
  roles: [],
  user: localStorage.getItem('accessToken') && jwtDecode(localStorage.getItem('accessToken')),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetSignUpSuccess(state) {
      state.signUpSuccess = false
    },
    resetSignInSuccess(state) {
      state.signInSuccess = false
    },
    logout(state) {
      state.user = null
      state.roles = []
      localStorage.removeItem('accessToken')
    },
    resetVerificationMessage(state) {
      state.verificationMessage = null
    },
    resetMessages(state) {
      state.successMessage = ''
      state.errorMessage = ''
    },
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.state = 'loading'
        state.error = null
      })
      .addCase(signUp.fulfilled, (state) => {
        state.state = 'succeeded'
        state.signUpSuccess = true
      })
      .addCase(signUp.rejected, (state, action) => {
        state.state = 'failed'
        state.error = action.payload
      })
      .addCase(signIn.pending, (state) => {
        state.state = 'loading'
        state.error = null
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.state = 'succeeded'
        state.signInSuccess = true
        state.isVerified = true
        state.user = jwtDecode(action.payload.accessToken)
        console.log('>>>state user: ', state.user)
        state.roles = state.user.role.map((r) => r.authority)
        localStorage.setItem('accessToken', action.payload.accessToken)
      })
      .addCase(signIn.rejected, (state, action) => {
        state.state = 'failed'
        state.error = action.payload.message // Chỉnh sửa ở đây
        if (action.payload && typeof action.payload === 'object') {
          state.isVerified = false
          state.verificationEmail = action.payload.email
          state.verificationMessage = action.payload.message
        }
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.successMessage = action.payload
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.errorMessage = action.payload
      })
      .addCase(signUpEmployer.pending, (state) => {
        state.state = 'loading'
        state.error = null
      })
      .addCase(signUpEmployer.fulfilled, (state) => {
        state.state = 'succeeded'
        state.signUpSuccess = true
      })
      .addCase(signUpEmployer.rejected, (state, action) => {
        state.state = 'failed'
        state.error = action.payload
      })
      .addCase(setupCredentials.pending, (state) => {
        state.state = 'loading'
        state.error = null
      })
      .addCase(setupCredentials.fulfilled, (state, action) => {
        state.state = 'succeeded'
        state.setupSuccess = true
        state.successMessage = action.payload.message
      })
      .addCase(setupCredentials.rejected, (state, action) => {
        state.state = 'failed'
        state.error = action.payload
      })
  },
})

export const {
  resetSignUpSuccess,
  resetSignInSuccess,
  logout,
  resetVerificationMessage,
  resetMessages,
  clearAuthError,
} = authSlice.actions

export default authSlice.reducer
