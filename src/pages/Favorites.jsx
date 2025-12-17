import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getFavs, toggleFav, getUser } from '../lib/storage'

export default function Favorites(){
  const [favs, setFavs] = useState(getFavs())
  const user = getUser()
  const navigate = useNavigate()

  useEffect(()=> setFavs(getFavs()), [user])

  function handleRemove(p){ 
    toggleFav(p)
    setFavs(getFavs())
  }

  if(!user){
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 mb-4">Please login to view your favorites.</p>
        <Link to="/login" className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
          Go to Login
        </Link>
      </div>
    )
  }

  if(favs.length === 0) return (
    <div className="text-center py-12">
      <p className="text-lg text-gray-600 mb-4">You haven't added any favorites yet.</p>
      <Link to="/shop" className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">Continue Shopping</Link>
    </div>
  )

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Favorite Items</h1>
      <p className="text-gray-600 mb-8">You have {favs.length} favorite item{favs.length !== 1 ? 's' : ''}</p>
      
      <div className="grid grid-cols-3 gap-6">
        {favs.map(f=> (
          <div key={f.id} className="bg-white rounded shadow overflow-hidden">
            <Link to={`/product/${f.id}`} className="block">
              <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden hover:scale-105 transition">
                <img src={f.thumbnail} alt={f.title} className="max-h-full max-w-full object-cover" />
              </div>
            </Link>
            <div className="p-4">
              <Link to={`/product/${f.id}`} className="block">
                <h3 className="font-semibold text-sm line-clamp-2 hover:text-blue-600">{f.title}</h3>
              </Link>
              <p className="text-blue-600 font-bold mt-2">${f.price}</p>
              <div className="mt-3 flex gap-2">
                <Link to={`/product/${f.id}`} className="flex-1 bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700 transition text-center">
                  View
                </Link>
                <button onClick={()=>handleRemove(f)} className="px-4 py-2 bg-red-100 text-red-600 text-sm rounded hover:bg-red-200 transition">
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
