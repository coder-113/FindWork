import axiosRequest from "../configs/axiosConfig";

export const signInAsync = async (data) =>
  await axiosRequest.post("/auth/signin", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

