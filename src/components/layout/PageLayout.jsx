import React from 'react';
import Header from './Header';
import Footer from './Footer';

const PageLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--color-ghibli-cream-light)' }}>
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
