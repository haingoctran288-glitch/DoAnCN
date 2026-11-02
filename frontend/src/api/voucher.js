import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const claimVoucher = (voucherId) => {
    return axios.post(`${API_URL}/customer-vouchers/claim/${voucherId}`, {}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
};

export const getMyVouchers = (userId) => {
    return axios.get(`${API_URL}/customer-vouchers/my-vouchers`, {
        params: { userId },
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
};
