import React, { useState } from 'react'
import Title from '../components/Title'
import Cart from './cart'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
const Placeorder = () => {
  const navigate = useNavigate();
  const [method,setmethod] = useState('cod');
  return (
    <div className='flex flex-col sm:flex-row justify-between gap-2 pt-5 sm:pt-14 min-h-[80vh] ' style={{ marginTop: '30px' }}>
      {/* Left Section - Order Summary */}
      <div className='flex flex-col gap-3 w-full sm:max-w-[480px]' style={{marginLeft:'50px'}}>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'}></Title>

        </div>
        <div className='flex gap-3' >
          <input className='border border-gray-300  rounded py-2.5  px-4.5 w-full' style={{alignItems:'center'}} type='text' placeholder='First name' />
          <input className='border border-gray-300  rounded py-2.5  px-4.5 w-full' style={{alignItems:'center'}} type='text' placeholder='Last name' />

        </div>
        <input className='border border-gray-300  rounded py-2.5  px-4.5 w-full' style={{alignItems:'center'}} type='email' placeholder='Email address' />
        <input className='border border-gray-300  rounded py-2.5  px-4.5 w-full' style={{alignItems:'center'}} type='text' placeholder='Street address' />
        <div className='flex gap-3' >
          <input className='border border-gray-300  rounded py-2.5  px-4.5 w-full' style={{alignItems:'center'}} type='text' placeholder='City' />
          <input className='border border-gray-300  rounded py-2.5  px-4.5 w-full' style={{alignItems:'center'}} type='text' placeholder='State' />

        </div>
        <div className='flex gap-3' >
          <input className='border border-gray-300  rounded py-2.5  px-4.5 w-full' type='number' placeholder='Zip Code' />
          <input className='border border-gray-300  rounded py-2.5  px-4.5 w-full' type='text' placeholder='Country' />

        </div>
        <input className='border border-gray-300  rounded py-2.5  px-4.5 w-full' type='number' placeholder='Contact Number' />
      </div>

      {/* Right Section - Order Summary */}
      <div className='w-full sm:w-[450px]' style={{ marginRight: '50px' }}>
        <div className='text-xl sm:text-2xl my-3'>
         <CartTotal />    
        </div>
        <div className='mt-20' style={{marginTop:'30px'}}>
          <Title text1={'PAYMENT'} text2={'METHOD'}></Title>
          <div className='flex flex-col gap-4 lg:flex-row mt-4'>
            <div onClick={() => setmethod('stripe')} className='flex items-center gap-3 border p-4 px-5 cursor-pointer rounded-md'>
              <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${method === "stripe" ? "bg-green-500 border-green-500" : "border-gray-300"}`}>
                {method === "stripe" && <div className='w-2 h-2 bg-white rounded-full'></div>}
              </div>
              <img src={assets.stripe_logo} alt="" className='h-6' />
            </div>
             <div onClick={() => setmethod('razorpay')} className='flex items-center gap-3 border p-4 px-5 cursor-pointer rounded-md'>
              <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${method === "razorpay" ? "bg-green-500 border-green-500" : "border-gray-300"}`}>
                {method === "razorpay" && <div className='w-2 h-2 bg-white rounded-full'></div>}
              </div>
              <img src={assets.razorpay_logo} alt="" className='h-6' />
            </div>
             <div onClick={() => setmethod('cod')} className='flex items-center gap-3 border p-4 px-5 cursor-pointer rounded-md'>
              <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${method === "cod" ? "bg-green-500 border-green-500" : "border-gray-300"}`}>
                {method === "cod" && <div className='w-2 h-2 bg-white rounded-full'></div>}
              </div>
             <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>
          <div className='w-full text-end' style={{marginTop:'30px'}}>
            <button onClick={()=> navigate('/orders')} className='bg-black w-29 h-9 text-white py-3 px-16 text-sm hover:bg-gray-800' >Place Order</button>
             
          </div>
        </div>
      </div>
    </div>
  )
}

export default Placeorder
