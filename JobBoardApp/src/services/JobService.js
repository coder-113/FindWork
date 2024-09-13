import axios from "axios";
import axiosRequest from "../configs/axiosConfig";
export const getAllJob = async () =>
{
    const data = await axiosRequest.get("/jobs");
    return data;
};