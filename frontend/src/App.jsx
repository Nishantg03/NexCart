import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import About from './pages/About'
import Contact from './pages/contact'
import Product from './pages/product'
import Orders from './pages/orders'
import Login from './pages/login'
import Collection from './pages/collection'
import Cart from './pages/cart'
import Placeorder from './pages/placeorder'
import Navbar from './components/SiteNavbar.jsx'
import Footer from './components/Footer.jsx'
import SearchBar from './components/SearchBar.jsx'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover style={{zIndex: 9999}} />
      <Navbar />
      <SearchBar />
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] overflow-x-hidden'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/login' element={<Login />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/about' element={<About />} />
        <Route path='/place-order' element={<Placeorder />} />
      </Routes>
      <Footer />  
      </div>
    </>
  )
}

export default App