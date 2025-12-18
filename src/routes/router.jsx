import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Shop, { loader as shopLoader } from '../pages/Shop'
import ProductDetails, { loader as productLoader } from '../pages/ProductDetails'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import { action as checkoutAction } from '../pages/checkoutAction'
import Orders from '../pages/Orders'
import Favorites from '../pages/Favorites'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'shop', element: <Shop />, loader: shopLoader },
      { path: 'product/:id', element: <ProductDetails />, loader: productLoader },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout />, action: checkoutAction },
      { path: 'orders', element: <Orders /> },
      { path: 'favorites', element: <Favorites /> }
    ]
  }
])

export default router
