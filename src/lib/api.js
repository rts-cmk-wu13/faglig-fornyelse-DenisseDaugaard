const BASE = 'https://dummyjson.com'

export async function fetchProducts(limit = 12) {
  const res = await fetch(`${BASE}/products?limit=${limit}`)
  if(!res.ok) throw new Error('Failed to load products')
  const data = await res.json()
  return data
}

export async function fetchProductById(id){
  const res = await fetch(`${BASE}/products/${id}`)
  if(!res.ok) throw new Error('Failed to load product')
  return res.json()
}
