import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Suppress specific Ant Design deprecation warnings
const originalConsoleError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && (
    args[0].includes('[antd: List]') ||
    args[0].includes('[antd: Select] \'dropdownStyle\' is deprecated')
  )) {
    return;
  }
  originalConsoleError(...args);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
