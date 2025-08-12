import './polyfills.js'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/terminal.css';

const rootElement = document.getElementById('root');

// Function to handle the loader fade-out
function initApp() {
  const loader = document.querySelector('.loader-container');
  if (loader) {
    // Ensure the loader is visible for at least a moment
    setTimeout(() => {
      loader.classList.add('hidden');
      // Remove from DOM after fade-out transition completes
      loader.addEventListener('transitionend', () => loader.remove());
    }, 1500); // Minimum display time: 1.5 seconds
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

initApp();
