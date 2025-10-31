import React, { useContext, useRef } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Hero = () => {

    const {setSearchFilter, setIsSearched} = useContext(AppContext)

    const titleRef = useRef(null)
    const locationRef = useRef(null)

    const onSearch = () => {
        setSearchFilter({
            title: titleRef.current.value,
            location: locationRef.current.value
        })
        setIsSearched(true)
        console.log({
            title: titleRef.current.value,
            location: locationRef.current.value
        })
        }
    
    
    return (
        <div>

            {/* HERO SECTION */}
            <div className='bg-gradient-to-r from-purple-800 to-purple-950 text-white py-16 text-center mx-2 rounded-xl '>
                <div className="mt-20 text-center">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4">Over 10,000+ jobs to apply</h2>
                    <p className='mb-8 max-w-xl mx-auto text-sm font-light px-5'>
                        Your Next Big Career Move Starts Right Here - Explore the Best Job Opportunities
                        and Take the First Step Toward Your Future!
                    </p>

                    {/* Search Bar */}
                    <div className='flex items-center gap-2 bg-white rounded text-gray-600 max-w-xl mx-auto p-2'>

                        <div className='flex items-center flex-1'>
                            <img className='h-4 sm:h-5 opacity-60' src={assets.search_icon} alt="" />
                            <input type="text" placeholder='Search for jobs' className='max-sm:text-xs p-2 rounded outline-none w-full' ref={titleRef} />
                        </div>

                        <div className='flex items-center flex-1'>
                            <img className='h-4 sm:h-5 opacity-60' src={assets.location_icon} alt="" />
                            <input type="text" placeholder='Location' className='max-sm:text-xs p-2 rounded outline-none w-full' ref={locationRef} />
                        </div>

                        <button onClick={onSearch} className='bg-blue-600 px-6 py-2 rounded text-white'>Search</button>
                    </div>
                </div>
            </div>

            <div className='border border-gray-300 shadow-md mx-2 mt-5 p-6 rounded-md flex'>
                <div className='flex justify-center gap-10 lg:gap-16 flex-wrap'>
                    <p className='font-medium'>Trusted by</p>
                    <div className='flex items-center justify-center gap-6 flex-wrap'>
                        <img className='h-6' src={assets.microsoft_logo} alt="Microsoft" />
                        <img className='h-6' src={assets.walmart_logo} alt="Walmart" />
                        <img className='h-6' src={assets.accenture_logo} alt="Accenture" />
                        <img className='h-6' src={assets.samsung_logo} alt="Samsung" />
                        <img className='h-6' src={assets.amazon_logo} alt="Amazon" />
                        <img className='h-6' src={assets.adobe_logo} alt="Adobe" />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Hero
