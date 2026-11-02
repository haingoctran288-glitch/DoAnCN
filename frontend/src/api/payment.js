const API_URL = "http://localhost:8080/api/payment";

export const createVnPayPayment = async (orderId, amount) => {
  const res = await fetch(`${API_URL}/vnpay/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, amount }),
  });
  if (!res.ok) throw new Error('Failed to create VNPAY payment');
  return res.json();
};

export const verifyVnPayReturn = async (params) => {
  const queryString = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/vnpay/return?${queryString}`);
  if (!res.ok) throw new Error('Failed to verify VNPAY return');
  return res.text(); // Trả về text "Payment Success" or "Payment Failed"
};

export const createMoMoPayment = async (orderId, amount, returnUrl) => {
  const res = await fetch(`${API_URL}/momo/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, amount, returnUrl }),
  });
  if (!res.ok) throw new Error('Failed to create MoMo payment');
  return res.json();
};

export const verifyMoMoReturn = async (params) => {
  const queryString = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/momo/return?${queryString}`);
  if (!res.ok) throw new Error('Failed to verify MoMo return');
  return res.text();
};
