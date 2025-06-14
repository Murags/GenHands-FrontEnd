import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const DonorSignUpPage = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.password) {
      setError('Please fill in all fields.');
      toast.error('Please fill in all fields.');
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          password: form.password,
          role: 'donor',
          phoneNumber: form.phone
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Registration successful! Please log in.');
        // Optionally, save token and redirect
        localStorage.setItem('token', data.token);
        navigate('/auth/signin/signin');
      } else {
        setError(data.message || 'Registration failed');
        toast.error(data.message || 'Registration failed');
      }
    } catch {
      setError('Network error');
      toast.error('Network error');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center font-sans px-4 py-10"
      style={{
        background:
          'linear-gradient(90deg, #1f4037, #99f2c8)',
      }}
    >
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 bg-white border border-black text-black rounded-full p-2 shadow hover:bg-gray-100 transition"
        aria-label="Go back"
      >
        <FiArrowLeft size={20} />
      </button>

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left: Image */}
        <div className="hidden md:block h-full">
          <img
            src="https://img.freepik.com/free-photo/female-volunteer-standing-with-donation-box_1170-1811.jpg?ga=GA1.1.1058639554.1749533826&semt=ais_items_boosted&w=740"
            alt="Donor"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right: Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-medium text-black mb-4">Sign Up as a Donor</h2>
          <p className="text-gray-600 text-sm mb-6">
            Join us in giving back to the community. Your generosity makes a big difference!
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 border border-black rounded-md shadow-sm"
                  placeholder="Abigail"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 border border-black rounded-md shadow-sm"
                  placeholder="Mugambi"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border border-black rounded-md shadow-sm"
                placeholder="abigailmugambi7@gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phone"
                required
                value={form.phone}
                onChange={handleChange}
                pattern="^\+254[0-9]{9}$"
                title="Enter a valid phone number"
                className="w-full mt-1 px-4 py-2 border border-black rounded-md shadow-sm"
                placeholder="+254 712 345 678 (without spaces)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                minLength={6}
                className="w-full mt-1 px-4 py-2 border border-black rounded-md shadow-sm"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 px-4 hover:brightness-110 transition text-white font-semibold rounded-md shadow transition"
              style={{ background: 'linear-gradient(to right, #1f4037, #99f2c8)' }}
            >
              Create Account
            </button>
          </form>

          <p className="text-sm text-center font-thin text-black mt-6">
            Already have an account?{' '}
            <span
              onClick={() => navigate('/auth/signin/signin')}
              className="hover:underline cursor-pointer font-medium"
              style={{ color: '#1f4037' }}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonorSignUpPage;
