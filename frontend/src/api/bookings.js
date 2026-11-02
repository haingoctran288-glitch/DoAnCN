const API_URL = "http://localhost:8080/api/bookings";

export const createBooking = async (data) => {
  const token = localStorage.getItem('token');
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create booking');
  return res.json();
};

export const updateBookingStatus = async (id, status, transactionNo) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ status, transactionNo }),
  });
  if (!res.ok) throw new Error('Failed to update booking status');
  return res.json();
};

