import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../lib/api'

export default function Home(){
  const [slides, setSlides] = useState([])
  const [products, setProducts] = useState([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts(12).then(data => {
      const allProducts = data.products || []
      setSlides(allProducts.slice(0, 3))
      setProducts(allProducts.slice(0, 6))
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if(slides.length === 0) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [slides.length])

  function prev(){ setCurrent(prev => (prev - 1 + slides.length) % slides.length) }
  function next(){ setCurrent(prev => (prev + 1) % slides.length) }
  function goTo(idx){ setCurrent(idx) }

  return (
    <div>
      {/* Carousel Hero */}
      <section className="mb-12 relative">
        {loading ? (
          <div className="h-80 bg-gray-300 rounded flex items-center justify-center">Loading...</div>
        ) : (
          <div className="relative h-80 bg-gray-200 rounded overflow-hidden">
            <div className="relative h-full flex">
              {slides.map((slide, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-500 ${idx === current ? 'opacity-100' : 'opacity-0'}`}
                >
                  <img src={slide.thumbnail} alt={slide.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-end">
                    <div className="text-white p-6">
                      <h2 className="text-2xl font-bold">{slide.title}</h2>
                      <p className="text-sm mt-1">${slide.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black px-3 py-2 rounded">
              ❮
            </button>
            <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black px-3 py-2 rounded">
              ❯
            </button>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className={`w-3 h-3 rounded-full transition ${idx === current ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-2">Categories</h2>
        <p className="text-center text-gray-600 mb-6">Browse our featured products</p>
        <div className="grid grid-cols-3 gap-6">
          {products.slice(0, 3).map(prod => (
            <Link to={`/product/${prod.id}`} key={prod.id} className="group">
              <div className="h-40 bg-gray-200 rounded overflow-hidden mb-3">
                <img src={prod.thumbnail} alt={prod.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
              </div>
              <h3 className="font-semibold text-center text-sm">{prod.category || 'Product'}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Arrivals */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-center mb-2">Our latest arrivals</h2>
        <p className="text-center text-gray-600 mb-6">Discover new products</p>
        <div className="grid grid-cols-3 gap-6">
          {products.slice(3, 6).map((prod, idx) => (
            <Link to={`/product/${prod.id}`} key={prod.id} className="group">
              <div className={`bg-gray-200 rounded overflow-hidden mb-3 ${idx === 1 ? 'h-56' : 'h-48'}`}>
                <img src={prod.thumbnail} alt={prod.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-sm">{prod.title.slice(0, 30)}...</h3>
                <p className="text-blue-600 text-sm mt-1">${prod.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="text-center mt-8">
        <Link to="/shop" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Shop all</Link>
      </div>
    </div>
  )
}
