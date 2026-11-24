import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './styles/index.css'
import { AppProvider } from './app/AppProvider'
import { AppRoutes } from './app/routes'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </HashRouter>
  </StrictMode>,
)
