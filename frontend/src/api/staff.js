const API_URL = "http://localhost:8080/api/staff";

export const getStaff = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch staff');
  return res.json();
};

export const getStaffById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch staff details');
  return res.json();
};
