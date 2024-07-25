import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

// Create the root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component wrapped with BrowserRouter
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
