import React from 'react';
import NavBar from './components/NavBar';
import HeroSection from './components/HeroSection';

function App() {
  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <NavBar />
      <HeroSection />
    </div>
  );
}

export default App;

