import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SignInPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in both fields.');
      toast.error('Please fill in both fields.');
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        toast.success('Login successful!');
        const { role } = data;
        switch (role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'volunteer':
            navigate('/volunteer');
            break;
          case 'charity':
            navigate('/charity');
            break;
          case 'donor':
            navigate('/donate');
            break;
          default:
            navigate('/');
        }
      } else {
        setError(data.message || 'Login failed');
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      setError(error.message || 'An error occurred during login');
      toast.error(error.message || 'An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-blue-100 to-pink-100 p-4">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 bg-white border-1 border-black text-black rounded-full p-2 shadow hover:bg-gray-100 transition"
        aria-label="Go back"
      >
        <FiArrowLeft size={20} />
      </button>
      <div className="flex flex-col md:flex-row bg-white shadow-2xl overflow-hidden max-w-6xl w-full min-h-[575px]">

        {/* Left Image */}
        <div className="md:w-1/2 bg-white p-2 flex items-center justify-center h-[575px]">
          <img
            src="https://img.freepik.com/free-photo/hands-different-ethnicities-skin-color-coming-together-sign-diversity_23-2151763147.jpg?ga=GA1.1.1446853444.1749456613&semt=ais_items_boosted&w=740"
            alt="Hands"
            className="rounded-1xl object-cover w-full h-72 md:h-full"
          />
        </div>

        {/* Right Form */}
        <div className="md:w-1/2 px-35 flex flex-col justify-center relative">
          {/* Decorative Stars */}
          <span className="absolute top-20 left-20 text-5xl">✨</span>
          <span className="absolute bottom-20 right-20 text-5xl">✨</span>

          <h2 className="text-3xl font-extrabold font-sans text-gray-800 mb-6 text-center">Welcome Back!</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium font-sans text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                autoComplete="email"
                placeholder="janny.jonyo@strathmore.edu"

              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium font-sans text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full py-2 px-4 mt-4 hover:brightness-110 text-white font-semibold rounded-lg transition duration-300"
              style={{ background: "linear-gradient(to right,rgb(21, 122, 255), #1b53a7,rgb(54, 20, 243))" }}
            >
              Log In
            </button>
          </form>

          <p className="text-center text-sm font-thin mt-6 text-gray-700">
            No Account? No Problem!{' '}
            <span
              onClick={() => navigate('/auth/select')}
              className="text-indigo-600 hover:underline cursor-pointer font-medium"
            >
              Sign up
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default SignInPage;
