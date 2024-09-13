import axiosRequest from "../configs/axiosConfig";
import axios, { Axios } from "axios";
const URL = "/jobs";


// export const getAllJobs = async () => {
//   try {
//     const response = await axios.get("http://localhost:8080/api/jobs");
//     return response.data;
//   } catch (error) {
//     throw new Error("Error fetching jobs: " + error.message);
//   }
// };
export const getAllJobs = async () => await axiosRequest.get(URL);

export const createJob = async (companyId, categoryId, jobData) => {
  try {
    const response = await axiosRequest.post(
      `${URL}/companies/${companyId}/categories?categoryId=${categoryId.join(',')}`,
      jobData
    );
    console.log('Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating job:', error.response ? error.response.data : error.message);
    throw error;
  }
};
export const getJobById = async (jobId) => await axiosRequest.get(`${URL}/job/${jobId}`);

export const updateJob = async (jobId, jobData) => {
  
  return await axiosRequest.put(`${URL}/edit/${jobId}`, jobData);
};

export const deleteJob = async (jobId) => await axiosRequest.delete(`${URL}/${jobId}`);
