import React from 'react';
import { Link } from 'react-router-dom';

const Icon = ({ path, className = 'w-8 h-8', iconColor = 'var(--color-ghibli-cream)' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={iconColor} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

function HomePage() {
  return (
    <div className="flex flex-col">
      <main className="flex-grow">
        <section className="py-20 md:py-28 text-center">
          <div className="max-w-5xl mx-auto px-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-shadow">
              Give Hope, Create Change.
            </h1>
            <p className="handwritten text-2xl md:text-3xl mb-12 max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--color-ghibli-brown)' }}>
              Join us in making a meaningful impact. Your contribution empowers communities and transforms lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <Link to="/donate" className="btn btn-primary text-lg md:text-xl py-3">
                Donate Now
              </Link>
              <Link to="/explore-causes" className="btn btn-secondary text-lg md:text-xl py-3">
                Explore Causes
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-shadow">
                Your Support Matters
              </h2>
              <p className="text-lg md:text-xl max-w-xl mx-auto" style={{ color: 'var(--color-ghibli-brown)' }}>
                Every donation, big or small, contributes to a brighter future.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              <div className="card text-center p-8">
                <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full ghibli-image animate-float" style={{ backgroundColor: 'var(--color-ghibli-teal)', opacity: 0.9 }}>
                  <Icon path="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Empower Communities</h3>
                <p className="text-base">Help build sustainable projects and support local initiatives.</p>
              </div>
              <div className="card text-center p-8">
                <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full ghibli-image animate-float" style={{ backgroundColor: 'var(--color-ghibli-blue)', opacity: 0.9, animationDelay: '0.3s' }}>
                  <Icon path="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Transparent Giving</h3>
                <p className="text-base">See the direct impact of your generosity with clear reporting.</p>
              </div>
              <div className="card text-center p-8">
                <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full ghibli-image animate-float" style={{ backgroundColor: 'var(--color-ghibli-red)', opacity: 0.9, animationDelay: '0.6s' }}>
                  <Icon path="M14.25 7.756a4.5 4.5 0 100 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Change Lives</h3>
                <p className="text-base">Provide essential resources and create opportunities for those in need.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
