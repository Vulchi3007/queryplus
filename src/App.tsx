import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AnalysisSection from './components/AnalysisSection';
import AboutSection from './components/AboutSection';
import TreatmentsSection from './components/TreatmentsSection';
import HowItWorksSection from './components/HowItWorksSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeSection={activeSection} scrollToSection={scrollToSection} />
      <main>
        <Hero scrollToSection={scrollToSection} />
        <AnalysisSection />
        <AboutSection />
        <TreatmentsSection scrollToSection={scrollToSection} />
        <HowItWorksSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;