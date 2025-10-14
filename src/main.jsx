import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
import './index.css'

import SignIn from './routes/SignIn.jsx'
import SignUp from './routes/SignUp.jsx'
import Dashboard from './routes/Dashboard.jsx'

function Home() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Golf Tracker</h1>
      <p><Link to="/signin">Sign In</Link> · <Link to="/signup">Sign Up</Link></p>
    </div>
  )
}

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/signin', element: <SignIn /> },
  { path: '/signup', element: <SignUp /> },
  { path: '/dashboard', element: <Dashboard /> },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
