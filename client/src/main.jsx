import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './authContext.jsx'
import { SocketContextProvider } from './SocketContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SocketContextProvider>
        <App />
      </SocketContextProvider>

    </AuthProvider>

  </StrictMode>,
)
