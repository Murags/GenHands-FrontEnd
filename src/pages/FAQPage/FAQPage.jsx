import React, { useState, useEffect } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { QuestionMarkCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const faqs = [
  {
    question: "How do I donate items?",
    answer:
      "Simply sign up, fill out the donation form, and select a charity or let us match you. Our volunteers will handle pickup and delivery.",
  },
  {
    question: "Can I choose which charity receives my donation?",
    answer:
      "Yes! You can select a charity from our list or let Generous Hands match your donation to a charity in need.",
  },
  {
    question: "How do charities join the platform?",
    answer:
      "Charities can register by submitting an application and verification documents. Once approved, they can list their needs and receive donations.",
  },
  {
    question: "Who are the volunteers?",
    answer:
      "Volunteers are community members who sign up to help deliver donations. They are verified and can earn gratitude badges for their service.",
  },
  {
    question: "Is my personal information safe?",
    answer:
      "Absolutely. We use secure technology and never share your information without consent. Read our Privacy Policy for more details.",
  },
  {
    question: "How can I track my donation?",
    answer:
      "Once your donation is picked up, you can track its progress in your dashboard until it is delivered to the charity.",
  },
];

const FAQPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsVisible(true);
  }, []);

  const toggleFAQ = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

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
            <span className="inline-block text-6xl animate-bounce">❓</span>
          </div>
          <h1
            className="text-7xl font-black mb-8 bg-gradient-to-r from-blue-900 via-ghibli-teal to-ghibli-green bg-clip-text text-transparent handwritten"
            style={{ lineHeight: "1.2" }}
          >
            Frequently Asked Questions
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-ghibli-blue to-ghibli-green mx-auto mb-8 rounded-full"></div>
          <p className="text-xl md:text-2xl font-light text-black mb-12 leading-relaxed max-w-3xl mx-auto">
            Everything you need to know about using Generous Hands as a donor, charity, or volunteer.
          </p>
          <div className="bg-white backdrop-blur-lg rounded-3xl p-8 border border-ghibli-brown-light shadow-lg text-left mx-auto max-w-3xl">
            {faqs.map((faq, idx) => (
              <div key={idx} className="mb-6">
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="cursor-pointer w-full flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="flex items-center text-lg font-semibold text-ghibli-dark-blue">
                    <QuestionMarkCircleIcon className="h-6 w-6 mr-2 text-ghibli-blue" />
                    {faq.question}
                  </span>
                  <ChevronDownIcon
                    className={`h-6 w-6 text-ghibli-brown transition-transform duration-300 ${
                      openIndex === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    openIndex === idx ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-black text-base">{faq.answer}</p>
                </div>
                {(
                  <div className="h-px w-full bg-gradient-to-r from-ghibli-blue to-ghibli-green my-4 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default FAQPage; 
