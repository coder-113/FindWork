import axiosRequest from "../configs/axiosConfig";

const URL = "/categories";

export const getAllCategoryAsync = async () => await axiosRequest.get(URL);

export const createCategoryAsync = async (data) =>
  await axiosRequest.post(URL, data);

export const deleteCategoryAsync = async (categoryId) =>
  await axiosRequest.delete(`${URL}/${categoryId}`);

export const updateCategoryAsync = async (data, id) =>
  await axiosRequest.put(`${URL}/${id}`, data);
