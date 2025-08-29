import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
function Registration() {
  // One state object for the whole form
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [successMessage, setSuccessMessage] = useState('');


  const navigate = useNavigate();

  // Update form fields dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({...f,[name]: value})); // update only the changed field

  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await api.post('register/', form);
    setSuccessMessage('Registration successful!');
    setTimeout(() => {
      navigate('/');
    }, 2000); // Delay navigation to show message
  } catch (error) {
    console.error(error);
    setSuccessMessage('Registation failled')
    alert('Registration failed');
  }
};


  return (
    <>
     <main className='min-h-screen bg-gray-50 grid place-items-center px-4'>
      <section className='w-full max-w-sm rounded-xl bg0white p-6 shadow-sm ring-1 ring-grey-200'>
        <h2 className='text-2xl font-semibold text-gray-900 text-center'>Register here</h2>
      <form className='mt-6 grid gap-5' onSubmit={handleSubmit}>
        <div className='grid gap-1'>
          <label className='text-sm font-medium text-gray-700 '>Username</label>
        <input
        className='block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />
        </div>

       <div className='grid gap-1'>
         <label className='text-sm font-medium text-gray-700 '>Email</label>
        <input
        className='block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          type="email"
          name="email"
          placeholder="abc@xyz.com"
          value={form.email}
          onChange={handleChange}
        />

       </div>
        <div className='grid gap-1'>
          <label className='text-sm font-medium text-gray-700 '>Password</label>
        <input
        className='block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        </div>
        <div className='grid gap-1'>

        <button className='mt-2 inline-flex justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white
         shadow transition hover:bg-blue-700 focus-visible: outline focus-visible:outline-2 
         focus-visible: outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed' type="submit">Submit</button>
        </div>
        <div className='grid gap-1'>
          <p className='text-sm text-gray-600'>Already have a Account?</p>
          <a  className= 'font-medium text-blue-600 hover:text-blue-700 active:text-blue-800 focus-visible:outline-none'href="/login">Login here</a>
        </div>
      </form>
      {successMessage && <p className="mt-4 text-sm font-medium text-green-700"style={{ color: 'green' }}>{successMessage}</p>}
      </section>
    </main>
    </>
   
    
  );
}

export default Registration;
