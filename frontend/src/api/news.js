import axios from 'axios';

const API_URL = 'http://localhost:8080/api/news';

export const getAllNews = async () => {
    return await axios.get(API_URL);
};

export const getNewsByType = async (type) => {
    return await axios.get(`${API_URL}/type/${type}`);
};

export const getNewsByCategory = async (slug) => {
    return await axios.get(`${API_URL}/category/${slug}`);
};

export const getNewsById = async (id) => {
    return await axios.get(`${API_URL}/${id}`);
};
