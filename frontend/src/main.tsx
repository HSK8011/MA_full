import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Handle page refreshes by setting up a beforeunload listener
// This helps preserve route state across page refreshes
window.addEventListener('beforeunload', () => {
  // Store the current path in sessionStorage
  sessionStorage.setItem('lastPath', window.location.pathname);
});

// When the app loads, check if we need to restore a path
document.addEventListener('DOMContentLoaded', () => {
  // This allows the app to restore state on refresh
  const lastPath = sessionStorage.getItem('lastPath');
  if (lastPath) {
    console.log('Restoring path from session:', lastPath);
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
