import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Janny from '../../assets/Janny.jpeg';
import Dennis from '../../assets/Dennis.png';

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0); // Scroll to top on mount
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const stats = [
    { number: "50K+", label: "Lives Impacted", icon: "❤️" },
    { number: "100+", label: "Active Donors", icon: "🤝" },
    { number: "95%", label: "Transparency Rate", icon: "📊" },
    { number: "40+", label: "Partner Organizations", icon: "🌍" }
  ];

  const values = [
    {
      title: "Transparency",
      description: "Every donation is tracked and verified for maximum impact",
      icon: "🔍",
      color: "from-blue-400 to-blue-600"
    },
    {
      title: "Community",
      description: "Building bridges between generous hearts and those in need",
      icon: "🌟",
      color: "from-amber-400 to-amber-600"
    },
    {
      title: "Innovation",
      description: "Using cutting-edge technology to revolutionize giving",
      icon: "🚀",
      color: "from-blue-500 to-amber-500"
    },
    {
      title: "Impact",
      description: "Measuring success through the lives we transform together",
      icon: "📈",
      color: "from-amber-500 to-blue-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-blue-50 to-amber-50 text-gray-900 overflow-hidden">
      <Header />
      {/* Subtle animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transition: "all 0.3s ease-out",
          }}
        />
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-amber-400/30 rounded-full animate-bounce`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-8">
        <div
          className={`max-w-6xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="mb-8">
            <span className="inline-block text-6xl animate-bounce">🤲</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-amber-700 bg-clip-text text-transparent">
            About Us
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-amber-600 mx-auto mb-8 rounded-full"></div>
          <p className="text-2xl md:text-3xl font-light text-gray-700 mb-12 leading-relaxed max-w-4xl mx-auto">
            Where compassion meets technology to create
            <span className="text-transparent bg-gradient-to-r from-blue-600 to-amber-700 bg-clip-text font-semibold">
              {" "}
              ripples of change{" "}
            </span>
            across communities worldwide
          </p>

          {/* Floating mission cards */}
          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <div className="cursor-pointer group relative bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-amber-200 hover:bg-white/90 transition-all duration-500 hover:scale-105 hover:rotate-1 shadow-lg hover:shadow-xl">
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-amber-500 rounded-full animate-pulse"></div>
              <h3 className="text-3xl font-bold mb-4 text-transparent bg-gradient-to-r from-blue-600 to-amber-700 bg-clip-text">
                Our Vision
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                To create a world where every act of kindness sparks an
                unstoppable chain reaction of positive change
              </p>
            </div>
            <div className="cursor-pointer group relative bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-blue-200 hover:bg-white/90 transition-all duration-500 hover:scale-105 hover:-rotate-1 shadow-lg hover:shadow-xl">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-amber-500 to-blue-500 rounded-full animate-pulse"></div>
              <h3 className="text-3xl font-bold mb-4 text-transparent bg-gradient-to-r from-amber-700 to-blue-600 bg-clip-text">
                Our Mission
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                To bridge hearts and hopes through transparent,
                technology-driven philanthropy that amplifies every generous
                gesture
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-5xl font-bold text-center mb-16 text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
            Impact in Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="cursor-pointer text-center group hover:scale-110 transition-transform duration-300 bg-white/60 backdrop-blur rounded-2xl p-6 border border-amber-200 shadow-lg"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-4xl mb-4 group-hover:animate-bounce">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-black mb-2 text-transparent bg-gradient-to-r from-blue-600 to-amber-700 bg-clip-text">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-5xl font-bold text-center mb-16 text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
            What Drives Us
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="cursor-pointer group relative bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-amber-200 hover:border-blue-300 transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}
                ></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-5xl font-bold text-center mb-16 text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
            Meet the Team
          </h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Team Member 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-amber-400 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="cursor-pointer relative bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-amber-200 hover:border-blue-300 transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-xl">
                <div className="relative mb-6">
                  <img
                    src={Janny}
                    alt="Janny Jonyo"
                    className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-amber-200 group-hover:border-blue-400 transition-all duration-300 shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-amber-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-center text-transparent bg-gradient-to-r from-blue-600 to-amber-700 bg-clip-text">
                  Janny Jonyo
                </h3>
                <p className="text-gray-600 text-center mb-4 font-medium">
                  Co-Founder & Full Stack Developer
                </p>
                <p className="text-gray-700 text-center leading-relaxed mb-6">
                  Janny architected our platform with a vision of seamless user
                  experience and robust backend systems. His expertise in React
                  and Node.js powers our mission.
                </p>
                <div className="flex justify-center gap-4">
                  <a
                    href="https://mail.google.com/mail/?view=cm&to=janny.jonyo@strathmore.edu"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors duration-300 group/btn">
                      <span className="text-xl group-hover/btn:scale-125 transition-transform duration-300">
                        📧
                      </span>
                    </button>
                  </a>
                  <button className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors duration-300 group/btn">
                    <span className="text-xl group-hover/btn:scale-125 transition-transform duration-300">
                      💻
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-blue-400 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="cursor-pointer relative bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-blue-200 hover:border-amber-300 transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-xl">
                <div className="relative mb-6">
                  <img
                    src={Dennis}
                    alt="Dennis Mukoma"
                    className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-blue-200 group-hover:border-amber-400 transition-all duration-300 shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-amber-500 to-blue-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-center text-transparent bg-gradient-to-r from-amber-700 to-blue-600 bg-clip-text">
                  Dennis Mukoma
                </h3>
                <p className="text-gray-600 text-center mb-4 font-medium">
                  Co-Founder & Full Stack Developer
                </p>
                <p className="text-gray-700 text-center leading-relaxed mb-6">
                  Dennis ensures our infrastructure scales with our impact. His
                  mastery of databases and cloud systems keeps our platform
                  running smoothly for thousands of users.
                </p>
                <div className="flex justify-center gap-4">
                  <a
                    href="https://mail.google.com/mail/?view=cm&to=dennis.mukoma@strathmore.edu"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors duration-300 group/btn">
                      <span className="text-xl group-hover/btn:scale-125 transition-transform duration-300">
                        📧
                      </span>
                    </button>
                  </a>
                  <button className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors duration-300 group/btn">
                    <span className="text-xl group-hover/btn:scale-125 transition-transform duration-300">
                      💻
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-4xl font-bold mb-8 text-transparent bg-gradient-to-r from-blue-600 to-amber-700 bg-clip-text">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-700 mb-12 leading-relaxed">
            Join thousands of generous hearts in creating positive change, one
            donation at a time
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/auth/signin"
              className="cursor-pointer group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-amber-600 rounded-full font-bold text-white overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
            >
              <span className="relative z-10">Start Giving Today</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <a
              href="#top"
              className="cursor-pointer group px-8 py-4 bg-white/80 backdrop-blur border-2 border-amber-300 rounded-full font-bold text-gray-800 hover:bg-white hover:border-blue-400 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Learn More About Our Impact
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AboutPage;
