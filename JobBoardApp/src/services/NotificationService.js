import axiosRequest from "../configs/axiosConfig";

export const getNotificationAsync = async (id) =>
  await axiosRequest.get(`/notifications/${id}`);

export const sendNotificationAsync = async (data) =>
  await axiosRequest.post(`/notifications/send`, data);

export const readNotificationAsync = async (id) =>
  await axiosRequest.put(`/notifications/read/${id}`);

export const deleteNotificationAsync = async (id) =>
  await axiosRequest.delete(`/notifications/${id}`);
