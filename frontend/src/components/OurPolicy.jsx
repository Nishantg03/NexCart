import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-center items-center gap-12 sm:gap-12 text-center py-20
     text-xs  sm:text-sm md:text-base text-gray-700' style={{
        marginTop:'80px'
     }}>
      <div className='flex flex-col items-center' >
        <img src={assets.exchange_icon}  className='w-12 mb-5' alt="" />
      <p className='font font-semibold'>Exchange Policy</p>
      <p>We Offer hassle Free exchange policy</p>
      </div>
      <div className='flex flex-col items-center'>
        <img src={assets.quality_icon}  className='w-12 mb-5' alt="" />
      <p className='font font-semibold'>Quality Policy</p>
      <p>We Guarantee the best quality products</p>
      </div>
      <div className='flex flex-col items-center'>
        <img src={assets.support_img}  className='w-12 mb-5' alt="" />
      <p className='font font-semibold'>Support Policy</p>
      <p>We Provide 24/7 Customer Support</p>
      </div>
    </div>
  )
}

export default OurPolicy
