import React from 'react'
import { Outlet } from 'react-router-dom'
import { assets } from '../assets/assets'

const Dashboard = () => {
  return (
    <div className='min-h-screen'>

      {/* Navbar for Recuriter */}
      <div>
        <div>
          <img src={assets.logo} alt="" />
        </div>
      </div>
      
    </div>
  )
}

export default Dashboard
