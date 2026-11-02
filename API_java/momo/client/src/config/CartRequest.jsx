import request from './request';
import { apiClient } from './axiosClient';

const apiCart = '/api/cart';

export const requestAddToCart = async (data) => {
    const res = await apiClient.post(`${apiCart}/create`, data);
    return res.data;
};

export const requestGetCart = async () => {
    const res = await apiClient.get(`${apiCart}/get`);
    return res.data;
};

export const requestUpdateQuantity = async (data) => {
    const res = await apiClient.put(`${apiCart}/update`, data);
    return res.data;
};

export const requestDeleteProductCart = async (data) => {
    const res = await apiClient.delete(`${apiCart}/delete/${data}`);
    return res.data;
};

export const requestApplyCounpon = async (data) => {
    const res = await apiClient.put(`${apiCart}/apply-coupon`, data);
    return res.data;
};

export const requestUpdateInfoCart = async (data) => {
    const res = await apiClient.put(`${apiCart}/update-info`, data);
    return res.data;
};
