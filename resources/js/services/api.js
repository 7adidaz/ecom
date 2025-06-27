import axios from 'axios';

// Products API
export const getProducts = async (params = {}) => {
    try {
        const response = await axios.get('/products', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch products' };
    }
};

export const getProduct = async (id) => {
    try {
        const response = await axios.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch product details' };
    }
};

// Orders API
export const getOrders = async () => {
    try {
        const response = await axios.get('/orders');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch orders' };
    }
};

export const getOrder = async (id) => {
    try {
        const response = await axios.get(`/orders/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch order details' };
    }
};

export const createOrder = async (orderData) => {
    try {
        const response = await axios.post('/orders', orderData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to create order' };
    }
};
