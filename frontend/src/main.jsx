import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import axios from 'axios'

axios.defaults.baseURL =  'http://localhost:3000/api';
axios.defaults.withCredentials = true; // For cookie authentication

axios.interceptors.request.use(config => {
  if (config.url?.includes('/auth/check')) {
    config._retry = true;
  }
  return config;
});

axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Handle expired/invalid tokens
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
