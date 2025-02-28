import React from 'react'
import Category from './Category'
import { Outlet } from 'react-router'

const Body = () => {
  return (
    <>
    <div className='flex'>
        <div className='w-1/5 z-20'>
        <Category/>
        </div>
        <div className='w-4/5'>
          <Outlet/>
        </div>
    </div>
    </>
  )
}

export default Body