import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Kaggle from './components/Kaggle';
import Blogs from './components/Blogs';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-brand-900 min-h-screen text-slate-200 font-sans selection:bg-brand-500 selection:text-brand-900">
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Kaggle />
      <Blogs />
      <Footer />
    </div>
  );
}

export default App;
