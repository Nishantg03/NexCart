import React from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
const Orders = () => {
  const {products,currency} = useContext(ShopContext);  
  return (
    <div className='border-t pt-16'>
      
      <div className='text-2xl' style={{marginTop:'55px', marginBottom:'8px',marginLeft:'10px'}}>
        <Title text1={'YOUR'} text2={'ORDERS'}></Title>
         </div>
         <div style={{marginLeft:'10px', marginRight:'10px'}}>
           {/* Order items would be displayed here */}
           {
            products.slice(1,4).map((item,index) => (
              <div key={index} className='flex items-center justify-between gap-4 border-b py-4'>
                <img src={item.image[0]} alt={item.name} className='w-20 h-20 object-cover rounded' />
                <div className='flex-1'>
                  <p className='sm:text-base font-medium'>{item.name}</p>
                  <div className='flex items-center gap-3 mt-2 text-base text-gray-600'>
                    <p className='text-lg font-medium'>{currency}{item.price}</p>
                    <p>Quantity: 1</p>
                    <p>Size: M</p>
                  </div>
                  <p className='mt-2'>Order Date: {new Date().toLocaleDateString()}</p>
                </div>
                <div className='flex items-center gap-10'>
                  <div className='flex items-center gap-2' style={{margin:'30px'}}>
                    <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                    <p className='text-sm md:text-base'>Ready to ship</p>
                  </div>
                  <button className='bg-white w-19 h-10 text-black py-2 px-4 text-sm hover:bg-gray-200'>Track Order</button>
                </div>
              </div>
            ))
           }
          
         </div>
    </div>
  )
}

export default Orders
