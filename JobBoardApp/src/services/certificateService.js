import axios from "axios";
import axiosRequest from "../configs/axiosConfig";

// export const getCertificatesByUserId = async (userId) => {
//     try {
//         const response = await axiosRequest.get(`/certificates/user/${userId}`);
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching certificates by user ID:", error);
//         throw error;
//     }
// };
export const getCertificatesByUserId = (userId) => {
    return axiosRequest.get(`/certificates/user/${userId}`);
  };



export const createCertificate = async (certificateDTO) =>
    await axiosRequest.post(`/certificates`, certificateDTO);
  

export const updateCertificate = async (id, certificateDTO) =>
    await axiosRequest.put(`/certificates/${id}`, certificateDTO);

export const deleteCertificate = async (id) =>
    await axiosRequest.delete(`/certificates/${id}`);

export const getCertificateAsync = async (filename) => {
    return await axiosRequest.get(`/certificates/certificate/${filename}`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf'
      }
    });
  };