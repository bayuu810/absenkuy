import React from 'react'
import Navbar from '../shared/Navbar'
import Sidebar from '../Sidebar'

function home() {
  return (
    <div className='w-full'>
        <Navbar />
        <Sidebar />
    </div>
  )
}

export default home