import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const PrivacyPolicyPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-blue-50 to-amber-50 text-gray-900 overflow-hidden">
      <Header />
      <section className="relative min-h-screen flex flex-col items-center justify-center px-8 mt-30 mb-30">
        <div
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="mb-6">
            <span className="inline-block text-6xl animate-bounce">🔒</span>
          </div>
          <h1
            className="text-7xl font-black mb-8 bg-gradient-to-r from-gray-900 via-blue-600 to-amber-700 bg-clip-text text-transparent"
            style={{ lineHeight: "1.2" }}
          >
            Privacy Policy
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-amber-600 mx-auto mb-8 rounded-full"></div>
          <p className="text-xl md:text-2xl font-light text-gray-700 mb-12 leading-relaxed max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-blue-100 shadow-lg text-left mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Information We Collect</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Personal information you provide (name, email, etc.)</li>
              <li>Usage data (pages visited, actions taken)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
            <h2 className="text-2xl font-bold mb-4 text-blue-700">How We Use Your Information</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>To provide and improve our services</li>
              <li>To communicate with you about your account or donations</li>
              <li>To comply with legal obligations</li>
            </ul>
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Your Rights</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Access, update, or delete your personal information</li>
              <li>Opt out of marketing communications</li>
              <li>Request a copy of your data</li>
            </ul>
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Contact Us</h2>
            <p className="mb-2 text-gray-700">
              If you have any questions about this Privacy Policy, please contact us at <a href="https://mail.google.com/mail/?view=cm&to=jannyjonyo1@gmail.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">jannyjonyo1@gmail.com</a>.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
