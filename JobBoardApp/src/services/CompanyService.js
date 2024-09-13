import axiosRequest from "../configs/axiosConfig";

export const getAllCompany = async () =>
{
    const data = await axiosRequest.get("/companies");
    return data;
};