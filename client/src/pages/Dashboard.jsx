import React from 'react'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div>
      Vipi G si utoe form jameni
      <Outlet />
    </div>
  )
}

export default Dashboard
