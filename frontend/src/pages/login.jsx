import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'


const Login = () => {
  const [currentState, setCurrentState] = useState('Sign up');
  const onSubmitHandler = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };
  return (
   <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-full m-auto mt-14 gap-4 text-black'>
    <div className='flex items-center justify-center gap-4' style={{marginTop:'80px', width: '100%'}}>
      <hr  className='border-none h-[1.5px] flex-1 bg-gray-800' style={{maxWidth: '100px'}}/>
      <p className='text-4xl font-bold whitespace-nowrap' style={{color: 'black', fontFamily: 'Prata'}}>{currentState}</p>
      <hr  className='border-none h-[1.5px] flex-1 bg-gray-800' style={{maxWidth: '100px'}}/>
    </div>
    
   {currentState==='Login' ? (
      null):<input type="text" className='w-full sm:w-96 px-4 py-3 border border-gray-800 text-center mt-6' placeholder='Name'/>
     }
   <input type="email" className='w-full sm:w-96 px-4 py-3 border border-gray-800 text-center' placeholder='Email'/>
   <input type="password" className='w-full sm:w-96 px-4 py-3 border border-gray-800 text-center' placeholder='Password'/>
   <div className='w-full  sm:w-96 flex justigy-between text-sm mt-[-8px] justtify-space-between' style={{display:'flex', justifyContent:'space-between'}}>
      <p className='cursor-pointer font-semibold'>Forgot your Password?</p>
     {
      currentState === 'Login' ? (
        <p className='cursor-pointer font-semibold' onClick={() => setCurrentState('Sign up')}>Don't have an account?</p>
      ):(
        <p className='cursor-pointer font-semibold' onClick={() => setCurrentState('Login')}>Already have an account?</p>
      )
     }
   </div>
   <button className='w-full sm:w-96 bg-black text-white py-3 rounded-md hover:bg-gray-800 transition duration-300' type='submit'>
     {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
   </button>
   </form>
  )
}

export default Login
