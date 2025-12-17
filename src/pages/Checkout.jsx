import React, { useState } from 'react'
import { redirect, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
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
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', 
    address: '', apartment: '', city: '', country: '', zipcode: '',
    shipping: 'ups', payment: 'paypal', cardName: '', cardNumber: '', month: '', year: '', cvv: ''
  })
  const navigate = useNavigate()
  
  const cart = getCart()
  const total = cart.reduce((s,i)=>s + i.qty * i.price, 0)

  function handleChange(e){
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  function handleNext(){
    if(step === 1){
      if(!formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.zipcode){
        toast.error('Please fill all address fields')
        return
      }
    }
    if(step < 3) setStep(step + 1)
  }

  function handlePrev(){
    if(step > 1) setStep(step - 1)
  }

  async function handleSubmit(){
    const user = getUser()
    if(!user){
      navigate('/')
      return
    }

    const order = { 
      id: Date.now(), 
      userId: user.id, 
      customer: { 
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        zipcode: formData.zipcode
      }, 
      items: cart,
      shipping: formData.shipping,
      payment: formData.payment,
      createdAt: new Date().toISOString() 
    }
    saveOrder(order)
    clearCart()
    toast.success('Order placed successfully!')
    navigate('/orders')
  }

  return (
    <div>
      {/* Progress Steps */}
      <div className="mb-8 flex items-center justify-between max-w-md">
        <div className={`flex-1 h-1 ${step >= 1 ? 'bg-black' : 'bg-gray-300'}`} />
        <span className={`px-3 font-semibold ${step >= 1 ? '' : 'text-gray-400'}`}>Address</span>
        <div className={`flex-1 h-1 ${step >= 2 ? 'bg-black' : 'bg-gray-300'}`} />
        <span className={`px-3 font-semibold ${step >= 2 ? '' : 'text-gray-400'}`}>Shipping</span>
        <div className={`flex-1 h-1 ${step >= 3 ? 'bg-black' : 'bg-gray-300'}`} />
        <span className={`px-3 font-semibold ${step >= 3 ? '' : 'text-gray-400'}`}>Payment</span>
      </div>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white p-6 rounded shadow">
          
          {/* Step 1: Address */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    name="firstName" 
                    placeholder="First Name" 
                    value={formData.firstName}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded focus:outline-blue-500"
                  />
                  <input 
                    type="text" 
                    name="lastName" 
                    placeholder="Last Name" 
                    value={formData.lastName}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded focus:outline-blue-500"
                  />
                </div>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Email" 
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:outline-blue-500"
                />
                <input 
                  type="text" 
                  name="address" 
                  placeholder="Address" 
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:outline-blue-500"
                />
                <input 
                  type="text" 
                  name="apartment" 
                  placeholder="Apartment, suite etc (optional)" 
                  value={formData.apartment}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:outline-blue-500"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    name="city" 
                    placeholder="City" 
                    value={formData.city}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded focus:outline-blue-500"
                  />
                  <input 
                    type="text" 
                    name="country" 
                    placeholder="Country" 
                    value={formData.country}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded focus:outline-blue-500"
                  />
                </div>
                <input 
                  type="text" 
                  name="zipcode" 
                  placeholder="Zipcode" 
                  value={formData.zipcode}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:outline-blue-500"
                />
              </div>
            </div>
          )}

          {/* Step 2: Shipping */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-6">Shipping Method</h2>
              <div className="space-y-3">
                <label className="flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50">
                  <input 
                    type="radio" 
                    name="shipping" 
                    value="ups" 
                    checked={formData.shipping === 'ups'}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  <div className="ml-4">
                    <p className="font-semibold">UPS/USPS Surepost</p>
                    <p className="text-sm text-gray-600">4-7 Business Days</p>
                  </div>
                </label>
                <label className="flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50">
                  <input 
                    type="radio" 
                    name="shipping" 
                    value="ground" 
                    checked={formData.shipping === 'ground'}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  <div className="ml-4">
                    <p className="font-semibold">UPS Ground Shipping</p>
                    <p className="text-sm text-gray-600">3-5 Business Days</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-6">Payment Details</h2>
              <div className="mb-6 flex gap-3">
                <label className="flex-1 flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="paypal" 
                    checked={formData.payment === 'paypal'}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  <span className="ml-2 font-semibold">PayPal</span>
                </label>
                <label className="flex-1 flex items-center p-3 border rounded bg-gray-900 text-white cursor-pointer">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="card" 
                    checked={formData.payment === 'card'}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  <span className="ml-2 font-semibold">Credit Card</span>
                </label>
              </div>
              
              {formData.payment === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Cardholder Name</label>
                    <input 
                      type="text" 
                      name="cardName" 
                      placeholder="Name on card" 
                      value={formData.cardName}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded focus:outline-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Card Number</label>
                    <input 
                      type="text" 
                      name="cardNumber" 
                      placeholder="1234 5678 9012 3456" 
                      value={formData.cardNumber}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded focus:outline-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Month</label>
                      <select name="month" value={formData.month} onChange={handleChange} className="w-full border px-3 py-2 rounded focus:outline-blue-500">
                        <option value="">Month</option>
                        {Array.from({length: 12}, (_, i) => (
                          <option key={i+1} value={i+1}>{String(i+1).padStart(2, '0')}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Year</label>
                      <select name="year" value={formData.year} onChange={handleChange} className="w-full border px-3 py-2 rounded focus:outline-blue-500">
                        <option value="">Year</option>
                        {Array.from({length: 10}, (_, i) => (
                          <option key={i} value={2025 + i}>{2025 + i}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">CVV</label>
                      <input 
                        type="text" 
                        name="cvv" 
                        placeholder="123" 
                        value={formData.cvv}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded focus:outline-blue-500"
                        maxLength="4"
                      />
                    </div>
                  </div>
                  <label className="flex items-center">
                    <input type="checkbox" className="w-5 h-5" />
                    <span className="ml-2 text-sm">Save card data for future payments</span>
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t">
            {step > 1 && (
              <button onClick={handlePrev} className="px-6 py-3 border rounded hover:bg-gray-50 font-semibold">
                Back
              </button>
            )}
            {step < 3 ? (
              <button onClick={handleNext} className="flex-1 bg-black text-white py-3 rounded font-semibold hover:bg-gray-800">
                Continue to {step === 1 ? 'shipping' : 'payment'}
              </button>
            ) : (
              <button onClick={handleSubmit} className="flex-1 bg-black text-white py-3 rounded font-semibold hover:bg-gray-800">
                Pay with {formData.payment === 'paypal' ? 'PayPal' : 'card'}
              </button>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white p-6 rounded shadow sticky top-6">
            <h2 className="text-lg font-bold mb-4">Your cart</h2>
            <div className="space-y-3 mb-6 pb-6 border-b">
              {cart.map(it => (
                <div key={it.id} className="flex gap-3">
                  <img src={it.thumbnail} alt={it.title} className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{it.title.slice(0, 25)}...</p>
                    <p className="text-sm text-gray-600">Size: L</p>
                    <p className="text-sm">Quantity: {it.qty}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(it.price * it.qty).toFixed(2)}</p>
                    <button className="text-blue-600 text-xs hover:underline">Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>Calculated at next step</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-lg pt-4 border-t">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <input type="text" placeholder="Enter coupon code here" className="w-full border px-3 py-2 rounded mt-4 text-sm" />
          </div>
        </div>
      </div>
    </div>
  )
}
