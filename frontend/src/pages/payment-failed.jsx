import React, { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    console.log('❌ Payment failed for order:', orderId);
    toast.error('Payment failed. Your order has been cancelled.');
  }, [searchParams]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white rounded-lg shadow-lg p-8 max-w-md text-center'>
        <div className='mb-4'>
          <div className='inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full'>
            <svg className='w-6 h-6 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </div>
        </div>
        <h1 className='text-2xl font-bold text-red-600 mb-2'>Payment Failed</h1>
        <p className='text-gray-600 mb-4'>Your payment could not be processed. Your order has been cancelled.</p>
        <button 
          onClick={() => navigate('/placeorder')}
          className='bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600'
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default PaymentFailed;
