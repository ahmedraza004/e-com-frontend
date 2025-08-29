import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return navigate('/login');

    api.get('/order/my_order/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setOrders(res.data))
      .catch(err => {
        console.error(err);
        setMessage("Failed to load orders");
      });
  }, []);

  const handleCancel = (orderId) => {
    const token = localStorage.getItem("accessToken");
    api.post(`/order/${orderId}/cancel/`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setMessage("Order cancelled");
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
      })
      .catch(err => {
        console.error(err);
        setMessage("Failed to cancel order");
      });
  };

  const handleFinalize = (orderId) => {
    const token = localStorage.getItem("accessToken");
    api.post(`/order/${orderId}/finalize/`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setMessage("Order finalized");
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'paid' } : o));
      })
      .catch(err => {
        console.error(err);
        setMessage("Failed to finalize order");
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Created: {order.created_at}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'paid' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status}
                </span>
              </div>

              <div className="flex gap-4">
                {order.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleCancel(order.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleFinalize(order.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Finalize
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
}

export default Orders;
