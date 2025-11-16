// src/services/api.js
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error('categories failed');
  return res.json();
}

export async function fetchProducts(params = {}) {
  const usp = new URLSearchParams();
  if (params.q) usp.set('q', params.q);
  if (params.sort) usp.set('sort', params.sort);
  if (params.category?.length) usp.set('category', params.category.join(','));
  usp.set('page', String(params.page ?? 1));
  usp.set('page_size', String(params.page_size ?? 6));

  const res = await fetch(`${API_BASE}/products?${usp.toString()}`);
  if (!res.ok) throw new Error('products failed');
  return res.json();
}