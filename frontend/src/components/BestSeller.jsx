import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
import ProductItem from './ProductItem'
import { ShopContext } from '../context/ShopContext'    

const BestSeller = () => {
    const { products } = useContext(ShopContext) || { products: [] }
    const [bestSellers, setBestSellers] = useState([])  

    useEffect(() => {
        if (products && products.length > 0) {
            const bestproducts = products.filter((item) => item.bestseller === true)
            setBestSellers(bestproducts.slice(0, 5))
        }
    }, [products])

    return (
        <div className='my-10 w-full flex flex-col items-center' style={{marginTop:'80px'}}>
            <div className='text-center text-3xl py-8 w-full'>
                <Title text1={'OUR'} text2={'BESTSELLERS'} />
                <div className='flex justify-center px-4'>
                    <p className='max-w-2xl text-xs sm:text-sm md:text-base text-gray-600'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga sed nihil ipsam! Quaerat hic culpa similique pariatur nisi, reprehenderit non modi architecto! Delectus inventore facere maiores debitis est laboriosam dolores?</p>
                </div>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8'>
                {bestSellers.map((items, index) => (
                    <ProductItem key={index} id={items._id} name={items.name} price={items.price} image={items.image} />
                ))}
            </div>
        </div>
    )
}

export default BestSeller
