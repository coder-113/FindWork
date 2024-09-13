import axiosRequest from '../configs/axiosConfig';

const baseURL = '/templates';
const HEADERS_FORM_DATA = {
  'Content-Type': 'multipart/form-data',
};

export const fetchCVs = async () => {
  try {
    return await axiosRequest.get(baseURL);
  } catch (error) {
    console.error('Error fetching CVs:', error);
    throw error;
  }
};
export const disableCV = async (id) => {
  try {
    await axiosRequest.patch(`${baseURL}/disable/${id}`);
  } catch (error) {
    console.error(`Error disabling CV with id ${id}:`, error);
    throw error;
  }
};
export const unDisableCV = async (id) => {
  try {
    await axiosRequest.patch(`${baseURL}/un_disable/${id}`);
  } catch (error) {
    console.error(`Error un-disabling CV with id ${id}:`, error);
    throw error;
  }
};
export const fetchCVById = async (id) => {
  try {
    return await axiosRequest.get(`${baseURL}/${id}`);
  } catch (error) {
    console.error('Error fetching CV By Id:', error);
    throw error;
  }
};
export const createCV = async (formData) => {
  try {
    return await axiosRequest.post(`${baseURL}/create`, formData, {
      headers: HEADERS_FORM_DATA,
    });
  } catch (error) {
    console.error('Error creating CV:', error);
    throw error;
  }
};

export const updateCV = async (id, formData) => {
  try {
    const response = await axiosRequest.put(`${baseURL}/update/${id}`, formData, {
      headers: HEADERS_FORM_DATA,
    });
    return response.data; // Assuming the response contains data relevant to your application
  } catch (error) {
    console.error(`Error updating CV with id ${id}:`, error);
    throw error;
  }
};


export const deleteCV = async (id) => {
  try {
    await axiosRequest.delete(`${baseURL}/delete/${id}`);
  } catch (error) {
    console.error(`Error deleting CV with id ${id}:`, error);
    throw error;
  }
};

export const uploadCV = async (file, templateName) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('templateName', templateName);

    return await axiosRequest.post(`${baseURL}/upload`, formData, {
      headers: HEADERS_FORM_DATA,
    });
  } catch (error) {
    console.error('Error uploading CV:', error);
    throw error;
  }
};
