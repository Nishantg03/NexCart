import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CartTotal from '../components/CartTotal'

const Cart = () => {
  const navigate = useNavigate();
  const context = useContext(ShopContext);
  const { products = [], currency, cartItems = {}, updateQuantity, removeFromCart } = context || {};
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    let tempData = [];
    if (cartItems && Object.keys(cartItems).length > 0) {
      for (let itemId in cartItems) {
        for (let size in cartItems[itemId]) {
          try {
            if (cartItems[itemId][size] > 0) {
              tempData.push({
                itemId: itemId,
                size: size,
                quantity: cartItems[itemId][size]
              });
            }
          } catch (error) {
            console.error('Error occurred while processing cart item:', error);
          }
        }
      }
    }
    setCartData(tempData);
  }, [cartItems])
  return (
    <div className=' pt-14' style={{ margin: '30px' }}>
      <div className='text-2xl mb-3' style={{ marginTop: '15px' }}>
        <Title text1={'Shopping'} text2={'Cart'} />
      </div>
      {cartData.length > 0 ? (
        <div>
          {cartData.map((item, index) => {
            const product = products && products.find(p => p._id === item.itemId);

            return product ? (
              <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_1fr_1fr_1fr] sm:grid-cols-[4fr_1fr_1fr_1fr] items-center gap-4'>
                <div className='flex items-start gap-6'>
                  <img src={product.image[0]} alt={product.name} className='w-20 h-20 object-cover rounded' />
                  <div>
                    <h3 className='font-semibold'>{product.name}</h3>
                    <p className='text-sm text-gray-500'>Size: {item.size}</p>
                    <p className='text-lg font-bold'>${product.price}</p>
                  </div>
                </div>
                <div className='flex items-center gap-2 justify-center'>
                  <button onClick={() => updateQuantity(item.itemId, item.size, item.quantity - 1)} className='bg-gray-200 px-3 py-1 rounded hover:bg-gray-300'>-</button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.itemId, item.size, parseInt(e.target.value) || 1)}
                    className='w-12 text-center border border-gray-300 rounded py-1'
                  />
                  <button onClick={() => updateQuantity(item.itemId, item.size, item.quantity + 1)} className='bg-gray-200 px-3 py-1 rounded hover:bg-gray-300'>+</button>
                </div>
                <p className='text-right font-semibold'>${(product.price * item.quantity).toFixed(2)}</p>
                <img
                  src={assets.bin_icon}

                  alt="Remove"
                  onClick={() => removeFromCart(item.itemId, item.size)}
                  className='w-5 h-5 cursor-pointer hover:opacity-70'
                />
              </div>
            ) : null;
          })}
        </div>
      ) : (
        <p className='text-center py-8 text-gray-500'>Your cart is empty</p>
      )}
      <div className='flex justify-end mt-6 text-lg font-bold' style={{ marginTop: '30px' }}>
         <div className='w-full sm:w-[450px]'>
          <CartTotal/>
          <div className='w-full text-end' style={{marginTop:'10pxt'}}>
            <button onClick={() => navigate('/place-order')} className='bg-black h-8 w-45 text-white text-sm  my-8 px-8 py-2 rounded mt-4 hover:bg-gray-800 justifycontent-center'>Proceed to Checkout</button>

          </div>
         </div>
      </div>
    </div>
  )
}

export default Cart
