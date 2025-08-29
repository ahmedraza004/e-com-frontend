import { useState } from 'react'
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'
import Register from './Pages/Registration'
import LoginPage from './Pages/LoginPage'
import Registration from './Pages/Registration'
import Productlist from './Pages/Productlist'
import ProductDetail from './Pages/ProductDetail'
import Cart from './Pages/Cart'
import Checkout from './Pages/Checkout'
import Orders from './Pages/Order'
function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/products" replace />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/products/" element={<Productlist/>} />
      <Route path="/products/:id" element={<ProductDetail/>} />
      <Route path="/cart/" element={<Cart/>} />
      <Route path="/checkout/" element={<Checkout/>} />
      <Route path="/order/" element={<Orders/>} />
    </Routes>
    </BrowserRouter>
     
    </>
  )
}

export default App

