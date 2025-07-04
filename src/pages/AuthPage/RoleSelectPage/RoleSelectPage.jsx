import React, { useState } from 'react';
import { FaHandHoldingHeart, FaHome, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import Logo from '../../../assets/Logo.png';

const roles = [
  {
    id: 'donor',
    title: "I'm a Donor",
    title2: 'Donor',
    description: 'I want to give back to the community because I care',
    icon: <FaHandHoldingHeart size={40} />,
  },
  {
    id: 'charity',
    title: "I'm a Charity",
    title2: 'Charity',
    description: 'I need donations to support my cause',
    icon: <FaHome size={40} />,
  },
  {
    id: 'volunteer',
    title: "I'm a Volunteer",
    title2: 'Volunteer',
    description: 'I want to offer my time and skills in something worthwhile',
    icon: <FaUsers size={40} />,
  },
];

const RoleSelectPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole) {
      navigate(`/auth/signup/${selectedRole}`);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-10 font-sans">
      {/* Top-left Logo */}
      <Link to="/">
        <img src={Logo} alt="Logo" className="fixed top-4 left-4 h-16 w-auto cursor-pointer" />
      </Link>

      <h2 className="text-center text-3xl font-sans font-semibold text-black mb-12">
        Hey! Do we know you from somewhere? 😅
      </h2>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {roles.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <motion.div
              key={role.id}
              className={`relative cursor-pointer border rounded-xl p-6 text-center transition-shadow ${
                isSelected
                  ? 'border-green-600 bg-green-50 shadow-lg'
                  : 'border-black hover:shadow-md'
              }`}
              onClick={() => setSelectedRole(role.id)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Circle top right */}
              <div
                className={`absolute top-4 right-4 h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-green-600' : 'border-black'
                }`}
              >
                {isSelected && (
                  <div className="h-3 w-3 rounded-full bg-green-600" />
                )}
              </div>

              <div className="flex justify-center mb-4 text-black">
                {role.icon}
              </div>
              <h4 className="text-lg font-semibold font-sans text-black mb-1">
                {role.title}
              </h4>
              <p className="text-sm text-gray-700">{role.description}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        disabled={!selectedRole}
        onClick={handleContinue}
        className={`cursor-pointer w-full max-w-md mt-12 py-3 rounded-md font-semibold text-white transition ${
          selectedRole
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        {selectedRole
          ? `Continue as ${roles.find((r) => r.id === selectedRole)?.title2}`
          : 'Select a role to continue'}
      </motion.button>

      <p className="text-center text-base font-thin mt-6 text-black">
        Already have an account?{' '}
        <Link to="/auth/signin" className="text-green-600 font-thin hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default RoleSelectPage;
