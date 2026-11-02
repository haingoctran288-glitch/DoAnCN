const API_URL = "http://localhost:8080/api/orders";

export const createOrder = async (orderData) => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error('Failed to create order');
  return res.json();
};

export const getOrdersByUser = async (userId, status = '') => {
  const query = status ? `?status=${status}` : '';
  const res = await fetch(`${API_URL}/user/${userId}${query}`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
};

export const getOrderById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch order');
  return res.json();
};

export const cancelOrder = async (id, reason) => {
  const res = await fetch(`${API_URL}/${id}/cancel`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) throw new Error('Failed to cancel order');
  return res.json();
};
