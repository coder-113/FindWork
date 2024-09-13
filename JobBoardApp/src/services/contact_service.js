import axiosRequest from "../configs/axiosConfig";

// Function to create a new contact
export const createContact = async (contactData) => {
  try {
    const response = await axiosRequest.post('/contacts', contactData);
    return response.data;
  } catch (error) {
    throw error;
  }
};