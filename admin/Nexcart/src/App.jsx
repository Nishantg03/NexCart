import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const backendURL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000').replace(/\/+$/, '')
export const currency = '$'
const App = () => {
  const [token, settoken] = useState(localStorage.getItem('token') || '')
  return (
    <div className='bg-gray-50 min-h-screen'>
     <ToastContainer />
      {token === '' ? <Login settoken={settoken} /> : (
        <>
          <Navbar settoken={settoken} />
          <hr />
          <div className='flex'>
            <Sidebar />
            <div className='flex-1'>
              <Outlet />
            </div>
          </div>
        </>
      )}
    
    </div>
  )
}

export default App
