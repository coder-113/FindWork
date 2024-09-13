import axiosRequest from "../configs/axiosConfig";
import { logout, signOut, updateToken } from "../features/authSlice";
import showToast from "./function/showToast";

export const refreshAuthToken = (user, dispatch, navigate) => {
  const expiresIn = user?.exp || 0;
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const remainingTime = expiresIn - nowInSeconds;
  const refreshTime = Math.max(0, remainingTime - 5);

  console.log(">>>refreshTime: ", refreshTime);

  const refreshTokenTimeout = setTimeout(async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        console.log(">>>user: ", user);
        const response = await axiosRequest.post("/auth/refreshtoken", {
          refreshToken,
        });

        console.log(">>>response data: ", response);

        if (response.status === 200) {
          const newAccessToken = response.accessToken;
          dispatch(updateToken(newAccessToken));
        }
      }
    } catch (error) {
      const status = error.response.status;
      if (status === 403) {
        showToast("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!", "error");
      }
      dispatch(logout());
      navigate("/");
    }
  }, refreshTime * 1000);

  return () => {
    clearTimeout(refreshTokenTimeout);
  };

};
 
