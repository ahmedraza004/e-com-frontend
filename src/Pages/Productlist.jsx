import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";

function Productlist() {
    const [products, setProducts] = useState([]);
    const [cartId, setCartId] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            navigate('/login');
            return;
        }
        let userId;
        try {
            userId = jwtDecode(token).user_id;
        } catch {
            navigate('/login');
            return;
        }

        Promise.all([
            api.get('/products/'),
            api.get('/cart/', { headers: { Authorization: `Bearer ${token}` } })
        ])
            .then(([productsRes, cartRes]) => {
                setProducts(productsRes.data);
                const userCart = cartRes.data.find(cart => String(cart.user) === String(userId));
                if (userCart) {
                    setCartId(userCart.id);
                } else {
                    return api.post('/cart/', { user: userId }, {
                        headers: { Authorization: `Bearer ${token}` }
                    }).then(newCartRes => setCartId(newCartRes.data.id));
                }
            })
            .catch(() => navigate('/login'))
            .finally(() => setLoading(false));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate('/login');
    };

    const handleAddToCart = (productId) => {
        const token = localStorage.getItem("accessToken");
        if (!token || !cartId) {
            setMessage("Cart not found or not logged in!");
            return;
        }
        api.post(
            `/cart/${cartId}/add_item/`,
            { product_id: productId, quantity: 1 }, // Use 'product' if backend expects it
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(() => setMessage("Added to cart!"))
            .catch(() => setMessage("Failed to add to cart"));
    };

    if (loading) return <p>Loading…</p>;
    return (
        <>
            <main className="min-h-screen bg-gray-50 grid place-items-center px-4">
                <section className="w-full max-w-5xl grid gap-6 rounded-xl bg-white p-6 shadow ring-1 ring-gray-200">
                    <header className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">Product List</h2>
                        {message && <p className="text-red-500 mt-2">{message}</p>}
                    </header>

                    <ul className="grid gap-6 w-full">
                        {products.map((p) => (
                            <li key={p.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded shadow-sm">
                                {p.image && (
                                    <figure>
                                        <img src={p.image} alt={p.name} className="w-full h-40 object-cover rounded" />
                                    </figure>
                                )}
                                <div className="flex flex-col justify-between">
                                    <h3 className="text-xl font-semibold text-gray-900">{p.name}</h3>
                                    <p className="text-gray-700">Description: {p.description}</p>
                                    <p className="text-lg font-bold text-gray-800">Price: ${p.price}</p>
                                    <Link to={`/products/${p.id}/`} className="text-blue-600 hover:underline">
                                        Check Details
                                    </Link>
                                    <button
                                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                        onClick={() => handleAddToCart(p.id)}
                                        disabled={!cartId}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <button
                        className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-700"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </section>
            </main>
        </>


    );
}

export default Productlist;