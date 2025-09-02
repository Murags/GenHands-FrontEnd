import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GiftIcon, HeartIcon, UserGroupIcon, ArrowRightIcon, TruckIcon, BuildingStorefrontIcon } from "@heroicons/react/24/outline";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const steps = [
  {
    title: "Donor",
    icon: <GiftIcon className="h-10 w-10 text-ghibli-green mb-2" />,
    color: "bg-ghibli-green bg-opacity-10",
    actions: [
      "Sign up or log in",
      "Submit a donation (food, clothes, books, etc...)",
      "Choose a charity, search and filter",
      "Track your donation until it's delivered",
    ],
  },
  {
    title: "Charity",
    icon: <BuildingStorefrontIcon className="h-10 w-10 text-ghibli-blue mb-2" />,
    color: "bg-ghibli-blue bg-opacity-10",
    actions: [
      "Register your organization",
      "List your priority needs",
      "Review and accept incoming donations",
      "Confirm receipt and thank donors",
    ],
  },
  {
    title: "Volunteer",
    icon: <UserGroupIcon className="h-10 w-10 text-ghibli-teal mb-2" />,
    color: "bg-ghibli-teal bg-opacity-10",
    actions: [
      "Sign up and set your availability",
      "Accept pickup and delivery missions",
      "Navigate to donor and charity locations",
      "Complete deliveries and earn gratitude badges",
    ],
  },
];

const HowItWorksPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-blue-50 to-amber-50 text-gray-900 overflow-hidden">
      <Header />
      <section className="relative min-h-screen flex flex-col items-center justify-center px-8 mt-30 mb-30">
        <div
          className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="mb-6">
            <span className="inline-block text-6xl animate-bounce">🤝</span>
          </div>
          <h1
            className="text-7xl font-black mb-8 bg-gradient-to-r from-ghibli-dark-blue via-ghibli-teal to-ghibli-green bg-clip-text text-transparent handwritten"
            style={{ lineHeight: "1.2" }}
          >
            How It Works
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-ghibli-blue to-ghibli-green mx-auto mb-8 rounded-full"></div>
          <p className="text-xl md:text-2xl font-light text-ghibli-brown mb-12 leading-relaxed max-w-3xl mx-auto">
            Generous Hands connects donors, charities, and volunteers to make
            giving easy, transparent, and impactful.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {steps.map((step) => (
              <div
                key={step.title}
                className={`cursor-pointer bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-ghibli-brown-light shadow-lg flex flex-col items-center ${step.color}`}
              >
                {step.icon}
                <h2 className="text-2xl font-bold text-ghibli-dark-blue mb-3">
                  {step.title}
                </h2>
                <ul className="space-y-3 text-ghibli-brown text-base text-left w-full max-w-xs mx-auto">
                  {step.actions.map((action) => (
                    <li
                      key={`${step.title}-${action}`}
                      className="flex items-start"
                    >
                      <ArrowRightIcon className="flex-shrink-0 h-5 w-5 text-ghibli-green mr-2 mt-1" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xl md:text-2xl font-light text-black mb-12 leading-relaxed max-w-3xl mx-auto">
              Every donation is picked up by a volunteer and delivered directly
              to a charity in need. Together, we make generosity go further!
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mt-5 ">
              <Link
                to="/auth/signin"
                className="cursor-pointer group relative px-8 py-4 bg-gradient-to-r from-ghibli-dark-blue via-ghibli-teal to-ghibli-green rounded-full font-bold text-white overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
              >
                <span className="relative z-10">Start Giving Today</span>
                <div className="absolute inset-0 bg-gradient-to-r from-ghibli-dark-blue via-ghibli-teal to-ghibli-green opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                to="/about"
                className="cursor-pointer group px-8 py-4 bg-white/80 backdrop-blur border-2 border-ghibli-green rounded-full font-bold text-gray-800 hover:bg-white hover:border-ghibli-teal transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span className="relative z-10">Learn More About Our Impact</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
