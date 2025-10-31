import React from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <div>
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-semibold">Over 10,000+ jobs to apply</h2>
        <p>Your Next Big Career Move Starts Right Here - Explore the Best Job Opportunities and Take the First Step Toward Your Future!</p>
        <div>
            <div>
                <img src={assets.location_icon} alt="" />
                <input type="text" placeholder='location' className='max-sm:text-xs p-2 rounded outline-none w-full'/>
            </div>
        </div>
            <div>
                <img src={assets.search_icon} alt="" />
                <input type="text" placeholder='Search for jobs' className='max-sm:text-xs p-2 rounded outline-none w-full'/>
            </div>
      </div>
    </div>
  )
}

export default Hero
