import React, { useState, useEffect, useContext } from 'react'
import { assets } from '../assets/assets'
import { NavLink, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const Navbar = () => {
  const [openProfile, setOpenProfile] = useState(false)
  const [visible, setVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)
  const [profilePos, setProfilePos] = useState({ top: 0, right: 0 })
  const profileRef = React.useRef(null)
  const {setShowSearch, getCartCount} = useContext(ShopContext);

  

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.closest('.profile-container')) return
      setOpenProfile(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Update profile position when opening
  useEffect(() => {
    if (openProfile && profileRef.current) {
      const rect = profileRef.current.getBoundingClientRect()
      setProfilePos({
        top: rect.bottom,
        right: window.innerWidth - rect.right
      })
    }
  }, [openProfile])

  return (
    <>
      <nav className='sticky top-0 z-50 flex items-center justify-between px-6 py-4 shadow-md bg-white' style={{ overflow: 'visible' }}>
      {/* Logo */}
      <Link to="/" className='flex items-center'>
        <img src={assets.logo} className='w-32 cursor-pointer' alt='logo' />
      </Link>

      {/* Navigation Links - Center */}
      <ul className='hidden sm:flex items-center gap-8 text-sm font-medium text-gray-700'>
        <li>
          <NavLink to="/" end className="flex flex-col items-center gap-1 transition-colors hover:text-black">
            {({ isActive }) => (
              <>
                <p>HOME</p>
                {isActive && <hr className="w-8 h-1 border-0 bg-gray-800 rounded-full" />}
              </>
            )}
          </NavLink>
        </li>

        <li>
          <NavLink to="/collection" className="flex flex-col items-center gap-1 transition-colors hover:text-black">
            {({ isActive }) => (
              <>
                <p>COLLECTION</p>
                {isActive && <hr className="w-8 h-1 border-0 bg-gray-800 rounded-full" />}
              </>
            )}
          </NavLink>
        </li>

        <li>
          <NavLink to="/about" className="flex flex-col items-center gap-1 transition-colors hover:text-black">
            {({ isActive }) => (
              <>
                <p>ABOUT</p>
                {isActive && <hr className="w-8 h-1 border-0 bg-gray-800 rounded-full" />}
              </>
            )}
          </NavLink>
        </li>

        <li>
          <NavLink to="/contact" className="flex flex-col items-center gap-1 transition-colors hover:text-black">
            {({ isActive }) => (
              <>
                <p>CONTACT</p>
                {isActive && <hr className="w-8 h-1 border-0 bg-gray-800 rounded-full" />}
              </>
            )}
          </NavLink>
        </li>
      </ul>

      {/* Icons Group - Right Side */}
      <div className='flex items-center gap-6 mr-10' style={{ marginRight: "10px", overflow: 'visible' }}>
        {/* Search Icon */}
        <img onClick={()=>setShowSearch(true)}
          src={assets.search_icon}
          alt="Search"
          className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity"
        />

        {/* Profile Dropdown */}
        <div className="profile-container" ref={profileRef} style={{ position: 'relative' }}>
          <Link to="/login">
            <img
              src={assets.profile_icon}
              alt="Profile"
              className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity"
              onClick={() => setOpenProfile(!openProfile)}
            />
          </Link>
        </div>

        {/* Cart Icon */}
        <Link to="/cart" className='relative'>
          <img
            src={assets.cart_icon}
            alt="Cart"
            className='w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity'
          />
          <p className='absolute right-[-8px] bottom-[-8px] w-5 h-5 text-center leading-4 bg-black text-white aspect-square text-xs rounded-full font-medium'>
            {getCartCount()}
          </p>
        </Link>

        {/* Mobile Menu Icon */}
        {isMobile && (
          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            alt="Menu"
            className='w-5 h-5 cursor-pointer'
          />
        )}
      </div>

      <div
        className={`fixed top-0 right-0 bottom-0 overflow-y-auto bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}
        style={{ zIndex: 9999 }}
      >
        <div className='flex flex-col text-gray-600'>
            <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
              <img className='h-4 rotate-180' src={assets.dropdown_icon}/>
              <p>Back</p>
            </div>
            <NavLink onClick={()=>setVisible(false)} style={{ display: 'block', padding: '12px 16px' }} className="hover:bg-gray-100 border-b" to='/'>Home</NavLink>
            <NavLink onClick={()=>setVisible(false)} style={{ display: 'block', padding: '12px 16px' }} className="hover:bg-gray-100 border-b" to='/collection'>Collections</NavLink>
            <NavLink onClick={()=>setVisible(false)} style={{ display: 'block', padding: '12px 16px' }} className="hover:bg-gray-100 border-b" to='/about'>About</NavLink>
            <NavLink onClick={()=>setVisible(false)} style={{ display: 'block', padding: '12px 16px' }} className="hover:bg-gray-100 border-b" to='/contact'>Contact</NavLink>
        </div>
       
      </div>
    </nav>

    {/* Profile Dropdown - Fixed Position */}
    {openProfile && (
      <div style={{
        position: 'fixed',
        top: profilePos.top + 8,
        right: profilePos.right,
        backgroundColor: 'white',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
        zIndex: 9999,
        width: '200px',
        minWidth: '200px'
      }}>
        <div style={{ padding: '8px 0', fontSize: '14px', color: '#374151' }}>
          <p style={{ cursor: 'pointer', padding: '8px 16px', margin: 0 }} className='hover:bg-gray-100'>My Profile</p>
          <Link to="/orders" style={{ cursor: 'pointer', padding: '8px 16px', display: 'block', margin: 0 }} className='hover:bg-gray-100'>Orders</Link>
          <p style={{ cursor: 'pointer', padding: '8px 16px', margin: 0 }} className='hover:bg-gray-100'>Logout</p>
        </div>
      </div>
    )}
    </>
  )
}

export default Navbar
