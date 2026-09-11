import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { seedInitialOfflineCache } from './services/offline/offlineContentService'

// Seed offline database with benchmark prices and safety guidance
seedInitialOfflineCache().catch(console.error);

// Register Service Worker for PWA offline shell support
if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      console.log('EcoLink Service Worker active:', reg.scope);
    }).catch((err) => {
      console.warn('EcoLink Service Worker registration failed:', err);
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)


