import { Link, useLoaderData } from 'react-router-dom'
import { useState } from 'react'
import { fetchProducts } from '../lib/api'

export async function loader() {
  const data = await fetchProducts(12)
  console.log(data);
  
  return data
}

export default function Shop() {
  const data = useLoaderData()
  const products = data?.products || []

  const [selectedCategories, setSelectedCategories] = useState([])

  function toggleCategory(category) {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const filteredProducts =
    selectedCategories.length === 0
      ? products
      : products.filter(p =>
          selectedCategories.includes(p.category)
        )

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* HEADER */}
      <section className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Shop</h1>
        <p className="text-gray-600">
          Browse our complete collection of quality products
        </p>
      </section>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* FILTERS (LEFT) */}
        <aside className="col-span-3">
          <div className="bg-white p-4 rounded shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Filters</h2>
              <button
                onClick={() => setSelectedCategories([])}
                className="text-sm text-gray-500 hover:underline"
              >
                Clear filters
              </button>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Categories</h3>

              {['beauty', 'fragrances', 'furniture'].map(cat => (
                <label
                  key={cat}
                  className="flex items-center gap-2 text-sm mb-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="accent-black"
                  />
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* PRODUCTS (RIGHT) */}
        <section className="col-span-9">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-600">
              Showing {filteredProducts.length} products
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {filteredProducts.map(p => (
              <Link
                to={`/product/${p.id}`}
                key={p.id}
                className="group"
              >
                <div className="bg-white rounded shadow overflow-hidden">
                  <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="max-h-full max-w-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="font-bold mt-2">${p.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p className="text-center text-gray-500 mt-10">
              No products match your filters.
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
