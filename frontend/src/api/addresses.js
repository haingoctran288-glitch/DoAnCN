import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/addresses';

export const getAddressesByUser = async (userId) => {
  return await axios.get(`${BASE_URL}/user/${userId}`);
};

export const createAddress = async (data) => {
  return await axios.post(BASE_URL, data);
};

export const updateAddress = async (id, data) => {
  return await axios.put(`${BASE_URL}/${id}`, data);
};

export const deleteAddress = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};

export const setDefaultAddress = async (id) => {
  return await axios.put(`${BASE_URL}/set-default/${id}`);
};
