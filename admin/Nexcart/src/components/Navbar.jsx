import React from 'react'
import { assets } from '../assets/assets'

const Navbar = ({ settoken }) => {
  const handleLogout = () => {
    settoken('')
    localStorage.removeItem('token')
  }
  
  return (
    <div className='flex items-center py-2 px-[4%] justify-between w-full bg-white' style={{display:'flex'}}>
      <img className='w-[max(10%,80px)]' src={assets.logo} alt="" />
    <button onClick={handleLogout} className='bg-gray-700 text-white px-4 py-2 rounded-md'> Logout</button>
    </div>
  )
}

export default Navbar
