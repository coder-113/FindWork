import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import
{
  getUserByIDAsync,
  updateUserAsync,
  getEducationByUserIdAsync,
  getUserSkillsByUserIdAsync,
  getUserProjectByUserIdAsync,
  getUserLanguageByUserIdAsync,
  getUserExperienceByUserIdAsync
} from "../services/UserService";
import { jwtDecode } from "jwt-decode";

// Thunks for user operations
export const fetchUserThunk = createAsyncThunk(
  "user/fetchUser",
  async ({ username, token }, { rejectWithValue }) =>
  {
    try
    {
      const res = await getUserByIDAsync(username);
      return res;
    } catch (error)
    {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserThunk = createAsyncThunk(
  "user/updateUser",
  async ({ formData, userId }, { rejectWithValue }) =>
  {
    try
    {
      const res = await updateUserAsync(formData, userId);
      return res;
    } catch (error)
    {
      return rejectWithValue(error.message);
    }
  }
);

// Thunks for education operations
export const fetchEducationThunk = createAsyncThunk(
  "education/fetchEducation",
  async (userId, { rejectWithValue }) =>
  {
    try
    {
      const data = await getEducationByUserIdAsync(userId);
      return data;
    } catch (error)
    {
      return rejectWithValue(error.message);
    }
  }
);

// Thunks for skills operations
export const fetchSkillsThunk = createAsyncThunk(
  "skills/fetchSkills",
  async (userId, { rejectWithValue }) =>
  {
    try
    {
      const res = await getUserSkillsByUserIdAsync(userId);
      return res;
    } catch (error)
    {
      return rejectWithValue(error.message);
    }
  }
);

// Thunks for projects operations
export const fetchProjectsThunk = createAsyncThunk(
  "projects/fetchProjects",
  async (userId, { rejectWithValue }) =>
  {
    try
    {
      const res = await getUserProjectByUserIdAsync(userId);
      return res;
    } catch (error)
    {
      return rejectWithValue(error.message);
    }
  }
);

// Thunks for languages operations
export const fetchLanguageThunk = createAsyncThunk(
  "languages/fetchLanguage",
  async (userId, { rejectWithValue }) =>
  {
    try
    {
      const res = await getUserLanguageByUserIdAsync(userId);
      return res;
    } catch (error)
    {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchExperienceThunk = createAsyncThunk(
  "experiences/fetchexperience",
  async (userId, { rejectWithValue }) =>
  {
    try
    {
      const res = await getUserExperienceByUserIdAsync(userId);
      return res;
    } catch (error)
    {
      return rejectWithValue(error.message);
    }
  }
);
const token = localStorage.getItem("accessToken");

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: token ? jwtDecode(token) : null,
    status: "idle",
    error: null,
    education: [],
    educationStatus: "idle",
    educationError: null,
    skills: [],
    skillsStatus: "idle",
    skillsError: null,
    projects: [], // Add projects to the state
    projectsStatus: "idle",
    projectsError: null,
    languages: [], // Add languages to the state
    languageStatus: "idle",
    languageError: null,
    experiences: [], // Add languages to the state
    experienceStatus: "idle",
    experienceError: null,
  },
  reducers: {
    updateToken (state, action)
    {
      state.user = jwtDecode(action.payload);
      localStorage.setItem("accessToken", action.payload);
    },
  },
  extraReducers: (builder) =>
  {
    builder
      .addCase(fetchUserThunk.pending, (state) =>
      {
        state.status = "loading";
      })
      .addCase(fetchUserThunk.fulfilled, (state, action) =>
      {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUserThunk.rejected, (state, action) =>
      {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) =>
      {
        state.status = "succeeded";
        // state.user = { ...state.user, imageUrl: action.payload.imageUrl };
        state.user = action.payload;

      })
      .addCase(updateUserThunk.rejected, (state, action) =>
      {
        state.error = action.payload;
      })
      .addCase(fetchEducationThunk.pending, (state) =>
      {
        state.educationStatus = "loading";
      })
      .addCase(fetchEducationThunk.fulfilled, (state, action) =>
      {
        state.educationStatus = "succeeded";
        state.education = action.payload;
      })
      .addCase(fetchEducationThunk.rejected, (state, action) =>
      {
        state.educationStatus = "failed";
        state.educationError = action.payload;
      })
      .addCase(fetchSkillsThunk.pending, (state) =>
      {
        state.skillsStatus = "loading";
      })
      .addCase(fetchSkillsThunk.fulfilled, (state, action) =>
      {
        state.skillsStatus = "succeeded";
        state.skills = action.payload;
      })
      .addCase(fetchSkillsThunk.rejected, (state, action) =>
      {
        state.skillsStatus = "failed";
        state.skillsError = action.payload;
      })
      .addCase(fetchProjectsThunk.pending, (state) =>
      {
        state.projectsStatus = "loading";
      })
      .addCase(fetchProjectsThunk.fulfilled, (state, action) =>
      {
        state.projectsStatus = "succeeded";
        state.projects = action.payload;
      })
      .addCase(fetchProjectsThunk.rejected, (state, action) =>
      {
        state.projectsStatus = "failed";
        state.projectsError = action.payload;
      })
      .addCase(fetchLanguageThunk.pending, (state) =>
      {
        state.languageStatus = "loading";
      })
      .addCase(fetchLanguageThunk.fulfilled, (state, action) =>
      {
        state.languageStatus = "succeeded";
        state.languages = action.payload;
      })
      .addCase(fetchLanguageThunk.rejected, (state, action) =>
      {
        state.languageStatus = "failed";
        state.languageError = action.payload;
      })
      .addCase(fetchExperienceThunk.pending, (state) =>
      {
        state.experienceStatus = "loading";
      })
      .addCase(fetchExperienceThunk.fulfilled, (state, action) =>
      {
        state.experienceStatus = "succeeded";
        state.experiences = action.payload;
      })
      .addCase(fetchExperienceThunk.rejected, (state, action) =>
      {
        state.experienceStatus = "failed";
        state.experienceError = action.payload;
      });
  },
});

export const { updateToken } = userSlice.actions;

export default userSlice.reducer;
