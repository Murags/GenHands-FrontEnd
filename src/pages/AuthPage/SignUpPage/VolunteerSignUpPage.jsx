import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../../../hooks/useAuth';

const VolunteerSignUpPage = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();
  const { registerVolunteer, isLoading, error, clearError } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    clearError();
  };

  const handleFileChange = (e) => {
    setDocuments(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.password) {
      return;
    }
    if (!documents || documents.length === 0) {
      return;
    }

    try {
      await registerVolunteer(form, documents);
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
          'linear-gradient(90deg, #000428, #004e92)',
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
            src="https://img.freepik.com/premium-photo/unrecognizable-volunteers-packing-donated-food-cardboard-boxes_1042628-539127.jpg?ga=GA1.1.945242128.1749565530&semt=ais_items_boosted&w=740"
            alt="Donor"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right: Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-serif font-medium text-black mb-4">Sign Up as a Volunteer</h2>
          <p className="text-black text-sm mb-6">
            Dedicate your time and skills to make a difference in the community. Join us in our mission to help those in need!
          </p>

          <form className="space-y-5" onSubmit={handleSubmit} encType="multipart/form-data">
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
                  placeholder="Vanessa"
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
                  placeholder="Achieng"
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
                placeholder="vanessachieng9@gmail.com"
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
                minLength={6}
                value={form.password}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border border-black rounded-md shadow-sm text-black"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Upload Verification Documents</label>
              <input
                type="file"
                required
                accept=".pdf,.doc,.docx,.jpg,.png"
                onChange={handleFileChange}
                className="cursor-pointer w-full mt-1 border border-black rounded-md px-2 py-1 text-black"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer w-full py-3 px-4 hover:brightness-110 transition text-white font-semibold rounded-md shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(to right, #000428, #004e92)' }}
            >
              {isLoading ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </form>

          <p className="text-sm text-center text-black font-thin mt-6">
            Already have an account?{' '}
            <span
              onClick={() => navigate('/auth/signin')}
              className="hover:underline cursor-pointer font-medium"
              style={{ color: '#004e92' }}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VolunteerSignUpPage;
