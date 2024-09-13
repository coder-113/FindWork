import axiosRequest from "../configs/axiosConfig";

export const getAllCompany = async () => await axiosRequest.get("/companies");