import axios from "axios";
import axiosRequest from "../configs/axiosConfig";

const URL = "/api/employer";

// Lấy danh sách tất cả employers
export const fetchAllEmployers = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/employer/allEmployers");
    return response.data;
  } catch (error) {
    console.error("Error fetching employers:", error);
    throw error;
  }
};
// export const fetchAllEmployers = async () => await axiosRequest.get(URL);

// Phê duyệt employer
export const approveEmployer = async (id) => {
  try {
    const response = await axios.post(`http://localhost:8080/api/employer/approveEmployer/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error approving employer with id ${id}:`, error);
    throw error;
  }
};


