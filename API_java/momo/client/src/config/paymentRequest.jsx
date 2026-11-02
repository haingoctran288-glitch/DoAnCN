import request from './request';
import { apiClient } from './axiosClient';

const apiPayment = '/api/payment';

export const requestPayment = async (data) => {
    const res = await apiClient.post(`${apiPayment}/create`, data);
    return res.data;
};

export const requestPaymentById = async (orderId) => {
    const res = await apiClient.get(`${apiPayment}/order/${orderId}`);
    return res.data;
};
