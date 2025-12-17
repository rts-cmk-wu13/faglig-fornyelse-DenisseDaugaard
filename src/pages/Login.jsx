import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { loginSchema } from '../lib/schemas'
import { loginUser, setUser, continueAsGuest } from '../lib/storage'

export default function Login(){
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()

  function handleChange(e){
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if(errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    if(serverError) setServerError('')
  }

  function handleSubmit(e){
    e.preventDefault()
    setErrors({})
    setServerError('')

    const result = loginSchema.safeParse(formData)
    if(!result.success){
      const fieldErrors = {}
      result.error.errors.forEach(err => {
        fieldErrors[err.path[0]] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    // Validate against registered accounts
    const loginResult = loginUser(formData.email, formData.password)
    if(!loginResult.success){
      setServerError(loginResult.message)
      toast.error(loginResult.message)
      return
    }

    // Set user as logged in
    setUser(loginResult.user)
    toast.success(`Welcome back, ${loginResult.user.name}!`)
    navigate('/')
  }

  function handleGuestClick(){
    continueAsGuest()
    toast.success('Welcome! Browsing as guest')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h1 className="text-3xl font-bold text-center mb-2">Login</h1>
        <p className="text-center text-gray-600 mb-6">Sign in to your account</p>

        {serverError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••"
              className={`w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : ''}`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition mt-6"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={handleGuestClick}
            className="w-full bg-gray-500 text-white py-3 rounded font-semibold hover:bg-gray-600 transition"
          >
            Continue as Guest
          </button>
        </div>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
