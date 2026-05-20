import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';
import { backendURL } from '../App';
const Login = ({ settoken }) => {

     const [email,setemail] = useState('');
            const [password,setpassword] = useState('');

const onSubmithandler= async(e)=>{
     try {
        e.preventDefault();
        const res=await axios.post(`${backendURL}/api/users/admin/login`,{email,password})
           console.log(res.data)
           if (res.data.success) {
              settoken(res.data.token);
              localStorage.setItem('token', res.data.token);
           }
           else{
            toast.error(res.data.message)

           }

        } catch (error) {
            console.log(error)
            toast.error('An error occurred while logging in')
        }

}


  return (
    <div className='min-h-screen flex items-center justify-center w-full' >
        <div className='justify-items-center bg-white shadow-md rounded-lg px-8 py-6
         max-w-md '> 
            <h1 className='text-2xl font-bold text-center mt-10'>Admin Login</h1>
            <form  onSubmit={onSubmithandler} action="
            " >
                <div className='mb-3 min-w-72'>
                    <p className='text-sm font-medium text-gray-700 mb-2'>
                        Email Address </p>
                        <input onChange={(e) => setemail(e.target.value)} required className='rounded-md w-full px-3 py-2 border border-gray-300 outline none'  type="email" placeholder="Enter your email" />
                    
                </div>
                <div >
                    <p className='text-sm font-medium text-gray-700 mb-2'>
                        Password </p>
                        <input onChange={(e) => setpassword(e.target.value)} required className='rounded-md w-full px-3 py-2 border border-gray-300 outline none' type="password" placeholder="Enter your password" /> 
            </div>
             <button type="submit" className='bg-blue-500 text-white px-4 py-2 rounded font-semibold hover:bg-blue-600' style={{marginTop:'10px'}}>Login</button>   
            </form>
        </div>
      </div>
  )
}

export default Login
