import { configureStore } from "@reduxjs/toolkit";
import blogsReducer from "./features/blogSlice";
import commentReducer from "./features/commentSlice";
import authReducer from "./features/authSlice";
import categoryReducer from "./features/categorySlice";
import notificationReducer from "./features/notificationSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import quizReducer from './features/quizSlice';
import quizQuestionsReducer from './features/quizQuestionsSlice';
import jobReducer from './features/jobSlice';
import companyReducer from './features/companySlice';
import reviewReducer from './features/reviewSlice';
import contactsReducer from './features/contactsSlice'; // Import the contacts slice
import UserReducer from './features/userSlice'; // Import the user slice
import certificateReducer from './features/certificateSlice'; // Import the certificate slice
// Cấu hình persist với whitelist
// const persistConfig = {
//   key: "root",
//   version: 1,
//   storage,
// };

// const rootReducer = combineReducers({
//   blogs: blogsReducer,
//   comments: commentReducer,
//   auth: authReducer,
//   category: categoryReducer,
//   notification: notificationReducer,
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// Cấu hình store với persistedReducer
export const store = configureStore({
  reducer: {
    blogs: blogsReducer,
    comments: commentReducer,
    auth: authReducer,
    category: categoryReducer,
    notification: notificationReducer,
    quiz: quizReducer,
    job: jobReducer,
    company: companyReducer,
    review: reviewReducer,
    contacts: contactsReducer,
    user: UserReducer,
    certificates: certificateReducer,

  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: false,
  //   }),
});
