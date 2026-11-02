const API_URL = "http://localhost:8080/api/services";
const GROUP_API_URL = "http://localhost:8080/api/service-groups";

export const getServices = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch services');
  return res.json();
};

export const getServiceById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch service');
  return res.json();
};

export const getServiceGroups = async () => {
  const res = await fetch(GROUP_API_URL);
  if (!res.ok) throw new Error('Failed to fetch service groups');
  return res.json();
};

export const getServicesByGroup = async (groupId) => {
  const res = await fetch(`${API_URL}/group/${groupId}`);
  if (!res.ok) throw new Error('Failed to fetch services by group');
  return res.json();
};
