import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const pharmacyApi = axios.create({
  baseURL: `${API_URL}/pharmacy`,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const registerPharmacy = async (formData) => {
  const form = new FormData();
  
  Object.keys(formData).forEach(key => {
    if (key === 'drugLicenseFile') {
      form.append('drugLicenseFile', formData[key]);
    } else {
      form.append(key, JSON.stringify(formData[key]));
    }
  });

  const response = await pharmacyApi.post('/register', form, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const loginPharmacy = async (credentials) => {
  const response = await pharmacyApi.post('/login', credentials);
  return response.data;
};

export default pharmacyApi;