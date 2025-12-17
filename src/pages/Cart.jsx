import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCart, setCart, clearCart } from '../lib/storage'

export default function Cart(){
  const [items, setItems] = useState(getCart())

  useEffect(()=>{
    const handleCartChange = () => {
      setItems(getCart())
    }
    
    window.addEventListener('cart-storage-change', handleCartChange)
    return () => window.removeEventListener('cart-storage-change', handleCartChange)
  }, [])

  function updateQty(id, qty){
    const next = items.map(i => i.id === id ? { ...i, qty: Math.max(1, qty) } : i)
    setItems(next); setCart(next)
  }

  function remove(id){
    const next = items.filter(i=>i.id!==id)
    setItems(next); setCart(next)
  }

  const total = items.reduce((s,i)=>s + i.qty * i.price, 0)

  if(items.length === 0) return (
    <div className="text-center py-12">
      <p className="text-lg text-gray-600 mb-4">Your cart is empty.</p>
      <Link to="/shop" className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">Continue Shopping</Link>
    </div>
  )

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="col-span-2">
          <div className="space-y-4">
            {items.map(it => (
              <div key={it.id} className="flex gap-4 bg-white p-4 rounded shadow">
                <img src={it.thumbnail} alt={it.title} className="w-24 h-24 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-semibold">{it.title}</h3>
                  <p className="text-blue-600 font-bold mt-1">${it.price}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <button onClick={() => updateQty(it.id, it.qty - 1)} className="px-2 py-1 border rounded text-sm">−</button>
                    <input type="number" value={it.qty} min={1} onChange={(e)=>updateQty(it.id, Number(e.target.value))} className="w-12 border rounded px-2 py-1 text-center text-sm" />
                    <button onClick={() => updateQty(it.id, it.qty + 1)} className="px-2 py-1 border rounded text-sm">+</button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${(it.price * it.qty).toFixed(2)}</div>
                  <button onClick={()=>remove(it.id)} className="text-red-500 text-sm mt-2 hover:text-red-700">Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white p-6 rounded shadow h-fit">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4 pb-4 border-b">
            {items.map(it => (
              <div key={it.id} className="flex justify-between text-sm">
                <span>{it.title.slice(0, 20)}... x{it.qty}</span>
                <span>${(it.price * it.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mb-6">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-blue-600">${total.toFixed(2)}</span>
            </div>
          </div>
          <Link to="/checkout" className="w-full block text-center bg-green-600 text-white py-3 rounded font-semibold hover:bg-green-700 transition">
            Proceed to Checkout
          </Link>
          <button onClick={() => {setCart([]); setItems([])}} className="w-full mt-2 border border-gray-300 py-2 rounded text-sm hover:bg-gray-50">
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  )
}
