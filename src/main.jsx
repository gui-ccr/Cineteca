import React from 'react'
import ReactDOM from 'react-dom/client'
import { createHashRouter, RouterProvider } from "react-router-dom"

// Contextos
import { AuthProvider } from './contexts/AuthContext.jsx'

// Nossas páginas
import App from './App.jsx'
import MovieDetails from './pages/MovieDetails.jsx'
import LoginPage from './pages/LoginPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import UserProfile from './pages/UserProfile.jsx'
import Cart from './pages/Cart.jsx'
import TicketHistory from './pages/TicketHistory.jsx'
import NotFound from './pages/NotFound.jsx'
import './index.css'

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/filme/:movieId",
    element: <MovieDetails />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/admin",
    element: <AdminPage />,
  },
  {
    path: "/perfil",
    element: <UserProfile />,
  },
  {
    path: "/carrinho",
    element: <Cart />,
  },
  {
    path: "/historico",
    element: <TicketHistory />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)