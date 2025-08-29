import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

function Cart() {
    const [cart, setCart] = useState(null);
    const [cartId, setCartId] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) return navigate('/login');

        let userId;
        try {
            userId = jwtDecode(token).user_id;
        } catch {
            return navigate('/login');
        }

        api.get('/cart/', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => {
                const userCart = res.data.find(cart => String(cart.user) === String(userId));
                if (userCart) {
                    setCartId(userCart.id);
                    setCart(userCart);
                    calculateTotal(userCart.items);
                } else {
                    api.post('/cart/', { user: userId }, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                        .then((newCartRes) => {
                            setCartId(newCartRes.data.id);
                            setCart({ ...newCartRes.data, items: [] });
                            setTotalPrice(0);
                        })
                        .catch((e) => {
                            console.error("Can't create cart", e);
                            setMessage("Failed to create cart");
                        });
                }
            })
            .catch((err) => {
                console.error(err);
                if (err.response?.status === 401) navigate('/login');
            })
            .finally(() => setLoading(false));
    }, []);

    const calculateTotal = (items) => {
        const total = items.reduce(
            (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
            0
        );
        setTotalPrice(total);
    };

    const updateItemQuantity = (itemId, newQuantity) => {
        const token = localStorage.getItem("accessToken");
        if (!token || !cartId) return navigate('/login');

        if (newQuantity <= 0) {
            // Remove item
            api.delete(`/cart/${cartId}/remove_item/`, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
                ,
                data: { item_id: itemId }
            })
                .then((res) => {
                    setCart(res.data);
                    calculateTotal(res.data.items);
                    setMessage("Item removed from cart");
                })
                .catch((e) => {
                    console.error("Failed to remove item", e);
                    setMessage("Failed to remove item");
                });
        } else {
            // Update quantity
            api.patch(`/cart/${cartId}/update_item/`, {
                item_id: itemId,
                quantity: newQuantity
            }, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            })
                .then((res) => {
                    setCart(res.data);
                    calculateTotal(res.data.items);
                    setMessage("Quantity updated");
                })
                .catch((e) => {
                    console.error("Failed to update quantity", e);
                    setMessage("Failed to update quantity");
                });
        }
    };

    return (
        <>
            {loading && <p>Loading...</p>}
            {!loading && (!cart || cart.items.length === 0) && <p>Your cart is empty.</p>}
            {!loading && cart && cart.items.length > 0 && (
                <main className="min-h-screen bg-gray-50 px-4 py-6">
                    <section className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow ring-1 ring-gray-200">
                        <header className="text-center mb-6">
                            <h2 className='text-2xl font-bold text-gray-900'>Shopping Cart</h2>
                        </header>

                        <h1 className='text-3xl font-bold text-gray-950'>Items</h1>

                        {cart.items.map((item) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-4 gap-4 items-center border-b border-gray-200 py-4"
                            >
                                {/* Image Column */}
                                <div className="col-span-1">
                                    <img
                                        src={item.product.image}
                                        alt={item.product.name}
                                        className="w-24 h-24 object-cover rounded"
                                    />
                                </div>

                                {/* Product Info Column */}
                                <div className="col-span-2">
                                    <h2 className="text-xl font-semibold text-gray-900 my-2">
                                        {item.product.name}
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                        >
                                            −
                                        </button>
                                        <span className="text-lg font-medium">{item.quantity}</span>
                                        <button
                                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                               

                                {/* Price Column */}
                                <div className="col-span-1 text-lg font-bold text-gray-800">
                                    ${item.product.price}
                                </div>
                            </div>
                        ))}

                        <h2 className='text-4xl font-bold text-gray-900' >Total Price: {totalPrice}</h2>
                        {message && <p>{message}</p>}
                    </section>
                </main>
            )}

        </>
    );
}

export default Cart;
