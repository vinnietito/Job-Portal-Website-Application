import React from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <div className='bg-gradient-to-r from-purple-800 to-purple-950 text-white py-16 text-center mx-2 rounded-xl '>
      <div className="mt-20 text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4">Over 10,000+ jobs to apply</h2>
        <p className='mb-8 max-w-xl mx-auto text-sm font-light px-5'>Your Next Big Career Move Starts Right Here - Explore the Best Job Opportunities and Take the First Step Toward Your Future!</p>
        <div className='flex items-center justify-between bg-white rounded text-gray-600 max-w-xl pl-4 sm:mx-auto'>
            <div>
                <img src={assets.location_icon} alt="" />
                <input type="text" placeholder='location' className='max-sm:text-xs p-2 rounded outline-none w-full'/>
            </div>
        </div>
            <div>
                <img src={assets.search_icon} alt="" />
                <input type="text" placeholder='Search for jobs' className='max-sm:text-xs p-2 rounded outline-none w-full'/>
            </div>
            <button>Search</button>
      </div>
    </div>
  )
}

export default Hero
