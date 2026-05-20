import React from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendURL } from '../App'
const Add = () => {


  const [image1, setimage1] = React.useState(false)
  const [image2, setimage2] = React.useState(false)
  const [image3, setimage3] = React.useState(false)
  const [image4, setimage4] = React.useState(false)

  const [name, setName] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [category, setCategory] = React.useState('Men')
  const [subcategory, setSubcategory] = React.useState('Topwear')
  const [price, setPrice] = React.useState('')
  const [sizes, setSizes] = React.useState([])
  const [bestseller, setBestseller] = React.useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        toast.error('No authentication token found. Please login again.')
        return
      }

      // Validate required fields
      if (!name || !description || !price) {
        toast.error('Please fill in all required fields (name, description, price)')
        return
      }

      if (!image1) {
        toast.error('Please upload at least one image')
        return
      }

      const formData = new FormData()

      formData.append('name', name)
      formData.append('description', description)
      formData.append('category', category)
      formData.append('subcategory', subcategory)
      formData.append('price', price)
      formData.append('sizes', JSON.stringify(sizes))
      formData.append('bestseller', bestseller)
      image1 && formData.append('image1', image1)
      image2 && formData.append('image2', image2)
      image3 && formData.append('image3', image3)
      image4 && formData.append('image4', image4)

      console.log('FormData contents:')
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value)
      }

      const response = await axios.post(`${backendURL}/api/products/add`, formData, {
        headers: {
          Authorization: token
        }
      })
      if(response.data.success){
      toast.success('Product added successfully!')
      setName('')
      setDescription('')
      setCategory('Men')
      setSubcategory('Topwear')
      setPrice('')
      setSizes([])
      setBestseller(false)
      setimage1(false)
      setimage2(false)
      setimage3(false)
      setimage4(false)
    }}
    catch (error) {
      console.error('Error submitting form:', error)
      if (error.response) {
        console.error('Backend error response:', error.response.data)
        toast.error(`Error: ${error.response.data.message || 'Failed to add product'}`)
      } else {
        toast.error('Failed to add product.')
      }
    }
  }

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-6'>Add Product</h1>
      <form onSubmit={onSubmit} className='bg-white p-6 rounded-lg shadow max-w-2xl'>
        <div className='mb-6'>
          <p className='text-sm font-semibold text-gray-700 mb-2'>
            Upload Image
          </p>
          <div className='grid grid-cols-4 gap-4'>
            <label htmlFor="image1">
              <img className='w-20 cursor-pointer' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
              <input onChange={(e) => setimage1(e.target.files[0])} type="file" id='image1' className='hidden' />
            </label>
            <label htmlFor="image2">
              <img className='w-20 cursor-pointer' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
              <input onChange={(e) => setimage2(e.target.files[0])} type="file" id='image2' className='hidden' />
            </label>
            <label htmlFor="image3">
              <img className='w-20 cursor-pointer' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
              <input onChange={(e) => setimage3(e.target.files[0])} type="file" id='image3' className='hidden' />
            </label>
            <label htmlFor="image4">
              <img className='w-20 cursor-pointer' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
              <input onChange={(e) => setimage4(e.target.files[0])} type="file" id='image4' className='hidden' />
            </label>
          </div>
        </div>

        <div className='mb-4'>
          <p className='text-sm font-semibold text-gray-700 mb-2'>Product Name</p>
          <input onChange={(e) => setName(e.target.value)} required className='w-full border border-gray-300 rounded px-3 py-2' type="text" placeholder='Enter product name' value={name} />

        </div>

        <div className='mb-4'>
          <p className='text-sm font-semibold text-gray-700 mb-2'>Product Description</p>
          <input onChange={(e) => setDescription(e.target.value)} required className='w-full border border-gray-300 rounded px-3 py-2'
            type="text" placeholder='Enter product description' value={description} />

        </div>

        <div className='mb-4'>
          <p className='text-sm font-semibold text-gray-700 mb-2'>
            Product Category
          </p>
          <select className='w-full border border-gray-300 rounded px-3 py-2' value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Children">Children</option>
          </select>
        </div>

        <div className='mb-4'>
          <p className='text-sm font-semibold text-gray-700 mb-2'>
            Product Sub Category
          </p>
          <select className='w-full border border-gray-300 rounded px-3 py-2' value={subcategory} onChange={(e) => setSubcategory(e.target.value)}>
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Footwear">Footwear</option>
          </select>
        </div>

        <div className='mb-4'>
          <p className='text-sm font-semibold text-gray-700 mb-2'>
            Product Price
          </p>
          <input type="Number" placeholder='0' className='w-full border border-gray-300 rounded px-3 py-2' value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>

        <div className='mb-4'>
          <p className='text-sm font-semibold text-gray-700 mb-2'>
            Product Sizes
          </p>
          <div className='flex gap-4'>
            <div
              onClick={() => setSizes(prev => prev.includes("S") ? prev.filter(item => item !== "S") : [...prev, "S"])} className='cursor-pointer bg-gray-500 text-white w-8 h-8 flex items-center justify-center rounded hover:bg-gray-600'>
              <p className={sizes.includes("S") ? " text-red-600" : "text-white"}>S</p>
            </div>
            <div
              onClick={() => setSizes(prev => prev.includes("M") ? prev.filter(item => item !== "M") : [...prev, "M"])} className='cursor-pointer bg-gray-500 text-white w-8 h-8 flex items-center justify-center rounded hover:bg-gray-600'>
              <p className={sizes.includes("M") ? "text-red-600" : "text-white"} >M</p>
            </div>
            <div
              onClick={() => setSizes(prev => prev.includes("L") ? prev.filter(item => item !== "L") : [...prev, "L"])} className='cursor-pointer bg-gray-500 text-white w-8 h-8 flex items-center justify-center rounded hover:bg-gray-600'>
              <p className={sizes.includes("L") ? "text-red-600" : "text-white"}>L</p>
            </div>
            <div
              onClick={() => setSizes(prev => prev.includes("XL") ? prev.filter(item => item !== "XL") : [...prev, "XL"])} className='cursor-pointer bg-gray-500 text-white w-8 h-8 flex items-center justify-center rounded hover:bg-gray-600'>
              <p className={sizes.includes("XL") ? "text-red-600" : "text-white"}>XL</p>
            </div>
            <div
              onClick={() => setSizes(prev => prev.includes("XXL") ? prev.filter(item => item !== "XXL") : [...prev, "XXL"])} className='cursor-pointer bg-gray-500 text-white w-8 h-8 flex items-center justify-center rounded hover:bg-gray-600'>
              <p className={sizes.includes("XXL") ? "text-red-600" : "text-white"}>XXL</p>
            </div>
          </div>
        </div>
        <div className='mb-6 flex items-center gap-3'>
          <input onChange={(e) => setBestseller(e.target.checked)} type="checkbox" id='bestseller' className='w-4 h-4 cursor-pointer' />
          <label htmlFor="bestseller" className='cursor-pointer text-sm font-semibold text-gray-700'>Add to Bestseller</label>
        </div>



        <button  type="submit" className='bg-blue-500 text-white px-4 py-2 rounded font-semibold hover:bg-blue-600' style={{ marginTop: '10px' }}>Add Product</button>

      </form>
    </div>
  )
}

export default Add
