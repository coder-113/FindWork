import axios from "axios";
import axiosRequest from "../configs/axiosConfig";

const URL = "/blogs";
const HEADERS_FORM_DATA = {
  "Content-Type": "multipart/form-data",
};

export const getAllBlogsByQuery = async (
  query,
  type,
  visibility,
  page,
  size,
  archive
) =>
  await axiosRequest.get(
    `${URL}/search?query=${query}&type=${type}&page=${page}&size=${size}&visibility=${visibility}&archive=${archive}`
  );

export const createBlog = async (data) =>
  await axiosRequest.post(URL, data, {
    headers: HEADERS_FORM_DATA,
  });

export const deleteBlog = async (blogId) =>
  await axiosRequest.delete(`${URL}/${blogId}`);

export const updateBlog = async (data, id) =>
  await axiosRequest.put(`${URL}/${id}`, data, {
    headers: HEADERS_FORM_DATA,
  });

export const getAllHashtag = async () =>
  await axiosRequest.get(`${URL}/hashtags`);

export const updateIsArchiveStatus = async ({ selectedIds, status }) =>
  await axiosRequest.put(
    `${URL}/archive`,
    {
      blogIds: selectedIds,
      isArchive: status,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

export const getExcelData = () => {
  axiosRequest
    .get(`${URL}/excel`, {
      method: "GET",
      responseType: "blob", // Ensure that the response type is blob
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    })
    .then((data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "blogs.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    })
    .catch((error) => console.error("Error exporting data to Excel:", error));
};
