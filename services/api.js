const API = '/api'

export async function fetchCategories() {
  const r = await fetch(API + '/categories')
  return r.json()
}

export async function fetchProducts(params = {}) {
  const u = new URLSearchParams()

  if (params.q) u.set('q', params.q)
  if (params.sort) u.set('sort', params.sort)

  if (params.category?.length) {
    u.set('category', params.category.join(','))
  }

  u.set('page', params.page ?? 1)
  u.set('page_size', params.page_size ?? 6)

  const r = await fetch(API + '/products?' + u.toString())
  return r.json()
}