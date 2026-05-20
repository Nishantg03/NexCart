import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'


const Login = () => {
  const [currentState, setCurrentState] = useState('Sign up');
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const { backendUrl, settoken, token } = useContext(ShopContext);
  const navigate = useNavigate();

  // Redirect to home if already logged in
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (currentState === 'Sign up') {
        const response = await axios.post(`${backendUrl}/api/users/register`, { name, email, password });
        console.log(response.data);
        if (response.data.success) {
          localStorage.setItem('token', response.data.token);
          settoken(response.data.token);
          toast.success('Sign up successful! Please log in');
          setCurrentState('Login');
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(`${backendUrl}/api/users/login`, { email, password });
        console.log('Login response:', response.data);
        if (response.data.success) {
          console.log('Login successful, setting token');
          localStorage.setItem('token', response.data.token);
          settoken(response.data.token);
          toast.success('Login successful!');
          console.log('Scheduling redirect to /' );
          setTimeout(() => {
            console.log('Executing redirect');
            navigate('/');
          }, 2000);
        } else {
          toast.error(response.data.message || 'Login failed');
        }
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      toast.error('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-full m-auto mt-14 gap-4 text-black'>
      <div className='flex items-center justify-center gap-4' style={{ marginTop: '80px', width: '100%' }}>
        <hr className='border-none h-[1.5px] flex-1 bg-gray-800' style={{ maxWidth: '100px' }} />
        <p className='text-4xl font-bold whitespace-nowrap' style={{ color: 'black', fontFamily: 'Prata' }}>{currentState}</p>
        <hr className='border-none h-[1.5px] flex-1 bg-gray-800' style={{ maxWidth: '100px' }} />
      </div>

      {currentState === 'Login' ? (
        null) : <input onChange={(e) => setname(e.target.value)} type="text" className='w-full sm:w-96 px-4 py-3 border border-gray-800 text-center mt-6' placeholder='Name' />
      }
      <input onChange={(e) => setemail(e.target.value)} type="email" className='w-full sm:w-96 px-4 py-3 border border-gray-800 text-center' placeholder='Email' />
      <input onChange={(e) => setpassword(e.target.value)} type="password" className='w-full sm:w-96 px-4 py-3 border border-gray-800 text-center' placeholder='Password' />
      <div className='w-full  sm:w-96 flex justigy-between text-sm mt-[-8px] justtify-space-between' style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p className='cursor-pointer font-semibold'>Forgot your Password?</p>
        {
          currentState === 'Login' ? (
            <p className='cursor-pointer font-semibold' onClick={() => setCurrentState('Sign up')}>Don't have an account?</p>
          ) : (
            <p className='cursor-pointer font-semibold' onClick={() => setCurrentState('Login')}>Already have an account?</p>
          )
        }
      </div>
      <button className='w-full sm:w-96 bg-black text-white py-3 rounded-md hover:bg-gray-800 transition duration-300' type='submit'>
        {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  
)}

export default Login
