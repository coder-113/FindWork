import axiosRequest from "../configs/axiosConfig";

const URL = "/categoriesquiz";
const HEADERS_FORM_DATA = {
    "Content-Type": "multipart/form-data",
  };
export const getAllCategoriesQuiz = async () => {
  try {
    return await axiosRequest.get(URL);
  } catch (error) {
    console.log(error);
  }
};

// export const createCategoryQuiz = async (data) => {
//   try {
//     return await axiosRequest.post(URL, data, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
export const createCategoryQuiz = async (name) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      const data = await axiosRequest.post(URL, formData, {
        headers: HEADERS_FORM_DATA,
      });
  
      return data;
    } catch (error) {
      console.error("Error creating quiz:", error);
      throw error;
    }
  };
export const deleteCategoryQuizAsync = async (id) => {
  try {
    return await axiosRequest.delete(`${URL}/${id}`);
  } catch (error) {
    console.log(error);
  }
};

export const updateCategoryQuizAsync = async (data) => {
  try {
    return await axiosRequest.put(`${URL}/${data.id}`, data);
  } catch (error) {
    console.log(error);
  }
};

export const getCategoryQuizById = async (id) => {
  try {
    return await axiosRequest.get(`${URL}/${id}`);
  } catch (error) {
    console.log(error);
  }
};
