import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const TermsPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
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
          <div className="mb-8">
            <span className="inline-block text-6xl animate-bounce">📜</span>
          </div>
          <h1 
            className="text-7xl font-black mb-8 bg-gradient-to-r from-gray-900 via-blue-600 to-amber-700 bg-clip-text text-transparent"
            sylte = {{ lineHeight: "1.2" }}
          >
            Terms & Conditions
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-amber-600 mx-auto mb-8 rounded-full"></div>
          <p className="text-xl md:text-2xl font-light text-gray-700 mb-12 leading-relaxed max-w-3xl mx-auto">
            Please read these terms and conditions carefully before using our website or services.
          </p>
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-blue-100 shadow-lg text-left mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Acceptance of Terms</h2>
            <p className="mb-6 text-gray-700">
              By accessing or using our website, you agree to be bound by these terms and conditions.
            </p>
            <h2 className="text-2xl font-bold mb-4 text-blue-700">User Responsibilities</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Provide accurate and current information</li>
              <li>Do not misuse or attempt to disrupt our services</li>
              <li>Respect the rights of other users</li>
            </ul>
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Intellectual Property</h2>
            <p className="mb-6 text-gray-700">
              All content, trademarks, and data on this site are the property of Generous Hands or its partners.
            </p>
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Limitation of Liability</h2>
            <p className="mb-6 text-gray-700">
              We are not liable for any damages arising from the use or inability to use our services.
            </p>
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Changes to Terms</h2>
            <p className="mb-6 text-gray-700">
              We reserve the right to update these terms at any time. Continued use of the site means you accept the changes.
            </p>
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Contact Us</h2>
            <p className="mb-2 text-gray-700">
              For questions about these terms, contact us at <a href="https://mail.google.com/mail/?view=cm&to=jannyjonyo1@gmail.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">jannyjonyo1@gmail.com</a>.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default TermsPage;
