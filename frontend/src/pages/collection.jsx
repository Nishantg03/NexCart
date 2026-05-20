import React, { use, useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { Link } from 'react-router-dom'

const Collection = () => {
  const context = useContext(ShopContext)
  const products = context?.products || []
  const { search, showsearch } = context;
  const[category,setCategory] = useState([]);
  const[subCategory,setSubCategory] = useState([]);
  const[filterProducts,setFilterProducts] = useState([]);
  const[sortBy,setSortBy] = useState('relevant');

  const toggleCategory = (e) => {
    if(category.includes(e.target.value)){
        setCategory(prev=>prev.filter((item)=> item !== e.target.value))
    }
    else{
        setCategory(prev=>[...prev,e.target.value])   
    }
  }

  const toggleSubCategory = (e) => {
    if(subCategory.includes(e.target.value)){
        setSubCategory(prev=>prev.filter((item)=> item !== e.target.value))
    }
    else{
        setSubCategory(prev=>[...prev,e.target.value])   
    }
  }

  useEffect(() => {
    applyFilters(products);
  }, [category, subCategory, search, showsearch]);

  useEffect(() => {
    if(sortBy === 'relevant') {
      applyFilters(products);
    } else {
      applySorting(filterProducts);
    }
  }, [sortBy]);

const applyFilters = (products) => {
    let Productscopy = products.slice();  
    
    if(search && showsearch){
      Productscopy = Productscopy.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    }
    
    if(category.length > 0){
        Productscopy = Productscopy.filter((item)=> category.includes(item.category))
    }
    if(subCategory.length > 0){
        Productscopy = Productscopy.filter((item)=> subCategory.includes(item.subCategory))
    }
    setFilterProducts(Productscopy);
  }

const applySorting = (products) => {
    let sortedProducts = [...products];
    switch(sortBy) {
      case 'price-low':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sortedProducts.reverse();
        break;
      case 'best-sellers':
        sortedProducts.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
        break;
      case 'relevant':
      default:
        break;
    }
    setFilterProducts(sortedProducts);
  }


  return (
    <div className='flex gap-10 pt-32 pb-16 text-semibold' style={{margin:'0 15px'}}>
      {/* Filter Section Left */}
      <div className='w-64'>
        <p className='text-3xl  tracking-wide mb-8' style={{marginTop:'72px',fontWeight:'500',fontFamily:'Arial, sans-serif'}}>FILTERS</p>
        
        {/* Category Filter - Boxed */}
        <div className='border border-gray-200 rounded-xl p-8 bg-white shadow-sm hover:shadow-md transition-shadow mb-8' style={{marginTop:'45px'}}>
          <h3 className='text-sm font-light tracking-wider uppercase mb-6 pb-4 text-gray-800 border-b border-gray-200' style={{paddingLeft:'20px',marginTop:'14px',fontWeight:'500'}}>Categories</h3>
          <div className='space-y-3'>
            <label className='flex items-center cursor-pointer group' style={{marginLeft:'15px'}}>
              <input type="checkbox" className='w-4 h-4 rounded border-gray-300 accent-black' value="Men" onChange={toggleCategory}/>
              <span className='ml-3 text-sm font-light text-gray-700 group-hover:text-gray-900 transition-colors'
               style={{marginLeft:'10px',marginTop:'2px',fontWeight:'400'}}>Men</span>
            </label>
            <label className='flex items-center cursor-pointer group' style={{marginLeft:'15px'}}>
              <input type="checkbox" className='w-4 h-4 rounded border-gray-300 accent-black' value="Women" onChange={toggleCategory}/>
              <span className='ml-3 text-sm font-light text-gray-700 group-hover:text-gray-900 transition-colors' 
              style={{marginLeft:'10px',marginTop:'2px',fontWeight:'400'}}>Women</span>
            </label>
            <label className='flex items-center cursor-pointer group' style={{marginLeft:'15px'}}>
              <input type="checkbox" className='w-4 h-4 rounded border-gray-300 accent-black' value="Kids" onChange={toggleCategory}/>
              <span className='ml-3 text-sm font-light text-gray-700 group-hover:text-gray-900 transition-colors'
               style={{marginBottom:'10px',marginLeft:'10px',marginTop:'2px',fontWeight:'400'  }}>Kids</span>
            </label>
          </div>
        </div>

        {/* Sub-Category Filter - Boxed */}
        <div className='border border-gray-200 rounded-xl p-8 bg-white shadow-sm hover:shadow-md transition-shadow' style={{marginTop:'45px'}}>
          <h3 className='text-sm font-light tracking-wider uppercase mb-6 pb-4 text-gray-800 border-b border-gray-200' style={{paddingLeft:'20px',marginTop:'14px'  ,fontWeight:'500'}}>Type</h3>
          <div className='space-y-3'>
            <label className='flex items-center cursor-pointer group' style={{marginLeft:'15px'}}>
              <input type="checkbox" className='w-4 h-4 rounded border-gray-300 accent-black' value="Topwear" onChange={toggleSubCategory}/>
              <span className='ml-3 text-sm font-light text-gray-700 group-hover:text-gray-900 transition-colors' 
              style={{marginLeft:'10px',marginTop:'2px',fontWeight:'400'}}>Topwear</span>
            </label>
            <label className='flex items-center cursor-pointer group' style={{marginLeft:'15px'}}>
              <input type="checkbox" className='w-4 h-4 rounded border-gray-300 accent-black' value="Bottomwear" onChange={toggleSubCategory}/>
              <span className='ml-3 text-sm font-light text-gray-700 group-hover:text-gray-900 transition-colors' 
              style={{marginLeft:'10px',marginTop:'2px',fontWeight:'400'   }}>Bottomwear</span>
            </label>
            <label className='flex items-center cursor-pointer group' style={{marginLeft:'15px'}}>
              <input type="checkbox" className='w-4 h-4 rounded border-gray-300 accent-black' value="Winterwear" onChange={toggleSubCategory}/>
              <span className='ml-3 text-sm font-light text-gray-700 group-hover:text-gray-900 transition-colors' style={{ marginBottom:'10px',marginLeft:'10px',marginTop:'2px',fontWeight:'400'}}>Winterwear</span>
            </label>
          </div>
        </div>
      </div>

      {/* Products Section Right */}
      <div className='flex-1'>
        {/* Title and Sort Box Container */}
        <div className='flex items-end justify-between mb-10' style={{marginTop:'72px'}}>
          {/* Title */}
          <div className='mb-20 scale-150 origin-left'>
            <Title text1="ALL" text2="COLLECTIONS" />
          </div>
          
          {/* Sort Box */}
          <div className='mb-4'>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className='border border-2 border-black px-8 py-3 text-base font-semibold bg-white cursor-pointer hover:border-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 text-black'>
              <option value="relevant">Sort By: Relevant</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="best-sellers">Best Sellers</option>
            </select>
          </div>
        </div>

        <div className='grid grid-cols-5 gap-4'>
          {filterProducts && filterProducts.length > 0 ? (
            filterProducts.map((item) => (
              <Link key={item._id} to={`/product/${item._id}`} className='group cursor-pointer'>
                <div className='relative overflow-hidden rounded-lg mb-3 bg-gray-100' style={{marginTop:'50px'}}>
                  <img src={item.image[0]} alt={item.name} className='w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300' />
                </div>
                <p className='font-light text-sm text-gray-800'>{item.name}</p>
                <p className='font-semibold text-lg text-gray-900 mt-1'>${item.price}</p>
              </Link>
            ))
          ) : (
            <p className='font-light text-gray-600'>Loading products...</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Collection
