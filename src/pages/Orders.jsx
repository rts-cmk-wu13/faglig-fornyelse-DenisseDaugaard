import React from 'react'
import { getUser, getOrders } from '../lib/storage'

export default function Orders(){
  const user = getUser()
  if(!user) return (
    <div className="text-center py-12">
      <p className="text-lg text-gray-600">Please login to see your orders.</p>
    </div>
  )

  const orders = getOrders().filter(o => o.userId === user.id)

  if(orders.length === 0) return (
    <div className="text-center py-12">
      <p className="text-lg text-gray-600">You haven't placed any orders yet.</p>
    </div>
  )

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      <div className="space-y-6">
        {orders.map(o => (
          <div key={o.id} className="bg-white p-6 rounded shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-bold">Order #{o.id}</h2>
                <p className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  ${o.items.reduce((s,i)=>s + i.qty * i.price, 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>

            <div className="mb-4 pb-4 border-b">
              <h3 className="font-semibold mb-3">Items:</h3>
              <div className="space-y-2">
                {o.items.map(it=> (
                  <div key={it.id} className="flex justify-between text-sm">
                    <span className="flex-1">{it.title}</span>
                    <span className="ml-4">{it.qty}x</span>
                    <span className="w-24 text-right">${(it.price * it.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-sm">
              <p><strong>Shipped to:</strong> {o.customer.name}</p>
              <p className="text-gray-600">{o.customer.address}, {o.customer.city} {o.customer.postal}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
