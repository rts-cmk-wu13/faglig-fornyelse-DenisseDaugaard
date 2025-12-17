import React, {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCart, getUser, setUser, logout } from '../lib/storage'

export default function Header(){
  const [user, setUserState] = useState(getUser())
  const [cartCount, setCartCount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const handleStorageChange = () => {
      setUserState(getUser())
      updateCartCount()
    }
    
    const updateCartCount = () => {
      const cart = getCart()
      setCartCount(cart.reduce((s,i)=>s+i.qty,0))
    }

    updateCartCount()
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('user-storage-change', handleStorageChange)
    window.addEventListener('cart-storage-change', updateCartCount)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('user-storage-change', handleStorageChange)
      window.removeEventListener('cart-storage-change', updateCartCount)
    }
  }, [])

  function handleLogout(){ 
    logout()
    setUserState(null)
    navigate('/')
  }

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/" className="font-bold text-xl">Copilot Shop</Link>
          <Link to="/shop" className="text-sm hover:text-blue-600">Shop</Link>
          <Link to="/favorites" className="text-sm hover:text-blue-600">Favorites</Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/orders" className="text-sm hover:text-blue-600">My Orders</Link>
          <Link to="/cart" className="text-sm hover:text-blue-600">Cart ({cartCount})</Link>
          {user ? (
            <>
              <span className="text-sm font-semibold">{user.name}</span>
              <button onClick={handleLogout} className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                Logout
              </button>
            </>
          ) : (
            <div className="flex space-x-2">
              <Link to="/login" className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                Login
              </Link>
              <Link to="/signup" className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
