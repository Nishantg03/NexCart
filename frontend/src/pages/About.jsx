import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
const About = () => {
  return (
    <div className='text-2xl text-center pt-8' style={{marginTop:'40px'}}>
       <Title text1='About' text2='Us' />
       
    <div className='my-10 flex flex-col md:flex-row gap-16 items-center justify-center' style={{margin:'30px'}}>
      <img src={assets.about_img} alt=""  className='w-full md:w-[450px] h-auto'/>
      <div className='text-lg text-gray-600'>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi voluptates illo in vitae voluptatibus porro blanditiis sed laudantium distinctio eum ex cupiditate facilis temporibus unde, inventore dignissimos deserunt. Expedita, vitae?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, aut dolorem. Mollitia, maxime fuga sunt quia placeat rerum neque aliquam odit tempora deleniti suscipit numquam eos aspernatur dolore nisi veritatis.</p>
        <p>Welcome to our story!</p>
        <b style={{marginTop:'50px'}}>Our Mission</b>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus ipsam illum, ipsum velit voluptatem optio assumenda magni iusto excepturi, maxime iure, dolor dicta cum mollitia. Doloremque harum error enim. Minima!</p>
      </div>
    </div>

    <div className='text-4xl py-4'>
      <Title text1={'WHY'} text2={'CHOOSE US'} />
    </div>

    <div className='grid grid-cols-1 md:grid-cols-2 gap-6' style={{margin:'30px'}}>
      <div className='border border-gray-300 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'>
        <h3 className='text-2xl font-bold text-black mb-4'>Quality Products</h3>
        <p className='text-lg text-gray-600'>We are committed to providing high-quality products that meet our customers' expectations. We source our products from trusted suppliers and ensure that they undergo rigorous quality checks before reaching your doorstep.</p>
      </div>

      <div className='border border-gray-300 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'>
        <h3 className='text-2xl font-bold text-black mb-4'>Customer Satisfaction</h3>
        <p className='text-lg text-gray-600'>Our customers are at the heart of everything we do. We strive to provide exceptional customer service and support, ensuring that your shopping experience with us is smooth and enjoyable.</p>
      </div>

      <div className='border border-gray-300 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'>
        <h3 className='text-2xl font-bold text-black mb-4'>Fast and Reliable Shipping</h3>
        <p className='text-lg text-gray-600'>We understand the importance of timely delivery. That's why we work with reliable shipping partners to ensure that your orders are delivered quickly and safely to your doorstep.</p>
      </div>

      <div className='border border-gray-300 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'>
        <h3 className='text-2xl font-bold text-black mb-4'>Secure Payment Options</h3>
        <p className='text-lg text-gray-600'>Your security is our priority. We offer secure payment options to protect your personal and financial information, giving you peace of mind while shopping with us.</p>
      </div>
    </div>
    <div className='flex flex-col'>
    <NewsletterBox />
   </div>
    </div>
  )
}

export default About
