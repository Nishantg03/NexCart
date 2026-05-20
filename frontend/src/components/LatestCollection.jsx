import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const LatestCollection = () => {
  const context = useContext(ShopContext) || {}
  const { products = [] } = context
  const [latestProducts, setLatestProducts] = useState([])
  
  useEffect(() => {
    if (products && products.length > 0) {
      const shuffled = [...products].sort(() => Math.random() - 0.5)
      setLatestProducts(shuffled.slice(0, 10))
    }
  }, [products])

  return (
    <div className='mt-2 mb-8'>
      <div className='text-center pt-2 pb-4'>
        <Title text1={'LATEST'} text2={'COLLECTIONS'} />
        <p className='text-gray-600 text-sm md:text-base'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos nesciunt labore rerum maiores quas nobis cumque esse ea deserunt! Consectetur deleniti commodi eos dignissimos asperiores temporibus voluptas? Ratione, debitis quos?</p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {latestProducts.map((items, index) => (
          <ProductItem key={index} id={items._id} name={items.name} price={items.price} image={items.image} />
        ))}
      </div>
    </div>
  )
}

export default LatestCollection