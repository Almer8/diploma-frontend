import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router';
import '@fortawesome/fontawesome-free/css/all.min.css';

if (typeof window !== "undefined") {
    const ignoreResizeObserverError = (e) => {
        if (e.message && (e.message.includes('ResizeObserver') || e.message.includes('ResizeObserver loop limit exceeded'))) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    };
    window.addEventListener("error", ignoreResizeObserverError);
    window.addEventListener("unhandledrejection", ignoreResizeObserverError);
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <BrowserRouter>
          <App />
      </BrowserRouter>
  </React.StrictMode>
);
