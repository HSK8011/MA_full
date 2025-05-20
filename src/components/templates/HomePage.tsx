import React from 'react';
import { Header } from '../organisms/Header';
import { HeroSection } from '../organisms/HeroSection';
import { FeaturesSection } from '../organisms/FeaturesSection';
import { ToolsSection } from '../organisms/ToolsSection';
import { Footer } from '../organisms/Footer';
import { Toaster } from '../atoms/Toaster';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster />
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <ToolsSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}; 