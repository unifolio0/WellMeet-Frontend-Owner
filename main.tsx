import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/globals.css'
import notificationService from './services/notificationService'

// Register service worker on app startup
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    notificationService.registerServiceWorker()
      .then(() => {
        console.log('Service Worker registered successfully')
      })
      .catch((error: any) => {
        console.error('Service Worker registration failed:', error)
      })
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)