import React, { useEffect } from 'react'
import { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import RelatedProducts from '../components/RelatedProducts'

const Product = () => {
  const { productId } = useParams();
  const context = useContext(ShopContext);
  const {products,currency,addtocart} = context || {};
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  useEffect(() => {
    if (products.length > 0) {
      const product = products.find(item => item._id === productId);
      if (product) {
        setProductData(product);
        setImage(product.image[0]);
      }
    }
  }, [productId, products])

  if (!productData) {
    return <div className='pt-20 text-center'><p>Loading...</p></div>
  }

  return (
    <div className='flex flex-col items-center w-full'>
      <div className='pt-10 transition-opacity ease-in duration-500 opacity-100 flex justify-center w-full' style={{marginTop:'10px'}}>
        <div className='flex gap-2 flex-col sm:flex-row max-w-6xl w-full'>
          {/* Images Section */}
          <div className='flex-1 flex flex-col-reverse sm:flex-row' style={{gap:'0px',marginRight:'0px',paddingRight:'0px'}} >
            {/* Thumbnails */}
            <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
              {productData.image && productData.image.map((item, index) => (
                <img
                  key={index}
                  src={item}
                  alt='thumbnail'
                  className='w-[24%] sm:w-20 flex-shrink-0 cursor-pointer hover:opacity-80 ' style={{marginTop:'20px'}}
                  onClick={() => setImage(item)}
                />
              ))}
            </div>
            
            {/* Main Image */}
            <div className='w-80 flex justify-center items-center bg-gray-50 rounded-lg p-4' style={{height: '100%',gap:'0px',paddingRight:'3px'}}>
              {image && <img src={image} alt={productData.name} className='w-full h-full object-contain' />}
            </div>
          </div>

          {/* Product Details */}
          <div className='flex-1' style={{marginLeft:'0px', gap:'10px'}}>
            <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
            
            {/* Rating Stars */}
            <div className='flex items-center gap-1 mt-2 mb-4'>
              <img src={assets.star_icon} alt="rating" className='w-5 h-5' />
              <img src={assets.star_icon} alt="rating" className='w-5 h-5' />
              <img src={assets.star_icon} alt="rating" className='w-5 h-5' />
              <img src={assets.star_icon} alt="rating" className='w-5 h-5' />
              <img src={assets.star_dull_icon} alt="rating" className='w-5 h-5' />
              <p className='ml-3 text-gray-600'>(122 reviews)</p>
            </div>
            
            <p className='text-2xl font-semibold mb-4' style={{marginTop:'10px'}}>${productData.price}</p>
            <p className='text-gray-700 mb-6' style={{marginTop:'10px'}}>{productData.description}</p>
            <p className='text-sm text-gray-600' style={{marginTop:'5px'}}>Category: {productData.category}</p>
            <p className='text-sm text-gray-600' style={{marginTop:'5px'}}>Type: {productData.subCategory}</p>
          
          <div className='flex flex-col gap-4 my-8 text-semibold' style={{marginTop:'10px'}}>
            <p>Select Size</p>
            <div className='flex items-center gap-4 mt-2' style={{marginTop:'5px'}}>
              {productData.sizes && productData.sizes.map((item, index) => (
                <button onClick={()=> setSize(size === item ? '' : item) } key={index} className={`border-2 border-gray-400 bg-gray-100 hover:bg-gray-100 transition-colors text-xl font-bold w-14 h-14 flex items-center justify-center ${size === item ? 'bg-gray-900 border-amber-500 text-amber-50' : ''}`} style={{}}>{item}</button>
              ))}
            </div>
          </div>

          <div className='flex flex-row gap-4'>
          <button onClick={()=>addtocart(productId,size)} className='bg-black w-25 h-12 text-white py-3 px-8 rounded-md active:bg-gray-800 transition-colors flex items-center justify-center' style={{marginTop:'20px'}}>Add to Cart</button>
          <button className='bg-black w-25 h-12 text-white py-3 px-8 rounded-md active:bg-gray-800 transition-colors flex items-center justify-center' style={{marginTop:'20px'}}>Buy Now</button>
          
         
          </div>
          
          <div className='flex flex-col gap-2 mt-10 text-sm text-gray-600' style={{marginTop:'20px'}}>
          <p>100% Original Product</p>
          <p>Free Shipping on Orders Over $50</p>
          <p>Easy return and 7-Day Money-Back Guarantee</p>
          </div>
          </div>
        </div>
      </div>

      {/* Description and Reviews Section */}
      <div className='w-full max-w-6xl mt-20 mb-20 px-4'>
        <div className='flex border-b border-gray-300' style={{marginTop:'40px',gap:'10px',paddingRight:'0px'}}>
          <button className='px-6 py-3 text-1xl font-medium border-b-2 border-black text-black hover:bg-gray-100 transition-colors'>Description</button>
          <button className='px-6 py-3 text-1xl font-medium border-b-2 border-transparent text-gray-600 hover:bg-gray-100 transition-colors'>Reviews (122)</button>
        </div>
        <div className='flex flex-col gap-4 mt-4 p-6  text-sm text-gray-600'>
          <p>{productData.description}</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
         <p>For more details, please refer to the product manual or contact our customer support team.</p>
         <p>We hope you enjoy your purchase! If you have any questions or concerns, please don't hesitate to reach out to us.</p>
         <p>Thank you for shopping with us!</p>

          
        </div>
      </div>
      {/* Additional sections like related products, FAQs, etc. can be added here */}
      {productData && <RelatedProducts category={productData.category} subCategory={productData.subCategory} />}
    </div>
  )
}

export default Product
