import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Leaflet CSS is required for proper map marker and tile styling
import 'leaflet/dist/leaflet.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
