import React from 'react'
import ReactDOM from 'react-dom/client'
import { createHashRouter, RouterProvider } from "react-router-dom"

// Nossas páginas
import App from './App.jsx'
import MovieDetails from './pages/MovieDetails.jsx'
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
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)