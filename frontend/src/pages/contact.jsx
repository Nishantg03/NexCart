import React from 'react'
import Title from '../components/Title'
import NewsletterBox from '../components/NewsletterBox'
import { assets } from '../assets/assets';
const contact = () => {
  return (
    <div className='w-full' style={{marginTop:'40px'}}>
      <div className='text-center text-2xl pt-10 pb-8'>
        <Title text1='Contact' text2='Us' />
      </div>
      <div className='flex flex-col md:flex-row items-center justify-center gap-10 mb-28 px-4 max-w-6xl mx-auto'>
        <img className='w-full md:w-[400px] rounded-lg shadow-lg' src={assets.contact_img} alt="Contact Us" />
        <div className='flex flex-col justify-center items-center text-center gap-6'>
          <p className='font-semibold text-xl text-green-600'>Get in Touch with Us</p>
          <p className='text-gray-600'>Have questions or feedback? We'd love to hear from you!</p>
          <p className='text-gray-600'>You can reach us at:</p>
          <p className='text-gray-600 font-semibold'>📧 Email: info@company.com</p>
          <p className='text-gray-600 font-semibold'>📞 Phone: (123) 456-7890</p>
          <p className='text-gray-600 font-semibold'>📍 Address: 123 Main Street, City, State 12345</p>
        </div>
      </div>
      <NewsletterBox />
    </div>
  )
}

export default contact
