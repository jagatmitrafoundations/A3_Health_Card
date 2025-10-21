import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const userApi = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const registerUser = async (formData) => {
  const form = new FormData();
  
  // Append basic info
  form.append('fullName', formData.fullName);
  form.append('email', formData.email);
  form.append('phoneNumber', formData.phoneNumber);
  form.append('password', formData.password);
  form.append('dob', formData.dob);
  form.append('sex', formData.sex);
  form.append('maritalStatus', formData.maritalStatus);

  // Append guardian info
  form.append('guardianInfo', JSON.stringify({
    name: formData.guardianName,
    relation: formData.guardianRelation
  }));

  // Append addresses
  form.append('presentAddress', JSON.stringify(formData.presentAddress));
  form.append('permanentAddress', JSON.stringify(formData.permanentAddress));

  // Append professional info
  form.append('occupation', formData.occupation);
  form.append('educationLevel', formData.educationLevel);

  // Append emergency contacts
  form.append('emergencyContacts', JSON.stringify(formData.emergencyContacts));

  // Append identification
  form.append('uniqueID', JSON.stringify(formData.uniqueID));
  form.append('documentType', formData.documentType);

  // Append files
  if (formData.profileImage) {
    form.append('profileImage', formData.profileImage);
  }
  if (formData.documentFile) {
    form.append('documentFile', formData.documentFile);
  }

  const response = await userApi.post('/signup', form, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export default userApi;