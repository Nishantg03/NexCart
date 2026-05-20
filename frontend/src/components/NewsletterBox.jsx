import React from 'react'


const onSubmitHandler = (e) => {
  e.preventDefault();
  // Handle form submission logic here
  
};

const NewsletterBox = () => {
  return (
    <div className='text-center' style={{backgroundColor:'white', padding:'40px 20px', marginTop:'40px'}}>
      <p className='text-2xl font-medium text-gray-900'>Subscribe to our newsletter for the latest updates and offers!</p>
    <p className='text-gray-400 mt-3'> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi quas mollitia repellendus consequuntur optio id laborum culpa eius, sapiente earum repudiandae eaque necessitatibus perferendis. Dicta non exercitationem tempora nisi ullam?</p>
    <form className='flex flex-col items-center justify-center gap-3 w-full my-8'>
        <input type="email" placeholder='Enter your email' required className='w-full sm:w-96 px-4 py-3 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-gray-900' />
        <button type='submit' className='px-8 py-3 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-800 active:bg-black transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer transform hover:scale-105'>Subscribe</button>
    </form>
    </div>
  )
}

export default NewsletterBox
