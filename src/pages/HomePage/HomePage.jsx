import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import heroVideo from '../../assets/Volunteers.mp4';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const Icon = ({ path, className = 'w-8 h-8', iconColor = 'var(--color-ghibli-cream)' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={iconColor} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const phrases = [
  "Create Change.",
  "Inspire Dreams.",
  "Empower Others.",
  "Build Futures.",
  "Spread Kindness."
];

function HomePage() {
  // Track scroll for header transparency
  const [scrolled, setScrolled] = useState(false);
  // Phrase animation state
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [showingWords, setShowingWords] = useState([]);
  const [animatingOut, setAnimatingOut] = useState(false);

  // Split current and next phrase into words
  const currentWords = phrases[phraseIdx].split(' ');
  const nextPhraseIdx = (phraseIdx + 1) % phrases.length;
  // eslint-disable-next-line
  const nextWords = phrases[nextPhraseIdx].split(' ');

  // Animation timing
  const wordDelay = 250; // ms between each word
  const phraseDelay = 3000; // ms phrase stays before animating out

  // Animate in on mount and when phraseIdx changes
  useEffect(() => {
    setAnimatingOut(false);
    setShowingWords([]);
    let timeouts = [];
    // Animate in each word
    currentWords.forEach((_, i) => {
      timeouts.push(setTimeout(() => {
        setShowingWords((words) => [...words, currentWords[i]]);
      }, i * wordDelay));
    });
    // Start animating out after phraseDelay
    timeouts.push(setTimeout(() => setAnimatingOut(true), phraseDelay));
    return () => timeouts.forEach(clearTimeout);
    // eslint-disable-next-line
  }, [phraseIdx]);

  // Animate out word by word
  useEffect(() => {
    if (!animatingOut) return;
    let timeouts = [];
    for (let i = 0; i < currentWords.length; i++) {
      timeouts.push(setTimeout(() => {
        setShowingWords((words) => {
          const newWords = [...words];
          newWords[i] = null;
          return newWords;
        });
      }, i * wordDelay));
    }
    // After all words are out, show next phrase
    timeouts.push(setTimeout(() => {
      setPhraseIdx((idx) => (idx + 1) % phrases.length);
    }, currentWords.length * wordDelay + 300));
    return () => timeouts.forEach(clearTimeout);
    // eslint-disable-next-line
  }, [animatingOut]);

  useEffect(() => {
      window.scrollTo(0, 0); // Scroll to top on mount
    }, []);

  // Render animated words
  const renderWords = () => (
    <span>
      {currentWords.map((word, i) => (
        <span
          key={i}
          className={`
            inline-block transition-all duration-500 ease-in-out
            ${showingWords[i] ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}
            mr-2
          `}
          style={{ transitionDelay: `${i * 60}ms` }}
        >
          {word}
        </span>
      ))}
    </span>
  );

  // Header transparency effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="relative" style={{ overflowX: 'hidden' }}>
      <Header transparent={!scrolled} />
      {/* Video Hero Section */}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          width: '100vw',
          height: '100vh',
          minHeight: '100vh',
          minWidth: '100vw',
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          src={heroVideo}
        />
        {/*<div className="absolute inset-0 bg-black/40 z-10"></div>*/}
        <div className="absolute bottom-10 left-12 text-left">
          <div
            className="font-sans text-white text-7xl font-medium mb-8 text-shadow relative flex flex-col items-start overflow-hidden"
            style={{ height: '10.0rem', minHeight: '10.0rem' }}
          >
            <span>Give Hope</span>
            <span
              className="block"
              style={{
                minHeight: '3=2.5rem',
                display: 'inline-block',
                willChange: 'transform, opacity',
                marginTop: '0.5rem'
              }}
            >
              {renderWords()}
            </span>
          </div>
          <p className="font-sans font-thin text-2xl text-white">
            Join us in making a meaningful impact. Your  
          </p>
          <p className="font-sans font-thin text-2xl text-white">
            contribution empowers communities and 
          </p>
          <p className="font-sans font-thin text-2xl mb-12 text-white">
            transforms lives.
          </p>
          <div className="flex gap-6 w-[32rem] max-w-full mt-6"
               style={{ minWidth: '20rem' }}>
            <Link
              to="/donate"
              className="btn btn-primary text-lg md:text-xl py-3 flex-1 text-center"
            >
              Donate Now
            </Link>
            <Link
              to="/charities"
              className="btn btn-secondary text-lg md:text-xl py-3 flex-1 text-center"
            >
              Explore Charities
            </Link>
          </div>
        </div>
      </section>
      <main className="flex-grow">
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
      <Footer />
    </div>
  );
}

export default HomePage;
