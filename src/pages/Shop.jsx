import React from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { fetchProducts } from '../lib/api'

export async function loader(){
  const data = await fetchProducts(12)
  return data
}

export default function Shop(){
  const data = useLoaderData()
  const products = data?.products || []

  return (
    <div>
      <section className="mb-12">
        <h1 className="text-3xl font-bold text-center mb-2">Our Products</h1>
        <p className="text-center text-gray-600 mb-8">Browse our complete collection of quality products</p>
        
        <div className="grid grid-cols-3 gap-6">
          {products.map(p => (
            <Link to={`/product/${p.id}`} key={p.id} className="group">
              <div className="bg-white rounded shadow overflow-hidden">
                <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img src={p.thumbnail} alt={p.title} className="max-h-full max-w-full object-cover group-hover:scale-105 transition" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm line-clamp-2">{p.title}</h3>
                  <p className="text-blue-600 font-bold mt-2">${p.price}</p>
                  <div className="mt-3">
                    <button className="w-full bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700 transition">View</button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
