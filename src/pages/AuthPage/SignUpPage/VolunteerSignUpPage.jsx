import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const DonorSignUpPage = () => {
  const navigate = useNavigate();

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
        className="fixed top-6 left-6 bg-white border border-black text-black rounded-full p-2 shadow hover:bg-gray-100 transition"
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
          <h2 className="text-3xl font-medium text-black mb-4">Sign Up as a Volunteer</h2>
          <p className="text-gray-600 text-sm mb-6">
            Dedicate your time and skills to make a difference in the community. Join us in our mission to help those in need!
          </p>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  className="w-full mt-1 px-4 py-2 border border-black rounded-md shadow-sm"
                  placeholder="Vanessa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  className="w-full mt-1 px-4 py-2 border border-black rounded-md shadow-sm"
                  placeholder="Achieng"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                required
                className="w-full mt-1 px-4 py-2 border border-black rounded-md shadow-sm"
                placeholder="vanessachieng9@gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phone"
                required
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
                minLength={6}
                className="w-full mt-1 px-4 py-2 border border-black rounded-md shadow-sm"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Verification Documents</label>
              <input
                type="file"
                required
                accept=".pdf,.doc,.docx,.jpg,.png"
                className="w-full mt-1 border border-black rounded-md px-2 py-1"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 hover:brightness-110 transition text-white font-semibold rounded-md shadow transition"
              style={{ background: 'linear-gradient(to right, #000428, #004e92)' }}
            >
              Submit Application
            </button>
          </form>

          <p className="text-sm text-center text-black font-thin mt-6">
            Already have an account?{' '}
            <span
              onClick={() => navigate('/auth/signin/signin')}
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

export default DonorSignUpPage;
