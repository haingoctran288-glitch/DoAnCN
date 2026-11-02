import request from './request';
import { apiClient } from './axiosClient';

const apiUser = '/api/user';

export const requestLogin = async (data) => {
    const res = await request.post(`${apiUser}/login`, data);
    return res.data;
};

export const requestRegister = async (data) => {
    const res = await request.post(`${apiUser}/register`, data);
    return res.data;
};

export const requestLogout = async () => {
    const res = await apiClient.get(`${apiUser}/logout`);
    return res.data;
};

export const requestAuth = async () => {
    const res = await apiClient.get(`${apiUser}/auth`);
    return res.data;
};

export const requestRefreshToken = async () => {
    const res = await request.get(`${apiUser}/refresh-token`);
    return res.data;
};
