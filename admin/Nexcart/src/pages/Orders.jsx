import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { backendURL, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Orders = ({token}) => {

  const [order , setOrder] = React.useState([]);
  
  // Use token from props, or fall back to localStorage
  const effectiveToken = token || localStorage.getItem('token');

  const loadOrderData = async () => {
      console.log('🔍 loadOrderData() called');
      console.log('effectiveToken available?:', !!effectiveToken);
      console.log('effectiveToken length:', effectiveToken?.length);
      
      if(!effectiveToken) {
        console.log('❌ No token available - cannot load orders');
        toast.error('No token found. Please log in again.');
        return;
      }
      
      try {
        console.log('📦 Fetching all orders from:', `${backendURL}/api/orders/list`);
        const tokenPreview = effectiveToken.substring(0, 20) + '...';
        console.log('Token being sent:', tokenPreview);
        console.log('Full Authorization header:', `Bearer ${tokenPreview}`);
        
        const response = await axios.post(`${backendURL}/api/orders/list`, {}, {
          headers: { Authorization: `Bearer ${effectiveToken}` }
        });
        
        console.log('📦 Orders response status:', response.status);
        console.log('📦 Orders response:', response.data);
        
        if(response.data.success){
          console.log('✅ Orders loaded successfully. Count:', response.data.orders?.length);
          setOrder(response.data.orders || []);
        } else {
          console.error('❌ Response success is false. Message:', response.data.message);
          toast.error('Failed to load orders: ' + response.data.message);
        }
      } catch (error) {
        console.error('❌ Error fetching orders:', error.response?.data || error.message);
        console.error('❌ Error status:', error.response?.status);
        toast.error('Error fetching orders: ' + (error.response?.data?.message || error.message || 'Unknown error'));
      }
  }
 
  const statusHandler = async (event, orderId) => {
    try {
      console.log('Updating order status. OrderId:', orderId, 'New status:', event.target.value);
      const response = await axios.post(`${backendURL}/api/orders/status`, { orderId, status: event.target.value }, {
        headers: { Authorization: `Bearer ${effectiveToken}` }
      });

      if(response.data.success){
        await loadOrderData();
        toast.success('Order status updated successfully');
      } else {
        toast.error('Failed to update order status: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Error updating order status: ' + (error.message || 'Unknown error'));
    }
  }
  
  useEffect(() => {
    console.log('📦 Orders comp mounted/token changed. Token:', effectiveToken ? 'Present' : 'Missing');
    loadOrderData();
  }, [effectiveToken]);
  return (
    <div>
      <h3>Orders</h3>
      <div>
        {
          order.length === 0 ? (
            <p className='text-center text-gray-500 py-8'>No orders found</p>
          ) : (
            order.map((item,index) => (
              <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
                <img className='w-12' src={assets.parcel_icon} alt="" /> 
                <div>
                  <p className='mt-3 mb-2 font-medium'>{item.address.firstName + " " + item.address.lastName}</p>
                  <div>
                    <p>{item.address.address + ", " + item.address.city + ", " + item.address.state + " " + item.address.zipCode}</p>
                  </div>
                  <div>
                    <p>{item.address.contactNumber}</p>
                  </div>
                </div>
                <div>
                  {item.items.map((product,idx) => (
                    <p key={idx} className='text-lg font-medium'>{product.name} - {product.quantity} x {currency}{product.price} <span>{product.size}</span></p>
                  ))}
                </div>
                <div>
                  <p className='text-sm sm:text-[15px]'>Items : {item.items.length}</p>
                  <p className='mt-3'>Method : {item.paymentMethod}</p>
                  <p>Payment : {item.payment ? 'Paid' : 'Not Paid'}</p>
                  <p>Date : {new Date(item.date).toLocaleDateString()}</p>
                </div>
                <p className='sm:text-[15px] text-sm'>{currency}{item.amount}</p>
                <select onChange={(event)=>statusHandler(event, item._id)} value={item.status} className='p-2 font-semibold'>
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            ))
          )
        }
      </div>
    </div>
  )
}

export default Orders
