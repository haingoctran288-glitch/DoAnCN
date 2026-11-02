const API_URL = "http://localhost:8080/api/products";

export const getProducts = async (branch) => {
  const url = branch ? `${API_URL}?branch=${branch}` : API_URL;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

export const getProductById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product ' + id);
  return res.json();
};

export const getProductsByCategory = async (category, branch) => {
  const url = branch ? `${API_URL}?branch=${branch}` : API_URL;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch products by category');
  const all = await res.json();
  return all.filter(p => p.category === category);
};
