import React from 'react';
import { Container } from '../atoms/ui/container';

interface FeatureProps {
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  isReversed?: boolean;
}

const Feature: React.FC<FeatureProps> = ({ 
  title, 
  description, 
  imageUrl,
  buttonText,
  isReversed = false
}) => {
  return (
    <div className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-16 py-12 md:py-20`}>
      <div className="w-full md:w-1/2">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-dark mb-6">{title}</h2>
        <p className="text-gray-600 mb-6 text-lg">{description}</p>
        <a href={`/features/${title.toLowerCase()}`} className="text-primary font-medium hover:underline inline-flex items-center">
          {buttonText} <span className="ml-1">→</span>
        </a>
      </div>
      <div className="w-full md:w-1/2">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-auto rounded-lg"
        />
      </div>
    </div>
  );
};

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16" style={{ backgroundColor: "#f1f5ff" }}>
      <Container>
        <Feature 
          title="Publish"
          description="Plan and arrange your social media initiatives visually, Co-ordinate creative efforts to increase social media engagement."
          imageUrl="/images/page1/group-185.png"
          buttonText="View More"
        />
        
        <Feature 
          title="Analyze"
          description="Your content's performance should be measured and reported on. Gain in-depth knowledge to help you expand you reach revenue & engagement."
          imageUrl="/images/page1/group-139.png"
          buttonText="View More"
          isReversed
        />
        
        <Feature 
          title="Engage"
          description="Make connections with your audience. Engage with the most important comments faster and gain customer trust."
          imageUrl="/images/page1/img.png"
          buttonText="View More"
        />
      </Container>
    </section>
  );
}; 