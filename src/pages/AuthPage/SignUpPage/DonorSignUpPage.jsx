import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../../../hooks/useAuth';

const DonorSignUpPage = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });
  const navigate = useNavigate();
  const { registerDonor, isLoading, error, clearError } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.password) {
      return;
    }

    try {
      await registerDonor(form);
    } catch (err) {
      // Error is already handled by the hook
      console.error('Registration error:', err);
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
        className="cursor-pointer fixed top-6 left-6 bg-white border border-black text-black rounded-full p-2 shadow hover:bg-gray-100 transition"
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
          <p className="text-black text-sm mb-6">
            Join us in giving back to the community. Your generosity makes a big difference!
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 border border-black rounded-md shadow-sm text-black"
                  placeholder="Abigail"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 border border-black rounded-md shadow-sm text-black"
                  placeholder="Mugambi"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border border-black rounded-md shadow-sm text-black"
                placeholder="abigailmugambi7@gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Phone Number</label>
              <input
                type="tel"
                name="phone"
                required
                value={form.phone}
                onChange={handleChange}
                pattern="^\+254[0-9]{9}$"
                title="Enter a valid phone number"
                className="w-full mt-1 px-4 py-2 border border-black rounded-md shadow-sm text-black"
                placeholder="+254 712 345 678 (without spaces)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Password</label>
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                minLength={6}
                className="w-full mt-1 px-4 py-2 border border-black rounded-md shadow-sm text-black"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer w-full py-3 px-4 hover:brightness-110 transition text-white font-semibold rounded-md shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(to right, #1f4037, #99f2c8)' }}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-sm text-center font-thin text-black mt-6">
            Already have an account?{' '}
            <span
              onClick={() => navigate('/auth/signin')}
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
