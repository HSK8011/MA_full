import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import ManageUsers from './pages/ManageUsers';
import Analyze from './pages/Analyze';
import Promote from './pages/Promote';
import Engage from './pages/Engage';
import Connect from './pages/Connect';
import ConnectNew from './pages/ConnectNew';
import Publish from './pages/Publish';
import { HomePage } from './components/templates/HomePage';
import { AuthModalProvider } from './context/AuthModalContext';

// Define all valid routes for the application
const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  settings: '/settings',
  settingsGeneral: '/settings/general',
  manageUsers: '/manage-users',
  analyze: '/analyze',
  promote: '/promote',
  engage: '/engage',
  connect: '/connect',
  connectNew: '/connect/new',
  publish: '/publish',
  publishQueued: '/publish/queued',
  publishPendingApproval: '/publish/pending-approval',
  publishDrafts: '/publish/drafts',
  publishDelivered: '/publish/delivered',
  publishQueueTimes: '/publish/queue-times'
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Check authentication status and update state
  const checkAuth = () => {
    const auth = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(auth === 'true');
  };

  // Initial setup effect - runs once on component mount
  useEffect(() => {
    // Initial auth check
    checkAuth();

    // Mark that initial load is complete
    setIsInitialLoad(false);
    
    // Handle auth changes (like login/logout)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (isInitialLoad) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    
    return <>{children}</>;
  };

  return (
    <AuthModalProvider>
      <Routes>
        <Route path={ROUTES.home} element={!isAuthenticated ? <HomePage /> : <Navigate to={ROUTES.dashboard} replace />} />
        
        {/* Protected Routes */}
        <Route path={ROUTES.dashboard} element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path={ROUTES.settings + '/*'} element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path={ROUTES.manageUsers} element={<ProtectedRoute><ManageUsers /></ProtectedRoute>} />
        <Route path={ROUTES.analyze} element={<ProtectedRoute><Analyze /></ProtectedRoute>} />
        <Route path={ROUTES.promote} element={<ProtectedRoute><Promote /></ProtectedRoute>} />
        <Route path={ROUTES.engage} element={<ProtectedRoute><Engage /></ProtectedRoute>} />
        <Route path={ROUTES.connect} element={<ProtectedRoute><Connect /></ProtectedRoute>} />
        <Route path={ROUTES.connectNew} element={<ProtectedRoute><ConnectNew /></ProtectedRoute>} />
        
        {/* Publish Routes */}
        <Route path={ROUTES.publish} element={<ProtectedRoute><Publish /></ProtectedRoute>} />
        <Route path={ROUTES.publishQueued} element={<ProtectedRoute><Publish /></ProtectedRoute>} />
        <Route path={ROUTES.publishPendingApproval} element={<ProtectedRoute><Publish /></ProtectedRoute>} />
        <Route path={ROUTES.publishDrafts} element={<ProtectedRoute><Publish /></ProtectedRoute>} />
        <Route path={ROUTES.publishDelivered} element={<ProtectedRoute><Publish /></ProtectedRoute>} />
        <Route path={ROUTES.publishQueueTimes} element={<ProtectedRoute><Publish /></ProtectedRoute>} />
        
        {/* Fallback route for any other path */}
        <Route path="*" element={<Navigate to={isAuthenticated ? ROUTES.dashboard : ROUTES.home} replace />} />
      </Routes>
    </AuthModalProvider>
  );
}

export default App;
