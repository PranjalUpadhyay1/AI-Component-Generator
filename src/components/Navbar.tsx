import React from 'react'
import { FaUser } from 'react-icons/fa'
import { HiSun } from 'react-icons/hi'
import { RiListSettingsFill } from 'react-icons/ri'

const Navbar = () => {
  return (
    <>
   <header className="nav flex items-center justify-between px-[50px] h-[90px] border-b border-gray-800">

        <div className="logo">
            <h3 className='text-[25px] font-bold grd-txt'>GenUI</h3>
        </div>
        <div className="icons flex items-center gap-[15px]">
            <div className="icon "><HiSun/></div>
            <div className="icon "><FaUser/></div>
            <div className="icon mx-[2.5px]"><RiListSettingsFill/></div>
        </div>
    </header>
    </>
  )
}

export default Navbar