import React from 'react';
import { Button } from '../atoms/ui/button';
import { Container } from '../atoms/ui/container';
import { useAuthModal } from '../../context/AuthModalContext';

export const HeroSection: React.FC = () => {
  const { openModal } = useAuthModal();
  
  return (
    <section className="bg-primary py-16 md:py-24">
      <Container>
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-3xl">
            Quicker and easier social media platform for genuine interaction
          </h1>
          
          <p className="text-white text-lg md:text-xl max-w-2xl mb-10">
            With a publishing analysis and engagement platform you can trust, 
            you can tell your product's narrative and develop your audience.
          </p>
          
          <Button 
            variant="default" 
            size="lg"
            className="bg-white text-primary hover:bg-gray-100 font-bold px-8 py-4 rounded-md text-lg"
            onClick={() => openModal('signup')}
          >
            Get Started Now
          </Button>
          
          <p className="text-white text-sm mt-6">
            No credit card required. Cancel anytime 14-day free trial
          </p>
        </div>
      </Container>
    </section>
  );
}; 