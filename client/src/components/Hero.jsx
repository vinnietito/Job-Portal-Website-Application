import React from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <div className='bg-gradient-to-r from-purple-800 to-purple-950 text-white py-20 text-center mx-2 rounded-xl mt-20'>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">Over 10,000+ jobs to apply</h2>
      <p className='mb-10 max-w-2xl mx-auto text-sm md:text-base font-light px-5'>
        Your Next Big Career Move Starts Right Here — Explore the Best Job Opportunities and Take the First Step Toward Your Future!
      </p>

      {/* Search Box */}
      <div className='bg-white max-w-2xl mx-auto rounded-full flex items-center shadow-lg overflow-hidden'>
        
        {/* Job Search Input */}
        <div className='flex items-center gap-2 px-4 flex-1'>
          <img src={assets.search_icon} className='w-5 opacity-60' />
          <input 
            type="text" 
            placeholder='Search job title...' 
            className='text-sm p-3 w-full outline-none text-gray-700'
          />
        </div>

        {/* Divider */}
        <div className='w-px h-6 bg-gray-300'></div>

        {/* Location Input */}
        <div className='flex items-center gap-2 px-4 flex-1'>
          <img src={assets.location_icon} className='w-5 opacity-60' />
          <input 
            type="text" 
            placeholder='Location' 
            className='text-sm p-3 w-full outline-none text-gray-700'
          />
        </div>

        {/* Search Button */}
        <button className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-sm font-medium rounded-full'>
          Search
        </button>
      </div>

    </div>
  )
}

export default Hero
