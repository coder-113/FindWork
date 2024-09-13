import axiosRequest from "../configs/axiosConfig";
export const getAllCategory = async () =>
{
    const data = await axiosRequest.get("/categories");
    return data; // Đảm bảo bạn trả về mảng ở đây
};
