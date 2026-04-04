import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './styles/theme.css'

// Initialize currency to INR if not set
if (!localStorage.getItem('currency')) {
  localStorage.setItem('currency', 'INR');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
