import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider, Link} from 'react-router-dom'
import './index.css'

import SignIn from './routes/SignIn.jsx'
import SignUp from './routes/SignUp.jsx'
import Dashboard from './routes/Dashboard.jsx'
import logo from './assets/logo.png'
import RecordRound from './routes/RecordRound.jsx'

function Home() {
  return (
    <main className="home">
      <header className="home__header">
        <img className="home_logo" src= {logo} alt="LOGO"  />
        <h1 className="home__title">Monmouth County Golf Tracker</h1>
        <p className="home__desc">Start Tracking Your Rounds Today! </p>
       </header>

      <section className="home__card">
       <div className="home__actions">
          <Link to="/signin" className="btn btn--primary">Sign In</Link>
          <Link to="/signup" className="btn btn--ghost">Create Account</Link>
        </div>
        <p className="home__footnote">New? Create a free account to get started </p>
       </section > 
    </main>
  )
}

const router = createBrowserRouter([
  {path:'/',element: <Home/>},
  {path:'/signup',element: <SignUp/>},
  {path:'/signin',element: <SignIn/>},
  {path:'/dashboard',element: <Dashboard/>},
  {path:'/record', element: <RecordRound/>},
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <RouterProvider router={router}/>
  </React.StrictMode>
)
