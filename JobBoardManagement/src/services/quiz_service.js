// src/api/quizzes.js
import axiosRequest from "../configs/axiosConfig";

const URL = "/quizzes";
const HEADERS_FORM_DATA = {
  "Content-Type": "multipart/form-data",
};

export const fetchQuizzes = async () => await axiosRequest.get(URL);

export const createQuiz = async (title, description, imageFile,categoryId) => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("imageFile", imageFile);
    formData.append("categoryId", categoryId);

    const data = await axiosRequest.post(`${URL}/createQuiz`, formData, {
      headers: HEADERS_FORM_DATA,
    });

    return data;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
};

export const deleteQuiz = async (quizId) => {
  try {
    await axiosRequest.delete(`${URL}/${quizId}`);
  } catch (error) {
    console.error(`Error deleting quiz with id ${quizId}:`, error);
    throw error;
  }
};

export const updateQuiz = async (id, data, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("imageFile", imageFile);
    formData.append("categoryId", data.categoryId);

    const response = await axiosRequest.put(`${URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error updating quiz with id ${id}:`, error);
    throw error;
  }
};