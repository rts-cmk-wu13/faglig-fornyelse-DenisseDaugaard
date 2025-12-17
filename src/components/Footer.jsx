import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Footer(){
  const [email, setEmail] = useState('')

  function handleNewsletterSubmit(e){
    e.preventDefault()
    if(email){
      toast.success(`Thanks for subscribing with ${email}!`)
      setEmail('')
    }
  }

  return (
    <footer className="bg-white mt-12">
      {/* Newsletter Section */}
      <div className="border-t border-b py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-bold mb-2">Sign up for our newsletter</h2>
              <p className="text-gray-600 text-sm mb-4">Be the first to know about our special offers, news, and updates.</p>
              <form onSubmit={handleNewsletterSubmit} className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="flex-1 border px-4 py-2 rounded-l text-sm focus:outline-none"
                  required
                />
                <button type="submit" className="bg-black text-white px-6 py-2 rounded-r text-sm font-semibold hover:bg-gray-800">
                  Sign up
                </button>
              </form>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-3">About Us</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link to="#" className="hover:text-black">Our Story</Link></li>
                  <li><Link to="#" className="hover:text-black">Careers</Link></li>
                  <li><Link to="#" className="hover:text-black">Press</Link></li>
                  <li><Link to="#" className="hover:text-black">Blog</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Customer Care</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link to="#" className="hover:text-black">Contact Us</Link></li>
                  <li><Link to="#" className="hover:text-black">Shipping Info</Link></li>
                  <li><Link to="#" className="hover:text-black">Returns</Link></li>
                  <li><Link to="#" className="hover:text-black">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Legal</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link to="#" className="hover:text-black">Privacy Policy</Link></li>
                  <li><Link to="#" className="hover:text-black">Terms of Service</Link></li>
                  <li><Link to="#" className="hover:text-black">Cookie Policy</Link></li>
                  <li><Link to="#" className="hover:text-black">Accessibility</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="bg-black text-white py-6 text-center text-sm">
        © 2025 COPILOT SHOP. ALL RIGHTS RESERVED
      </div>
    </footer>
  )
}
