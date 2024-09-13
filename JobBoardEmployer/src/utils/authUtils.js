import { logout } from "../features/authSlice";

export const refreshAuthToken = (user, dispatch, navigate) => {
  const expiresIn = user?.exp || 0;
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const remainingTime = expiresIn - nowInSeconds;
  const refreshTime = Math.max(0, remainingTime - 5);

  const refreshTokenTimeout = setTimeout(() => {
    dispatch(logout());
    navigate("/");
    console.log("Token expired");
  }, refreshTime * 1000);

  return () => {
    clearTimeout(refreshTokenTimeout);
  };
};
