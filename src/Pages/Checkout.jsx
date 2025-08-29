import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Checkout() {
  const [cart, setCart] = useState(null);
  const [message, setMessage] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return navigate('/login');

    const userId = jwtDecode(token).user_id;

    api.get('/cart/', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const userCart = res.data.find(c => String(c.user) === String(userId));
      if (userCart) setCart(userCart);
    }).catch(err => {
      console.error(err);
      setMessage("Failed to load cart");
    });
  }, []);

  useEffect(() => {
    if (cart?.items?.length) {
      const total = cart.items.reduce((sum, item) => {
        return sum + (item.product?.price ?? 0) * item.quantity;
      }, 0);
      setTotalPrice(total);
    }
  }, [cart]);

  const handleCheckout = () => {
    const token = localStorage.getItem("accessToken");
    api.post(`/cart/${cart.id}/checkout/`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setMessage("Checkout successful!");
      navigate('/orders');
    }).catch(err => {
      console.error(err);
      setMessage("Checkout failed");
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="text-xl">←</button>
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        <span className="text-xl">🔒</span>
      </div>

      {/* Shipping Address */}
      <section className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Shipping Address</h2>
        <div className="bg-gray-100 h-16 rounded animate-pulse"></div>
      </section>

      {/* Payment Method */}
      <section className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Payment Method</h2>
        <div className="bg-gray-100 h-16 rounded animate-pulse"></div>
      </section>

      {/* Cart Items */}
      {cart ? (
        <>
          <ul className="mb-4">
            {cart.items.map(item => (
              <li key={item.id} className="flex justify-between py-2 border-b">
                <span>{item.product?.name} x {item.quantity}</span>
                <span>${(item.product?.price ?? 0) * item.quantity}</span>
              </li>
            ))}
          </ul>

          {/* Summary */}
          <div className="mb-6">
            <div className="flex justify-between text-gray-700 mb-1">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-1">
              <span>Shipping</span>
              <span>$5.00</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>${(totalPrice + 5).toFixed(2)}</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleCheckout}
            className="w-full bg-black text-white py-3 rounded-lg text-lg font-semibold"
          >
            Place Order
          </button>
        </>
      ) : (
        <p>Loading cart...</p>
      )}

      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
}

export default Checkout;