import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCart, getUser, setUser, logout } from '../lib/storage'

export default function Header(){
  const [user, setUserState] = useState(getUser())
  const navigate = useNavigate()

  function handleLogin(){
    const u = { name: 'guest', id: Date.now() }
    setUser(u)
    setUserState(u)
  }
  function handleLogout(){ logout(); setUserState(null); navigate('/') }

  const cart = getCart()
  const cartCount = cart.reduce((s,i)=>s+i.qty,0)

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/" className="font-bold text-xl">Copilot Shop</Link>
          <Link to="/shop" className="text-sm">Shop</Link>
          <Link to="/favorites" className="text-sm">Favorites</Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/orders" className="text-sm">My Orders</Link>
          <Link to="/cart" className="text-sm">Cart ({cartCount})</Link>
          {user ? (
            <>
              <span className="text-sm">{user.name}</span>
              <button onClick={handleLogout} className="text-sm text-red-500">Logout</button>
            </>
          ) : (
            <button onClick={handleLogin} className="text-sm bg-blue-600 text-white px-3 py-1 rounded">Login</button>
          )}
        </div>
      </div>
    </header>
  )
}
