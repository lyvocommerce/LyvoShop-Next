// src/services/images.js

// Единая fallback-картинка на случай отсутствия image_url
export const FALLBACK_IMG = 'https://dummyjson.com/image/i/products/1/thumbnail.webp';

export function imgSrc(p) {
  // Используем URL из базы, либо запасную заглушку
  return p?.image_url || FALLBACK_IMG;
}