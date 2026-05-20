import React from 'react'
import { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useSearchParams } from 'react-router-dom'
const verify = () => {
    const {naviate , token , setcartItenms, backendUrl} = useContext(ShopContext);
            const {searchParams, setsearchParams} = useSearchParams();
   
   const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');
        
    
    const verifyPayment = async () => {
        try {
            if (!token) {
                console.error('No token found, cannot verify payment');
                return;
            }

            const response = await 
            axios.post(`${backendUrl}/api/payment/verifyStripe`,{success, orderId}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },

                if(response.data.success){
                    setcartItenms({});
                    navigate('/orders');
                }
                else{
                    navigate('/cart');
                }
            });

           
        } catch (error) {
            console.error('Error verifying payment:', error);
            toast.error('An error occurred while verifying the payment.');
        }
    };

useEffect(() => {
        if (success && orderId) {
            verifyPayment();
        }
    }, [success, orderId]);

  return (
    <div>
       
    </div>
  )
}

export default verify
