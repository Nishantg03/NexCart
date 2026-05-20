import React from 'react'
import { ShopContext } from '../context/ShopContext'
import { useContext, useState, useEffect } from 'react'
import Title from './Title'
import ProductItem from './ProductItem'

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext)

  const [related, setRelated] = useState([])

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter(item => item.category === category && item.subCategory === subCategory)
      setRelated(productsCopy.slice(0, 5))
    }
  }, [category, subCategory, products])

  return (
    <div className='my-24 flex flex-col items-center'>
      <div className='text-center text-3xl py-2'>
        <Title text1={'Related'} text2={'Products'} />
      </div>
      
      {related.length > 0 ? (
        <div className='w-full flex justify-center'>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6 gap-4 max-w-6xl' style={{marginTop:'20px'}}>
            {related.map((item, index) => (
              <ProductItem key={index} id={item._id} name={item.name} price={item.price} image={item.image} />
            ))} 
          </div>
        </div>
      ) : (
        <div className='text-center py-8 text-gray-500'>
          <p>No related products found</p>
        </div>
      )}
    </div>
  )
}

export default RelatedProducts
