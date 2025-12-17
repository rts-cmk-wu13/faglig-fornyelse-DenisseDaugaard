const CART_KEY = 'cw_cart_v1'
const ORDERS_KEY = 'cw_orders_v1'
const USER_KEY = 'cw_user_v1'
const FAV_KEY = 'cw_fav_v1'

export function getCart(){
  try{ return JSON.parse(localStorage.getItem(CART_KEY)) || [] }catch(e){return []}
}
export function setCart(items){ localStorage.setItem(CART_KEY, JSON.stringify(items)) }
export function clearCart(){ localStorage.removeItem(CART_KEY) }
export function addToCart(product, qty=1){
  const cart = getCart()
  const idx = cart.findIndex(i => i.id === product.id)
  if(idx >= 0) cart[idx].qty += qty
  else cart.push({ ...product, qty })
  setCart(cart)
}
export function saveOrder(order){
  const orders = getOrders()
  orders.unshift(order)
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}
export function getOrders(){
  try{return JSON.parse(localStorage.getItem(ORDERS_KEY)) || []}catch(e){return []}
}
export function setUser(user){ localStorage.setItem(USER_KEY, JSON.stringify(user)) }
export function getUser(){ try{return JSON.parse(localStorage.getItem(USER_KEY))}catch(e){return null} }
export function logout(){ localStorage.removeItem(USER_KEY) }
export function toggleFav(product){
  const favs = getFavs()
  const idx = favs.findIndex(f => f.id === product.id)
  if(idx >= 0) { favs.splice(idx,1) }
  else favs.push(product)
  localStorage.setItem(FAV_KEY, JSON.stringify(favs))
}
export function getFavs(){ try{return JSON.parse(localStorage.getItem(FAV_KEY)) || []}catch(e){return []} }
