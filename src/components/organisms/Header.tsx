import React, { useState, useEffect } from 'react';
import { Button } from '../atoms/ui/button';
import { Container } from '../atoms/ui/container';
import { useAuthModal } from '../../context/AuthModalContext';
import { cn } from '../../lib/utils';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, className }) => (
  <a 
    href={href}
    className={cn(
      "text-gray-700 hover:text-primary font-medium transition-colors",
      className
    )}
  >
    {children}
  </a>
);

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { openModal } = useAuthModal();
  
  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(auth === 'true');
  }, []);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    window.location.href = '/';
  };
  
  return (
    <header className="py-4 bg-white">
      <Container className="flex items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <img 
              src="/images/page1/logo.png" 
              alt="Marketing Automation Tools" 
              className="h-10"
            />
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink href="/tools">Tools</NavLink>
          <NavLink href="/pricing">Pricing</NavLink>
          <NavLink href="/resources">Resources</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/customers">Customers</NavLink>
        </nav>

        {/* Desktop Call-to-actions */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Button 
                variant="default" 
                size="default"
                className="rounded-md font-medium"
                style={{ background: 'linear-gradient(96deg, #30549b 1%, #4a73c4 99%)' }}
                onClick={() => window.location.href = '/dashboard'}
              >
                Dashboard
              </Button>
              <Button 
                variant="outline" 
                size="default"
                className="rounded-md font-medium border-gray-300"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="default" 
                size="default"
                className="rounded-md font-medium"
                style={{ background: 'linear-gradient(96deg, #30549b 1%, #4a73c4 99%)' }}
                onClick={() => openModal('signup')}
              >
                Get Started Now
              </Button>
              <Button 
                variant="outline" 
                size="default"
                className="rounded-md font-medium border-gray-300"
                onClick={() => openModal('login')}
              >
                Login
              </Button>
            </>
          )}
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-md text-gray-600"
          onClick={toggleMobileMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </Container>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-container">
          <div className="mobile-menu-header">
            <a href="/" className="flex items-center">
              <img 
                src="/images/page1/logo.png" 
                alt="Marketing Automation Tools" 
                className="h-10"
              />
              <span className="ml-2 font-bold text-lg text-primary">MARKETING</span>
            </a>
            <button 
              className="p-2 rounded-md text-gray-600"
              onClick={toggleMobileMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          <nav className="mobile-menu-links">
            <NavLink href="/tools">Tools</NavLink>
            <NavLink href="/pricing">Pricing</NavLink>
            <NavLink href="/resources">Resources</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/customers">Customers</NavLink>
          </nav>
          
          <div className="mt-8 space-y-4">
            {isAuthenticated ? (
              <>
                <Button 
                  variant="default" 
                  size="default"
                  className="w-full rounded-md font-medium"
                  style={{ background: 'linear-gradient(96deg, #30549b 1%, #4a73c4 99%)' }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.location.href = '/dashboard';
                  }}
                >
                  Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  size="default"
                  className="w-full rounded-md font-medium border-gray-300"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="default" 
                  size="default"
                  className="w-full rounded-md font-medium"
                  style={{ background: 'linear-gradient(96deg, #30549b 1%, #4a73c4 99%)' }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openModal('signup');
                  }}
                >
                  Get Started Now
                </Button>
                <Button 
                  variant="outline" 
                  size="default"
                  className="w-full rounded-md font-medium border-gray-300"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openModal('login');
                  }}
                >
                  Login
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}; 