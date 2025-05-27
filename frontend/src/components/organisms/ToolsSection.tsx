import React from 'react';
import { Button } from '../atoms/ui/button';
import { Container } from '../atoms/ui/container';
import { useAuthModal } from '../../context/AuthModalContext';

interface ToolCardProps {
  icon: string;
  title: string;
  description: string;
  onGetStarted: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ icon, title, description, onGetStarted }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="bg-gray-100 p-6 rounded-full mb-8">
        <img src={icon} alt={title} className="w-12 h-12" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">{description}</p>
      <Button 
        variant="default" 
        className="mt-auto font-medium px-6"
        onClick={onGetStarted}
      >
        Get Started Now
      </Button>
    </div>
  );
};

export const ToolsSection: React.FC = () => {
  const { openModal } = useAuthModal();
  
  const handleGetStarted = () => {
    openModal('signup');
  };
  
  return (
    <section className="py-20 bg-white">
      <Container>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">
          Media platform tools designed specifically for small business
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-10">
          <ToolCard 
            icon="/images/page1/icon-content.png"
            title="Put your content out there"
            description="Create eye-catching material for your social media networks, and take use of the most up-to-date Instagram capabilities."
            onGetStarted={handleGetStarted}
          />
          
          <ToolCard 
            icon="/images/page1/icon-content2.png"
            title="Examine your marketing tectics"
            description="To increase reach, endangerment, and sales, track your progress, create reports and gain insights."
            onGetStarted={handleGetStarted}
          />
        </div>
      </Container>
    </section>
  );
}; 