import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import QuranRevisionTracker from './QuranRevisionTracker.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QuranRevisionTracker />
  </StrictMode>,
)
