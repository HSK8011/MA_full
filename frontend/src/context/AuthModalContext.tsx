import React, { createContext, useState, useContext, useMemo } from 'react';
import { Modal } from '../components/atoms/ui/modal';
import { LoginForm, SignupForm, ForgotPasswordForm } from '../components/molecules/AuthForms';
import { toast } from 'react-hot-toast';

type AuthModalType = 'login' | 'signup' | 'forgot' | 'reset' | null;

interface AuthModalContextType {
  openModal: (type: AuthModalType) => void;
  closeModal: () => void;
  currentModal: AuthModalType;
  handleSuccessfulAuth: () => void;
}

const AuthModalContext = createContext<AuthModalContextType>({
  openModal: () => {},
  closeModal: () => {},
  currentModal: null,
  handleSuccessfulAuth: () => {},
});

export const useAuthModal = () => useContext(AuthModalContext);

export const AuthModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentModal, setCurrentModal] = useState<AuthModalType>(null);
  
  const openModal = (type: AuthModalType) => {
    setCurrentModal(type);
  };
  
  const closeModal = () => {
    setCurrentModal(null);
  };
  
  const switchModal = (type: AuthModalType) => {
    setCurrentModal(type);
  };
  
  const handleSuccessfulAuth = () => {
    // Close the modal first
    closeModal();
    
    // Check if we have a valid token
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Authentication failed: No token received');
      return;
    }
    
    // Set authentication in localStorage
    localStorage.setItem('isAuthenticated', 'true');
    
    // Trigger a storage event for other tabs/windows
    window.dispatchEvent(new Event('storage'));
    
    // Navigate to dashboard
    window.location.href = '/dashboard';
  };
  
  const renderCurrentModal = () => {
    if (currentModal === 'login') {
      return (
        <Modal isOpen={true} onClose={closeModal}>
          <LoginForm onSwitch={switchModal} onSuccess={handleSuccessfulAuth} />
        </Modal>
      );
    }
    
    if (currentModal === 'signup') {
      return (
        <Modal isOpen={true} onClose={closeModal}>
          <SignupForm onSwitch={switchModal} onSuccess={handleSuccessfulAuth} />
        </Modal>
      );
    }
    
    if (currentModal === 'forgot') {
      return (
        <Modal isOpen={true} onClose={closeModal}>
          <ForgotPasswordForm onSwitch={switchModal} />
        </Modal>
      );
    }
    
    return null;
  };
  
  // Wrap context value in useMemo to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    openModal,
    closeModal,
    currentModal,
    handleSuccessfulAuth
  }), [currentModal]); // Only depend on currentModal as other functions don't change
  
  return (
    <AuthModalContext.Provider value={contextValue}>
      {children}
      {renderCurrentModal()}
    </AuthModalContext.Provider>
  );
}; 