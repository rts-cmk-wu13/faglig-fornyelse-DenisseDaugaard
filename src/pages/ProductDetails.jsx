import React, { useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { fetchProductById } from '../lib/api'
import { addToCart, toggleFav, getFavs } from '../lib/storage'

export async function loader({ params }){
  const product = await fetchProductById(params.id)
  return product
}

export default function ProductDetails(){
  const product = useLoaderData()
  const [qty, setQty] = useState(1)
  const [isFav, setIsFav] = useState(getFavs().some(f => f.id === product.id))
  const navigate = useNavigate()

  function handleAdd(){
    addToCart({ id: product.id, title: product.title, price: product.price, thumbnail: product.thumbnail }, qty)
    alert('Added to cart')
  }

  function handleFav(){
    toggleFav({ id: product.id, title: product.title, price: product.price, thumbnail: product.thumbnail })
    setIsFav(!isFav)
  }

  return (
    <div>
      <button onClick={() => navigate(-1)} className="text-blue-600 mb-4">← Back</button>
      
      <div className="grid grid-cols-2 gap-8 bg-white p-6 rounded shadow">
        {/* Image */}
        <div className="flex items-center justify-center bg-gray-100 rounded">
          <img src={product.thumbnail} alt={product.title} className="max-w-full max-h-96" />
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          
          <div className="mb-4">
            <span className="text-lg text-gray-600">Rating: </span>
            <span className="text-lg font-semibold">{product.rating ? product.rating.toFixed(1) : 'N/A'} ⭐</span>
          </div>

          <div className="mb-6">
            <span className="text-3xl font-bold text-blue-600">${product.price}</span>
            {product.discountPercentage && (
              <span className="ml-2 text-sm text-red-600">-{product.discountPercentage}%</span>
            )}
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-semibold">Quantity:</label>
            <input 
              type="number" 
              min={1} 
              value={qty} 
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              className="w-20 border px-3 py-2 rounded"
            />
          </div>

          <div className="flex gap-3 mb-6">
            <button onClick={handleAdd} className="flex-1 bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition">
              Add to cart
            </button>
            <button onClick={handleFav} className={`px-6 py-3 rounded font-semibold transition ${isFav ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
              {isFav ? '❤️' : '🤍'}
            </button>
          </div>

          {product.stock !== undefined && (
            <div className="text-sm">
              <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stock > 0 ? `In stock (${product.stock})` : 'Out of stock'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
