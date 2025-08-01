import React from 'react'
import ReactDOM from 'react-dom/client' 
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { RouterProvider } from 'react-router-dom'
import router from './router/index.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
