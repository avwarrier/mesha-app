import React from 'react'
import {motion as m } from "framer-motion"
import NavBarLogin from '../components/Nav/NavBarLogin'
import { Link } from 'react-router-dom'

const MainScreen = () => {
  return (
    <div className='h-[100vh] bg-[#ffffff]'>
            <NavBarLogin started={true}/>
            <m.div exit={{opacity: 0}} initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.70}} className='m-auto h-[400px] w-[500px] mt-[10vh] flex flex-col justify-center items-center'>
                <p className='text-[100px] font-light text-[#4a6a8f]'>Mesha</p>
                <p className='text-[20px] font-light text-[#6a8099]'>Your All-in-one Productivity Master</p>
                <Link to="/getstarted"><div className='h-[50px] w-[200px] bg-[#222] flex justify-center items-center text-[#ffffff] rounded-md mt-[20px] cursor-pointer shadow-md  hover:shadow-lg hover:bg-[#333]'>Get Started</div></Link>
            </m.div>
    </div>
  )
}

export default MainScreen