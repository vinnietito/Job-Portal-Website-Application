import React from 'react'
import { assets } from '../assets/assets'

const Navbar = () => {
  return (
    <div className='shadow-md w-full fixed top-0 left-0 bg-white px-4 py-2 flex justify-between items-center'>
      <div className='container mx-auto flex justify-between items-center'>
        <img src={assets.logo} alt="" />
        <div className='space-x-4 flex gap-4 max-sm:text-xs'>
            <button className='text-gray-600'>Recruiter Login</button>
            <button className='bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full'>Login</button>
        </div>
      </div>
    </div>
  )
}

export default Navbar
