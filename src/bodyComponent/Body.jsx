import React from 'react'
import Category from './Category'
import ProductsList from './ProductsList'

const Body = () => {
  return (
    <>
    <div className='flex'>
        <div className='w-1/6'>
        <Category/>
        </div>
        <ProductsList/>
    </div>
    </>
  )
}

export default Body