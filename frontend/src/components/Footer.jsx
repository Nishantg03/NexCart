import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='border-t border-gray-300' style={{marginTop:'210px'}}>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-14 py-10 text-sm'>
            <div className='flex flex-col items-center text-center'>
                <img src={assets.logo} className='mb-5 w-32' alt="" />
                <p className='w-full md:w-2/3 text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores aut magnam doloremque sapiente deleniti, numquam tempora porro vel beatae saepe possimus ducimus, aspernatur provident eos ipsum hic blanditiis deserunt molestiae?</p>
            </div>
            <div className='flex flex-col items-center text-center'>
                <p className='text-lg font-semibold mb-5'>COMPANY</p>
                <ul className='text-gray-500'>
                    <li className='mb-2 cursor-pointer hover:text-gray-900 transition-colors'>About Us</li>
                    <li className='mb-2 cursor-pointer hover:text-gray-900 transition-colors'>Contact Us</li>
                    <li className='mb-2 cursor-pointer hover:text-gray-900 transition-colors'>Privacy Policy</li>
                    <li className='mb-2 cursor-pointer hover:text-gray-900 transition-colors'>Terms of Service</li>
                </ul>
            </div>
            <div className='flex flex-col items-center text-center'>
                <p className='text-lg font-semibold mb-5'>GET IN TOUCH</p>
                <p className='text-gray-600 mb-4'>+1 (555) 123-456</p>
                <p className='text-gray-600'>support@forever.com</p>
            </div>
        </div>
        <div className='border-t border-gray-300 py-6 text-center text-gray-600'>
            <p>&copy; 2024 Your Store. All rights reserved.</p>
        </div>
    </div>
  )
}

export default Footer
