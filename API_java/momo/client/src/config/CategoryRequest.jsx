import request from './request';

const apiCategory = '/api/category';

export const listCategory = async () => {
    const res = await request.get(`${apiCategory}/list`);
    return res.data;
};
