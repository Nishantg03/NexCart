import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { backendUrl, token, setCartItems } = useContext(ShopContext);
  const [isProcessing, setIsProcessing] = useState(true);
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const orderId = searchParams.get('orderId');
        const sessionId = searchParams.get('session_id');

        console.log('🔍 Payment Success Page Loaded');
        console.log('Order ID from URL:', orderId);
        console.log('Session ID from URL:', sessionId);
        console.log('Token available:', !!token);

        if (!orderId) {
          console.error('❌ No order ID in URL');
          setMessage('Error: No order ID found in payment confirmation');
          setIsProcessing(false);
          return;
        }

        if (!token) {
          console.error('❌ No token found');
          console.log('Stored token:', localStorage.getItem('token'));
          setMessage('Error: Not authenticated. Please log in again.');
          setIsProcessing(false);
          return;
        }

        console.log('📋 Calling verifyStripePayment...');
        console.log('Payload:', { orderId, sessionId });
        console.log('Authorization: Bearer ' + token.substring(0, 20) + '...');

        // Call backend to verify the payment
        const response = await axios.post(
          `${backendUrl}/api/orders/verifyStripe`,
          { orderId, sessionId },
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );

        console.log('✅ Verification response received:', response.data);

        if (response.data.success) {
          console.log('✅ Payment verified successfully!');
          setMessage('Payment successful! Your order has been placed.');
          toast.success('Payment successful! Your order has been placed.');
          
          // Clear cart
          console.log('Clearing cart...');
          setCartItems({});
          
          // Redirect to orders page after 2 seconds
          console.log('Redirecting to orders in 2 seconds...');
          setTimeout(() => {
            console.log('Navigating to /orders');
            navigate('/orders');
          }, 2000);
        } else {
          console.error('❌ Payment verification returned success: false');
          console.error('Response message:', response.data.message);
          setMessage('Payment verification failed: ' + response.data.message);
          toast.error('Payment verification failed: ' + response.data.message);
          setIsProcessing(false);
        }
      } catch (error) {
        console.error('❌ Error verifying payment:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
        setMessage('Error verifying payment: ' + errorMsg);
        toast.error('Error verifying payment: ' + errorMsg);
        setIsProcessing(false);
      }
    };

    verifyPayment();
  }, [searchParams, backendUrl, token, navigate, setCartItems]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white rounded-lg shadow-lg p-8 max-w-md text-center'>
        {isProcessing ? (
          <>
            <div className='mb-4'>
              <div className='inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full animate-spin'>
                <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                </svg>
              </div>
            </div>
            <h1 className='text-2xl font-bold text-gray-800 mb-2'>Processing Payment</h1>
            <p className='text-gray-600'>{message}</p>
          </>
        ) : (
          <>
            <h1 className='text-2xl font-bold text-gray-800 mb-2'>Payment Status</h1>
            <p className='text-gray-600'>{message}</p>
            <button 
              onClick={() => navigate('/orders')}
              className='mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600'
            >
              View Orders
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
