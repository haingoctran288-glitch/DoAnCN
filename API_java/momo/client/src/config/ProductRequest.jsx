import request from './request';

const apiProduct = '/api/product';

export const listProduct = async () => {
    const res = await request.get(`${apiProduct}/list`);
    return res.data;
};

export const listProductByCategory = async (idCategory) => {
    const res = await request.get(`${apiProduct}/list/${idCategory}`);
    return res.data;
};

export const productDetail = async (idProduct) => {
    const res = await request.get(`${apiProduct}/detail/${idProduct}`);
    return res.data;
};
