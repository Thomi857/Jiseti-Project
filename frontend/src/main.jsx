import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'leaflet/dist/leaflet.css';
import App from './App.jsx'
import './index.css'
// src/main.jsx or src/index.css


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,

)

