import React from 'react'
import { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'    
import Title from './Title';
const CartTotal = () => {
  const { cartItems, products, currency, delivery_fee,getCartAmount } = useContext(ShopContext);
  const [total, setTotal] = useState(0);
  
    return (
    <div className='w-full bg-gray-100 p-4 rounded-lg' >
      <div className='text-2xl' style={{marginTop:'10 px', marginBottom:'8px',marginLeft:'10px'}}>
        <Title text1={'Cart'} text2={'Total'} />
      </div>
      <div className='flex flex-col gap-2 mt-2 text-1xl'style={{marginLeft:'10px'}}>
        <div className='flex justify-between'>
          <p className='font-normal font-size: 1rem; '>Subtotal</p>
          <p>{currency}{getCartAmount().toFixed(2)}</p>
        </div>
        <div className='flex justify-between'>
          <p className='font-normal' >Delivery Fee</p>
          <p>{currency}{delivery_fee.toFixed(2)}</p>
        </div>
        <div className='flex justify-between font-bold'>
          <p>Total</p>
          <p>{currency}{(getCartAmount() + delivery_fee).toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}

export default CartTotal
