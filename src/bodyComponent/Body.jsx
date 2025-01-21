import React from 'react'
import Category from './Category'
import ProductsList from './ProductsList'

const Body = () => {
  return (
    <>
    <div className='flex'>
        <div className='w-1/2'>
        <Category/>
        </div>
        <div>

        <ProductsList/>
        </div>
    </div>
    </>
  )
}

export default Body