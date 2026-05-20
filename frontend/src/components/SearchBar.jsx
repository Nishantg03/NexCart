import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {

    const {search, setSearch, showsearch, setShowSearch} = useContext(ShopContext);
    const [visible, setVisible] = useState(false);
    const location=useLocation();
    
    useEffect(()=>{
      if(location.pathname.includes('collection') && showsearch){
        setVisible(true);
      }
      else{
        setVisible(false);
      }
    }, [location, showsearch])
    
    
    return showsearch  && visible ?(
    <div className='bg-gray-50 text-center py-5 mt-6'>
      <div className='inline-flex items-center gap-3' style={{marginTop:'40px', fontSize:'20px', position:'relative'}}>
        <img src={assets.search_icon} alt="search" className='w-5 h-5' />
        <div className='border border-gray-400 px-4 py-2 rounded-full w-96'>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search for products' className='w-full border-none focus:ring-0 text-sm font-semibold bg-transparent text-gray-700 outline-none text-center' />
        </div>
        <img src={assets.cross_icon} alt="close" className='w-5 h-5 cursor-pointer' onClick={() => setShowSearch(false)} />   
      </div>
    </div>
  ) : null;
}

export default SearchBar
