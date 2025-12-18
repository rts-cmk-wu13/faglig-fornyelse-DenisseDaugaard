import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { getCart, getUser, logout } from '../lib/storage'

export default function Header() {
  const [user, setUserState] = useState(() => getUser())
  const [cartCount, setCartCount] = useState(0)
  const [search, setSearch] = useState('')
  const [searchParams] = useSearchParams()

  const navigate = useNavigate()
  const location = useLocation()

  // Sync input with URL
  useEffect(() => {
    setSearch(searchParams.get('search') || '')
  }, [searchParams])

  useEffect(() => {
    const updateCartCount = () => {
      const cart = getCart()
      setCartCount(cart.reduce((s, i) => s + i.qty, 0))
    }

    const handleStorageChange = () => {
      setUserState(getUser())
      updateCartCount()
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

  function handleLogout() {
    logout()
    setUserState(null)
    navigate('/')
  }

  function isActive(path) {
    return location.pathname === path
  }

  function handleSearchSubmit(e) {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`)
    } else {
      navigate('/shop')
    }
  }

  return (
    <header className="bg-white shadow">
      <div className='bg-[#0D0D0D] text-white text-center py-2'>FREE SHIPPING ON ALL HERMAN MILLER! FEB. 25–28. </div>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/" className="font-bold text-xl">Copilot Shop</Link>
          <Link to="/shop" className={`text-sm hover:text-blue-600 ${isActive('/shop') ? 'font-bold' : ''}`}>Shop</Link>
          <Link to="/favorites" className={`text-sm hover:text-blue-600 ${isActive('/favorites') ? 'font-bold' : ''}`}>Favorites</Link>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 mr-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            className="border rounded px-2 py-1 text-sm"
          />
          <button type="submit" className="bg-[#0D0D0D] text-white px-3 py-1 rounded text-sm hover:bg-[#5C5656]">
            Search
          </button>
        </form>

        <div className="flex items-center space-x-4">
          <Link to="/orders" className={`text-sm hover:text-blue-600 ${isActive('/orders') ? 'font-bold' : ''}`}>My Orders</Link>
          <Link to="/cart" className={`text-sm hover:text-blue-600 ${isActive('/cart') ? 'font-bold' : ''}`}>Cart ({cartCount})</Link>

          {user ? (
            <>
              <span className="text-sm font-semibold">{user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex space-x-2">
              <Link to="/login" className="text-sm bg-[#425E38] text-white px-3 py-1 rounded">
                Login
              </Link>
              <Link to="/signup" className="text-sm bg-[#39385E] text-white px-3 py-1 rounded">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
