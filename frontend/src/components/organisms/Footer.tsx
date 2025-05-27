import React from 'react';
import { Container } from '../atoms/ui/container';

interface FooterColumnProps {
  title: string;
  links: { label: string; href: string }[];
}

const FooterColumn: React.FC<FooterColumnProps> = ({ title, links }) => {
  return (
    <div className="mb-8 md:mb-0">
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <a 
              href={link.href} 
              className="text-white hover:text-gray-300 transition-colors"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary py-12 md:py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <FooterColumn 
            title="Tools" 
            links={[
              { label: "Publishing", href: "/tools/publishing" },
              { label: "Analytics", href: "/tools/analytics" },
              { label: "Engagement", href: "/tools/engagement" },
              { label: "Pricing", href: "/pricing" },
            ]}
          />
          
          <FooterColumn 
            title="Company" 
            links={[
              { label: "Customers", href: "/customers" },
              { label: "Community", href: "/community" },
              { label: "About Us", href: "/about" },
              { label: "Make a feature request", href: "/feedback" },
              { label: "Non-Profit organizations", href: "/non-profit" },
              { label: "Professions", href: "/professions" },
            ]}
          />
          
          <FooterColumn 
            title="Support" 
            links={[
              { label: "Support", href: "/support" },
              { label: "Tutorials for Webinars", href: "/tutorials" },
              { label: "Follow us on Twitter", href: "https://twitter.com" },
              { label: "COVID-19 Assistance Status", href: "/covid" },
            ]}
          />
          
          <FooterColumn 
            title="Free Resources" 
            links={[
              { label: "Resource center for Browser Extensions", href: "/resources/browser" },
              { label: "Transparency timeline for the content", href: "/resources/timeline" },
              { label: "library remix podcast", href: "/resources/podcast" },
            ]}
          />
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-6 text-center text-white">
          <p>Copyright 2023, All Rights Reserved to Marketing Automation Tool</p>
        </div>
      </Container>
    </footer>
  );
}; 