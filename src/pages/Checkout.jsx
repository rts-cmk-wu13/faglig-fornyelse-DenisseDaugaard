import React from 'react'
import { Form, redirect } from 'react-router-dom'
import { checkoutSchema } from '../lib/schemas'
import { getCart, clearCart, getUser, saveOrder } from '../lib/storage'

export async function action({ request }){
  const form = await request.formData()
  const data = Object.fromEntries(form)

  const parse = checkoutSchema.safeParse(data)
  if(!parse.success){
    return { errors: parse.error.flatten() }
  }

  const user = getUser()
  if(!user) return redirect('/')

  const cart = getCart()
  const order = { id: Date.now(), userId: user.id, customer: data, items: cart, createdAt: new Date().toISOString() }
  saveOrder(order)
  clearCart()
  return redirect('/orders')
}

export default function Checkout(){
  const cart = getCart()
  const total = cart.reduce((s,i)=>s + i.qty * i.price, 0)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
          <Form method="post" className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">Full Name *</label>
              <input name="name" required className="w-full border px-3 py-2 rounded focus:outline-blue-500" placeholder="John Doe" />
            </div>
            <div>
              <label className="block font-semibold mb-2">Address *</label>
              <input name="address" required className="w-full border px-3 py-2 rounded focus:outline-blue-500" placeholder="123 Main St" />
            </div>
            <div>
              <label className="block font-semibold mb-2">City *</label>
              <input name="city" required className="w-full border px-3 py-2 rounded focus:outline-blue-500" placeholder="New York" />
            </div>
            <div>
              <label className="block font-semibold mb-2">Postal Code *</label>
              <input name="postal" required className="w-full border px-3 py-2 rounded focus:outline-blue-500" placeholder="10001" />
            </div>
            <button type="submit" className="w-full mt-6 bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition">
              Place Order
            </button>
          </Form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6 pb-6 border-b">
              {cart.map(it => (
                <div key={it.id} className="flex justify-between text-sm">
                  <span>{it.title.slice(0, 25)}... x{it.qty}</span>
                  <span>${(it.price * it.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-3">
                <span>Total:</span>
                <span className="text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
