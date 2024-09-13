import axiosRequest from "../configs/axiosConfig";

export const getAllCategory = async () => await axiosRequest.get("/categories");
