import axiosRequest from "../configs/axiosConfig";

const URL = "/blog-category";
export const getAllBlogCategories = async () => await axiosRequest.get(URL);
