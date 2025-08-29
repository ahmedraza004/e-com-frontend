import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
function LoginPage() {
  const [form, setForm] = useState({
    username: '',
    password: ''
  })
  const [message, setMessage] = useState('')
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('token/', form)
      const access = response.data.access;
      const refresh = response.data.refresh;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      setMessage('Login Successfull');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error(error);
      alert("Login Failled")
      setMessage("Invalid creditials")
    }
  }

  return (
    <>
   
    <main className="min-h-screen bg-gray-50 grid place-items-center px-4">
      <section className="w-full max-w-sm rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900 text-center">Login</h1>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="grid gap-1">
            <label htmlFor="username" className="text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              type="text"
              name="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>

          {/* Password */}
          <div className="grid gap-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 inline-flex justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white
                       shadow transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2
                       focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Login
          </button>

          {/* Register hint */}
          <p className="text-sm text-gray-600">
            Don’t have an account?{' '} 
            <a
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-700 active:text-blue-800 focus-visible:outline-none"
            >
              Register here
            </a>
          </p>
        </form>

        {message && (
          <p
            role="status"
            aria-live="polite"
            className="mt-4 text-sm font-medium text-green-700"
          >
            {message}
          </p>
        )}
      </section>
    </main>


    </>
  );
}
export default LoginPage;
