import axiosRequest from "../configs/axiosConfig";

export const findAllJob = async (id) => {
  try {
    return await axiosRequest.get(`/jobs/${id}`);
  } catch (error) {
    console.log(error);
  }
};
export const postJob = async (userId, data) =>
  await axiosRequest.post(`/jobs/users/${userId}`, data);


// Hàm xóa job
export const deleteJob = async (jobId) => {
  try {
    return await axiosRequest.delete(`/jobs/${jobId}`);
  } catch (error) {
    console.log(error);
  }
};

export const updateJob = async (jobId,data) => {
  try {
    return await axiosRequest.put(`/jobs/edit/${jobId}`,data);
  } catch (error) {
    console.log(error);
  }
};

// Hàm lấy thông tin chi tiết job để edit
export const jobbyid = async (jobId) => {
  try {
    return await axiosRequest.get(`/jobs/job/${jobId}`);
  } catch (error) {
    console.log(error);
  }
};
// Hàm search job
export const searchJobs = async (userId, searchText) => {
  try {
    const response = await axiosRequest.get(`/jobs/${userId}/search?text=${searchText}`);
    return response.data; // Trả về dữ liệu từ server
  } catch (error) {
    console.log(error);
    throw error;
  }
};
