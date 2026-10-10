import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import '@fontsource/kalam/400.css'
import './index.css'
import App from './App.jsx'
import { profile } from './data/content'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// A note for whoever opens devtools.
console.log(
  `%cHey, you opened devtools.%c\nYou'd fit right in. → ${profile.email}`,
  'font: 600 14px ui-monospace, monospace; color: #1f77b4',
  'font: 12px ui-monospace, monospace; color: #55514a',
)
