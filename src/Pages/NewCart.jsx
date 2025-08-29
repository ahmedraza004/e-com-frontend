import React, { useState, useEffect } from "react";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";

function NewCart({ products }) {
    const [cartId, setCartId] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;
        let userId;
        try {
            userId = jwtDecode(token).user_id;
        } catch {
            console.error("Failed to decode token");
            return;
        }
        api.get('/cart/', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
            const userCart = res.data.find(cart => String(cart.user) === String(userId));
            if (userCart) {
                setCartId(userCart.id);
            } else {
                api.post('/cart/', { user: userId }, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then((newCartRes) => setCartId(newCartRes.data.id))
                .catch(() => setMessage("Failed to create cart"));
            }
        })
        .catch(() => setMessage("Can't get cart"))
        .finally(() => setLoading(false));
    }, []);

    const handleAddToCart = (productId) => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;
        if (!cartId) {
            setMessage("Cart not found!");
            return;
        }
        api.post(
            `/cart/${cartId}/add_item/`,
            { product: productId, quantity: 1 }, // <-- FIXED KEY
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        )
        .then(() => setMessage("Added to cart!"))
        .catch((err) => {
            console.error("Add to cart error:", err.response?.data || err);
            if (err.response && err.response.data && err.response.data.product) {
                setMessage("Failed to add to cart: " + err.response.data.product.join(", "));
            } else if (err.response && err.response.data && err.response.data.detail) {
                setMessage("Failed to add to cart: " + err.response.data.detail);
            } else {
                setMessage("Failed to add to cart");
            }
        });
    };

    if (loading) return <p>Loading cart…</p>;
    return (
        <div>
            {message && <p>{message}</p>}
            <ul>
                {products.map((p) => (
                    <li key={p.id}>
                        <h2>{p.name}</h2>
                        <p>{p.description}</p>
                        <h2>{p.price}</h2>
                        <button
                            onClick={() => handleAddToCart(p.id)}
                            disabled={!cartId}
                        >
                            Add to Cart
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default NewCart;