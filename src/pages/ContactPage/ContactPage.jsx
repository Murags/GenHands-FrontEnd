import React, { useState, useEffect } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import emailjs from 'emailjs-com';

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount
    // Trigger the animation after mount
    setTimeout(() => setShowForm(true), 100);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs.sendForm('service_2ltxgqe', 'template_rjuqote', e.target, 'Mrohe2aLF4bupcKlX')
    .then(() => {
        setSubmitted(true);
    }, () => {
        alert('Something went wrong. Please try again.');
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-blue-50 to-amber-50 text-gray-900">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-16 pt-32">
        <div
          className={`max-w-3xl w-full bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-blue-100
            transform transition-all duration-700 ease-out
            ${
              showForm
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-16"
            }
          `}
        >
          <h1 className="text-6xl font-bold text-center mb-9 text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-amber-700 bg-clip-text">
            Contact Us
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-amber-600 mx-auto mb-8 rounded-full"></div>
          <p className="text-center text-lg text-gray-700 mb-8">
            We'd love to hear from you! Whether you have a question, feedback,
            or just want to say hello, our team is ready to help.
          </p>
          <div className="flex justify-center mb-8">
            <span className="text-5xl animate-bounce">📬</span>
          </div>
          {submitted ? (
            <div className="text-center text-green-600 text-xl font-semibold py-8">
              Thank you for reaching out! We'll get back to you soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                  Name
                </label>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  type="text"
                  id="name"
                  name="name" // <-- matches {{name}}
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                  Email
                </label>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  type="email"
                  id="email"
                  name="email" // <-- matches {{email}}
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
                  Message
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
                  id="message"
                  name="message" // <-- matches {{message}}
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  required
                  placeholder="How can we help you?"
                />
              </div>
              <button
                type="submit"
                className="cursor-pointer w-full py-3 mt-4 bg-gradient-to-r from-blue-500 to-amber-500 text-white font-bold rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-105"
              >
                Send Message
              </button>
            </form>
          )}
          <div className="mt-10 text-center text-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center mb-6">
              {/* Janny Card */}
              <div className="bg-white/70 rounded-xl shadow p-6 border border-blue-100 flex flex-col items-center">
                <span className="text-l font-thin mb-2 text-black">
                  Janny Jonyo
                </span>
                <div className="mb-2">
                  <span className="font-semibold">Email: </span>
                  <a
                    target="_blank"
                    href="https://mail.google.com/mail/?view=cm&to=jannyjonyo1@gmail.com"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    jannyjonyo1@gmail.com
                  </a>
                </div>
                <div>
                  <span className="font-semibold">WhatsApp: </span>
                  <a
                    href="https://wa.me/254757700440"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline"
                  >
                    +254 757 700 440
                  </a>
                </div>
              </div>
              {/* Dennis Card */}
              <div className="bg-white/70 rounded-xl shadow p-6 border border-blue-100 flex flex-col items-center">
                <span className="text-l font-thin mb-2 text-black">
                  Dennis Mukoma
                </span>
                <div className="mb-2">
                  <span className="font-semibold">Email: </span>
                  <a
                    target="_blank"
                    href="https://mail.google.com/mail/?view=cm&to=dennis.mukoma@strathmore.edu"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    dennis.mukoma@strathmore.edu
                  </a>
                </div>
                <div>
                  <span className="font-semibold">WhatsApp: </span>
                  <a
                    href="https://wa.me/254708626805"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline"
                  >
                    +254 708 626 805
                  </a>
                </div>
              </div>
            </div>
            <div>
              <span className="font-semibold">Follow us:</span>{" "}
              <a
                href="https://www.linkedin.com/in/janny-jonyo-0b0604173/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-800 hover:underline mx-1"
              >
                LinkedIn |
              </a>
              <a
                href="https://github.com/JannyFromTechSupport"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:underline mx-1"
              >
                GitHub |
              </a>
              <a
                href="https://www.instagram.com/jony_.o/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:underline mx-1"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
