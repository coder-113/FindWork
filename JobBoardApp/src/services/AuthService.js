import axiosRequest from "../configs/axiosConfig";

export const signUpAsync = async (data) =>
  await axiosRequest.post("/auth/signup", data);

export const signInOAuth2Async = async (token) =>
  await axiosRequest.post(
    "/auth/google",
    {
      token,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

export const signOutAsync = async (data) =>
  await axiosRequest.post("/auth/signout", {
    refreshToken: data,
  });

export const signInAysnc = async (data) =>
  await axiosRequest.post("/auth/signin", data);
