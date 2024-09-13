import { legacy_createStore as createStore } from 'redux'
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import { configureStore } from "@reduxjs/toolkit";
import jobReducer from "./features/JobSlice"; // Đảm bảo đường dẫn và tên file chính xác
import categoryReducer from "./features/categorySlice";
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["notification"], // Chỉ lưu trữ notification reducer
};

const rootReducer = combineReducers({
  // blogs: blogsReducer,
  // comments: commentReducer,
  auth: authReducer,
  jobs: jobReducer,
  categories: categoryReducer,
  // notification: notificationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Tắt kiểm tra serializable cho Redux Persist
    }).concat(/* Thêm middleware của bạn vào đây */),
});

export default store;
