import React, { useState, useEffect, useContext } from 'react'
import { assets } from '../assets/assets'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'

const Navbar = () => {
  const [openProfile, setOpenProfile] = useState(false)
  const [visible, setVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)
  const profileRef = React.useRef(null)
  const { setShowSearch, getCartCount, token, settoken } = useContext(ShopContext)
  const navigate = useNavigate()

  const handleLogout = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    localStorage.removeItem('token')
    localStorage.removeItem('tokens')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')

    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('token') || key.includes('user') || key.includes('auth'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
    })

    settoken('')
    setOpenProfile(false)
    toast.success('Logged out successfully')

    setTimeout(() => {
      window.location.href = '/login'
    }, 2000)
  }

  

  useEffect(() => {
      const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && profileRef.current.contains(e.target)) {
        return;
      }
      setOpenProfile(false);
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <nav className='site-navbar' style={{ overflow: 'visible' }}>
        <div className='site-navbar-inner'>
          <Link to='/' className='site-navbar-brand' aria-label='NexCart home'>
            <span
              className='inline-flex items-center justify-center font-extrabold tracking-tight text-[2rem] leading-none'
              style={{ width: '118px', height: 'auto' }}
            >
              NexCart
            </span>
          </Link>

          <div className='site-navbar-links'>
            <NavLink to='/' end className='site-nav-link'>
              {({ isActive }) => (
                <>
                  <span>Home</span>
                  {isActive && <span className='site-nav-link-underline' />}
                </>
              )}
            </NavLink>

            <NavLink to='/collection' className='site-nav-link'>
              {({ isActive }) => (
                <>
                  <span>Collection</span>
                  {isActive && <span className='site-nav-link-underline' />}
                </>
              )}
            </NavLink>

            <NavLink to='/about' className='site-nav-link'>
              {({ isActive }) => (
                <>
                  <span>About</span>
                  {isActive && <span className='site-nav-link-underline' />}
                </>
              )}
            </NavLink>

            <NavLink to='/contact' className='site-nav-link'>
              {({ isActive }) => (
                <>
                  <span>Contact</span>
                  {isActive && <span className='site-nav-link-underline' />}
                </>
              )}
            </NavLink>
          </div>

          <div className='site-navbar-actions'>
            <button type='button' onClick={() => setShowSearch(true)} className='site-nav-icon-btn' aria-label='Search'>
              <img src={assets.search_icon} alt='' />
            </button>

            <div className='relative' ref={profileRef}>
              {token ? (
                <>
                  <button
                    type='button'
                    onClick={() => setOpenProfile((current) => !current)}
                    className='site-nav-icon-btn'
                    aria-label='Profile'
                  >
                    <img src={assets.profile_icon} alt='' />
                  </button>

                  {openProfile && (
                    <div className='site-navbar-dropdown'>
                      <Link to='/orders' className='site-navbar-dropdown-link'>
                        My Orders
                      </Link>
                      <button
                        type='button'
                        onClick={handleLogout}
                        className='site-navbar-dropdown-btn'
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link to='/login' className='site-nav-icon-btn' aria-label='Login'>
                  <img src={assets.profile_icon} alt='' />
                </Link>
              )}
            </div>

            <Link to='/cart' className='site-nav-icon-btn' aria-label='Cart'>
              <img src={assets.cart_icon} alt='' />
              <span className='site-nav-badge'>{getCartCount()}</span>
            </Link>

            <button
              type='button'
              onClick={() => setVisible(true)}
              className='site-nav-icon-btn site-navbar-mobile-toggle'
              aria-label='Open menu'
            >
              <img src={assets.menu_icon} alt='' />
            </button>
          </div>
        </div>

        <div className={`site-navbar-drawer ${visible ? 'open' : ''}`} aria-hidden={!visible}>
          <button type='button' className='absolute inset-0 cursor-default bg-black/25' onClick={() => setVisible(false)} aria-label='Close menu overlay' />
          <div className='site-navbar-drawer-panel'>
            <div className='site-navbar-drawer-top'>
              <Link to='/' onClick={() => setVisible(false)}>
                <span
                  className='inline-flex items-center justify-center font-extrabold tracking-tight text-[1.75rem] leading-none'
                  style={{ width: '112px', height: 'auto' }}
                >
                  NexCart
                </span>
              </Link>
              <button type='button' onClick={() => setVisible(false)} className='site-nav-icon-btn' aria-label='Close menu'>
                <img src={assets.dropdown_icon} alt='' className='rotate-180' />
              </button>
            </div>

            <div className='site-navbar-drawer-links'>
              <NavLink onClick={() => setVisible(false)} className='site-navbar-drawer-link' to='/'>Home</NavLink>
              <NavLink onClick={() => setVisible(false)} className='site-navbar-drawer-link' to='/collection'>Collection</NavLink>
              <NavLink onClick={() => setVisible(false)} className='site-navbar-drawer-link' to='/about'>About</NavLink>
              <NavLink onClick={() => setVisible(false)} className='site-navbar-drawer-link' to='/contact'>Contact</NavLink>
              <NavLink onClick={() => setVisible(false)} className='site-navbar-drawer-link' to='/cart'>Cart</NavLink>
              <NavLink onClick={() => setVisible(false)} className='site-navbar-drawer-link' to='/orders'>Orders</NavLink>
            </div>
          </div>
        </div>
    </nav>
    </>
  )
}

export default Navbar
