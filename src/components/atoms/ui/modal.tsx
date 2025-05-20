import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  title 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalWrapperRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
      // Focus the close button when modal opens
      setTimeout(() => {
        dialogRef.current?.showModal();
        closeButtonRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
      dialogRef.current?.close();
      setTimeout(() => {
        setIsVisible(false);
      }, 300);
    }
    
    // Handle escape key press
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);
  
  if (!isVisible && !isOpen) return null;
  
  // Handle tab trapping inside modal
  const handleTabKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && modalWrapperRef.current) {
      const focusableElements = modalWrapperRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };
  
  return (
    <dialog
      ref={dialogRef}
      className={cn(
        "fixed inset-0 bg-black/50 z-50 w-full h-full p-4 backdrop:bg-black/50",
        "flex items-center justify-center transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0"
      )}
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Modal container - no keyboard events here */}
      <div 
        ref={modalWrapperRef}
        className="w-full h-full flex items-center justify-center"
      >
        {/* Backdrop close button */}
        <button
          type="button"
          className="fixed inset-0 w-full h-full border-0 bg-transparent cursor-default"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClose();
            }
          }}
          aria-label="Close modal"
        />
        
        {/* Content container - focus trap is applied here */}
        <div 
          ref={contentRef}
          className={cn(
            "bg-white rounded-lg w-full max-w-md p-6 relative transform transition-transform duration-300",
            isOpen ? "scale-100" : "scale-95"
          )}
          onKeyDown={handleTabKey}
        >
          <section
            className="relative"
            aria-modal="true"
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={onClose}
              aria-label="Close modal"
              tabIndex={0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            {title && (
              <div className="text-center mb-4">
                <h2 id="modal-title" className="text-2xl font-bold">{title}</h2>
              </div>
            )}
            
            {children}
          </section>
        </div>
      </div>
    </dialog>
  );
}; 