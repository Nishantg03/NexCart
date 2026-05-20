import React from 'react'
import axios from 'axios'
import { backendURL } from '../App'
import { toast } from 'react-toastify'

const List = () => {
  const currency = '$'
  const [list, setlist] = React.useState([])
  const token = localStorage.getItem('token')

  const fetchList = async () => {
    try {
      console.log('Fetching products from:', `${backendURL}/api/products/list`)
      const response = await axios.get(`${backendURL}/api/products/list`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log('API Response status:', response.status)
      console.log('API Response data:', response.data)
      
      if (response.data.success) {
        console.log('Products received:', response.data.products.length)
        setlist(response.data.products)
      } else {
        console.error('API returned success: false')
        toast.error(response.data.message || 'Failed to fetch product list')
      }
    } catch (error) {
      console.error('Fetch error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        fullError: error
      })
      toast.error(error.response?.data?.message || error.message || 'Error fetching product list')
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.delete(`${backendURL}/api/products/remove/${id}`, {
        headers: { authorization: token }
      })
      if (response.data.success) {
        toast.success(response.data.message)
        fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error('Error removing product:', error.message)
    }
  }

  React.useEffect(() => {
    fetchList()
  }, [])

  return (
    <>
      <p className='flex justify-center text-3xl font-bold' style={{ marginTop: '30px' }}>List Of All Products</p>
      <div className='flex flex-col gap-2'>

        <div className='grid grid-cols-[1fr_3fr_1fr_1fr_1fr] gap-4  border-gray-400 p-4 items-center bg-gray-200 text-sm font-bold' style={{ marginTop: '20px' }}>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {list.map((item, index) => (
          <div key={index} className='grid grid-cols-[1fr_3fr_1fr_1fr_1fr] gap-4  border-gray-400 p-4 items-center bg-white text-sm' >
            <img className='w-16 h-16 object-cover' src={item.image[0]} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{currency}{item.price.toFixed(2)}</p>
            <button onClick={() => removeProduct(item._id)} className='bg-red-500 text-white px-3 py-1 rounded-md justify-self-center hover:bg-red-600'>Delete</button>
          </div>
        ))}
      </div>
    </>
  ) 
}

export default List
