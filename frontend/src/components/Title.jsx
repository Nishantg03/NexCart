import React from 'react'

const Title = ({text1,text2}) => {
  return (
    <div className='inline-flex gap-2 items-center mb-3'>
      <p className='text-gray-500 font-medium tracking-wide'>{text1} <span className='text-gray-700 font-semibold'>{text2}</span></p>
      <p className='block w-10 sm:w-14 h-0.5 bg-gray-700 rounded-full shrink-0'></p>
    </div>
  )
}

export default Title
    