import React, { useEffect } from "react";
import { Route, Routes, useNavigate, useRoutes } from "react-router-dom";
import { routes } from "./utils/variables/routes";
import "./index.css";
import { FaThumbsUp } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  connectWebSocket,
  disconnectWebSocket,
} from "./services/WebSocketService";
import { getNotificationThunk } from "./features/notificationSlice";
import ThemeRoutes from "./router/Router";
import { refreshAuthToken } from "./utils/authUtils";
import { ToastContainer } from "react-toastify";

function App() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      refreshAuthToken(user, dispatch, navigate);
    }
  }, []);

  useEffect(() => {
    if (user) {
      connectWebSocket(user);
      dispatch(getNotificationThunk(user.id));
    }

    // localStorage.removeItem("persist:root");
    return () => disconnectWebSocket();
  }, [dispatch, user]);
  return (
    <>
      <Routes>
        {routes.map((item) => (
          <Route key={item.path} path={item.path} element={item.component} />
        ))}
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
