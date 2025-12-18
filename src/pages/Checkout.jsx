import { useRef, useEffect, useState } from 'react';
import { Form, useActionData } from 'react-router-dom';
import { getCart } from '../lib/storage';


export default function Checkout() {
  const actionData = useActionData();
  const values = actionData?.values ?? {};
  const errors = actionData?.errors ?? {};
  const step = actionData?.step ?? 1;
  const formRef = useRef();
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.qty * i.price, 0);
  const [paymentMethod, setPaymentMethod] = useState(values.payment || 'paypal');




  // Helper to submit the form for the current step
function handleStepSubmit(step) {
  if (!formRef.current) return;
  formRef.current.elements.step.value = String(step);
  formRef.current.requestSubmit();
}


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <main className="flex-1">
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Checkout Form */}
            <div className="flex-1 bg-white p-8 rounded shadow">
              <h1 className="text-3xl font-bold mb-8">Checkout</h1>
              <div className="flex mb-8">
                <div className={`font-semibold mr-8 ${step === 1 ? 'border-b-2 border-black' : 'text-gray-400'}`}>Address</div>
                <div className={`font-semibold mr-8 ${step === 2 ? 'border-b-2 border-black' : 'text-gray-400'}`}>Shipping</div>
                <div className={`font-semibold ${step === 3 ? 'border-b-2 border-black' : 'text-gray-400'}`}>Payment</div>
              </div>
              <Form method="post" ref={formRef} className="space-y-8">
                <input type="hidden" name="step" value={step} />
                {/* Step 1: Address */}
                {step === 1 && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <input type="text" name="firstName" placeholder="First Name" defaultValue={values.firstName || ''} className="w-full border px-3 py-2 rounded" />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName[0]}</p>}
                      </div>
                      <div>
                        <input type="text" name="lastName" placeholder="Last Name" defaultValue={values.lastName || ''} className="w-full border px-3 py-2 rounded" />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName[0]}</p>}
                      </div>
                    </div>
                    <input type="text" name="address" placeholder="Address" defaultValue={values.address || ''} className="w-full border px-3 py-2 rounded mb-4" />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address[0]}</p>}
                    <input type="text" name="apartment" placeholder="Apartment, suite, etc (optional)" defaultValue={values.apartment || ''} className="w-full border px-3 py-2 rounded mb-4" />
                    <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        defaultValue={values.city || ''}
                        className="w-full border px-3 py-2 rounded"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1">{errors.city[0]}</p>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        name="country"
                        placeholder="Country"
                        defaultValue={values.country || ''}
                        className="w-full border px-3 py-2 rounded"
                      />
                      {errors.country && (
                        <p className="text-red-500 text-xs mt-1">{errors.country[0]}</p>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        name="zipcode"
                        placeholder="Zipcode"
                        defaultValue={values.zipcode || ''}
                        className="w-full border px-3 py-2 rounded"
                      />
                      {errors.zipcode && (
                        <p className="text-red-500 text-xs mt-1">{errors.zipcode[0]}</p>
                      )}
                    </div>
                  </div>

                    <div className="flex items-center mb-4">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Save contact information</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStepSubmit(step)}
                      className="w-full bg-black text-white py-3 rounded font-semibold"
                    >
                      Continue to shipping
                    </button>


                  </div>
                )}
                {/* Step 2: Shipping */}
                {step === 2 && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">Shipping</h2>
                    <div className="space-y-4 mb-8">
                      <label className="flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50">
                        <input type="radio" name="shipping" value="ups" defaultChecked={values.shipping === 'ups' || !values.shipping} className="w-5 h-5" />
                        <div className="ml-4">
                          <p className="font-semibold">UPS/USPS Surepost</p>
                          <p className="text-sm text-gray-600">4-7 Business Days</p>
                        </div>
                      </label>
                      <label className="flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50">
                        <input type="radio" name="shipping" value="ground" defaultChecked={values.shipping === 'ground'} className="w-5 h-5" />
                        <div className="ml-4">
                          <p className="font-semibold">UPS Ground Shipping</p>
                          <p className="text-sm text-gray-600">3-5 Business Days</p>
                        </div>
                      </label>
                      {errors.shipping && <p className="text-red-500 text-xs mt-1">{errors.shipping[0]}</p>}
                    </div>
                  <button
                    type="button"
                    onClick={() => handleStepSubmit(step)}
                    className="w-full bg-black text-white py-3 rounded font-semibold"
                  >
                    Continue to payment
                  </button>


                  </div>
                )}
                {/* Step 3: Payment */}
                
                {step === 3 && (
  <div>
    <h2 className="text-xl font-bold mb-6">Payment</h2>

    {/* Payment method selector */}
    <div className="flex gap-3 mb-6">
      <label
        className={`flex-1 flex items-center p-3 border rounded cursor-pointer
          ${paymentMethod === 'paypal' ? 'border-black' : 'hover:bg-gray-50'}`}
      >
        <input
          type="radio"
          name="payment"
          value="paypal"
          checked={paymentMethod === 'paypal'}
          onChange={() => setPaymentMethod('paypal')}
          className="w-5 h-5"
        />
        <span className="ml-2 font-semibold">PayPal</span>
      </label>

      <label
        className={`flex-1 flex items-center p-3 border rounded cursor-pointer
          ${paymentMethod === 'card'
            ? 'bg-gray-900 text-white'
            : 'hover:bg-gray-50'}`}
      >
        <input
          type="radio"
          name="payment"
          value="card"
          checked={paymentMethod === 'card'}
          onChange={() => setPaymentMethod('card')}
          className="w-5 h-5"
        />
        <span className="ml-2 font-semibold">Credit Card</span>
      </label>
    </div>

    {/* PAYPAL */}
    {paymentMethod === 'paypal' && (
      <div className="mt-6">
        <p className="text-sm text-gray-600 mb-4">
          You will be redirected to PayPal to securely complete your payment.
        </p>

        <a
          href="https://www.paypal.com/signin"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-[#FFC439] text-black py-3 rounded font-semibold hover:bg-[#F5B400]"
        >
          Continue to PayPal
        </a>
      </div>
    )}

    {/* CREDIT CARD */}
    {paymentMethod === 'card' && (
      <>
        <div className="space-y-4">
          <input
            type="text"
            name="cardName"
            placeholder="Cardholder Name"
            defaultValue={values.cardName || ''}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.cardName && (
            <p className="text-red-500 text-xs">{errors.cardName[0]}</p>
          )}

          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            defaultValue={values.cardNumber || ''}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.cardNumber && (
            <p className="text-red-500 text-xs">{errors.cardNumber[0]}</p>
          )}

          <div className="grid grid-cols-3 gap-3">
            <select
              name="month"
              defaultValue={values.month || ''}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Month</option>
              {Array.from({ length: 12 }, (_, i) => {
                const month = String(i + 1).padStart(2, '0')
                return (
                  <option key={month} value={month}>
                    {month}
                  </option>
                )
              })}
            </select>

            <select
              name="year"
              defaultValue={values.year || ''}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Year</option>
              {Array.from({ length: 10 }, (_, i) => {
                const year = String(2025 + i)
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              })}
            </select>

            <input
              type="text"
              name="cvv"
              placeholder="CVC"
              defaultValue={values.cvv || ''}
              className="w-full border px-3 py-2 rounded"
              maxLength="4"
            />
          </div>

          {errors.cvv && (
            <p className="text-red-500 text-xs">{errors.cvv[0]}</p>
          )}

          <div className="flex items-center mt-2">
            <input type="checkbox" className="w-5 h-5" />
            <span className="ml-2 text-sm">
              Save card data for future payments
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded font-semibold mt-6"
        >
          Pay with card
        </button>
      </>
    )}
  </div>
)}

              </Form>
            </div>
            {/* Cart Summary */}
            <div className="w-full md:w-96 bg-white p-8 rounded shadow h-fit">
              <h2 className="text-lg font-bold mb-4">Your cart</h2>
              <div className="space-y-3 mb-6 pb-6 border-b">
                {cart.map(it => (
                  <div key={it.id} className="flex gap-3">
                <img src={it.thumbnail} alt={it.title} className="w-24 h-24 object-cover rounded" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{it.title}</p>
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
      </main>
    </div>
  );
}
