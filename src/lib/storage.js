const CART_KEY = 'cw_cart_v1'
const ORDERS_KEY = 'cw_orders_v1'
const USER_KEY = 'cw_user_v1'
const FAV_KEY = 'cw_fav_v1'
const USERS_KEY = 'cw_users_v1'

export function getCart(){
  const user = getUser()
  if(!user) return [] // Return empty cart if not logged in
  
  try{ 
    const cartKey = `${CART_KEY}_${user.id}`
    return JSON.parse(localStorage.getItem(cartKey)) || [] 
  }catch(e){
    return []
  }
}
export function setCart(items){ 
  const user = getUser()
  if(!user) return // Can't save cart without being logged in
  
  const cartKey = `${CART_KEY}_${user.id}`
  localStorage.setItem(cartKey, JSON.stringify(items))
  window.dispatchEvent(new Event('cart-storage-change'))
}
export function clearCart(){ 
  const user = getUser()
  if(!user) return
  
  const cartKey = `${CART_KEY}_${user.id}`
  localStorage.removeItem(cartKey)
  window.dispatchEvent(new Event('cart-storage-change'))
}
export function addToCart(product, qty=1){
  const user = getUser()
  if(!user){
    console.error('No user found when adding to cart')
    return false
  }
  const cart = getCart()
  const idx = cart.findIndex(i => i.id === product.id)
  if(idx >= 0) cart[idx].qty += qty
  else cart.push({ ...product, qty })
  setCart(cart)
  return true
}
export function saveOrder(order){
  const user = getUser()
  if(!user) return // Can't save order without being logged in
  
  const ordersKey = `${ORDERS_KEY}_${user.id}`
  const orders = getOrders()
  orders.unshift(order)
  localStorage.setItem(ordersKey, JSON.stringify(orders))
}
export function getOrders(){
  const user = getUser()
  if(!user) return [] // No orders if not logged in
  
  try{
    const ordersKey = `${ORDERS_KEY}_${user.id}`
    return JSON.parse(localStorage.getItem(ordersKey)) || []
  }catch(e){
    return []
  }
}
export function setUser(user){ 
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  window.dispatchEvent(new Event('user-storage-change'))
}
export function getUser(){ try{return JSON.parse(localStorage.getItem(USER_KEY))}catch(e){return null} }
export function logout(){ 
  localStorage.removeItem(USER_KEY)
  window.dispatchEvent(new Event('user-storage-change'))
}
export function continueAsGuest(){
  const guestUser = {
    id: 'guest_' + Date.now(),
    name: 'Guest',
    isGuest: true
  }
  try {
    setUser(guestUser)
    console.log('Guest user created:', guestUser)
  } catch (err) {
    console.error('Error creating guest user:', err)
  }
  return guestUser
}

// User-specific favorites
export function toggleFav(product){
  const user = getUser()
  if(!user) return // Can't save favorites without being logged in
  
  const favKey = `${FAV_KEY}_${user.id}`
  const favs = getFavs()
  const idx = favs.findIndex(f => f.id === product.id)
  if(idx >= 0) { 
    favs.splice(idx, 1) 
  } else { 
    favs.push(product) 
  }
  localStorage.setItem(favKey, JSON.stringify(favs))
}

export function getFavs(){ 
  const user = getUser()
  if(!user) return [] // No favorites if not logged in
  
  try{
    const favKey = `${FAV_KEY}_${user.id}`
    return JSON.parse(localStorage.getItem(favKey)) || []
  } catch(e){
    return []
  }
}

// User Registration & Login
export function registerUser(email, password, name){
  const users = getRegisteredUsers()
  
  // Check if email already exists
  if(users.find(u => u.email === email)){
    return { success: false, message: 'Email already registered' }
  }

  // Simple hash (in production use proper hashing like bcrypt)
  const hashedPassword = btoa(password)
  
  const newUser = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    password: hashedPassword,
    name,
    createdAt: new Date().toISOString()
  }
  
  users.push(newUser)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  
  return { success: true, user: { id: newUser.id, email: newUser.email, name: newUser.name } }
}

export function loginUser(email, password){
  const users = getRegisteredUsers()
  const user = users.find(u => u.email === email)
  
  if(!user){
    return { success: false, message: 'Email not found' }
  }

  const hashedPassword = btoa(password)
  if(user.password !== hashedPassword){
    return { success: false, message: 'Incorrect password' }
  }

  return { success: true, user: { id: user.id, email: user.email, name: user.name } }
}

export function getRegisteredUsers(){
  try{return JSON.parse(localStorage.getItem(USERS_KEY)) || []}catch(e){return []}
}
