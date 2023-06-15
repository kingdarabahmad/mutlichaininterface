import React from 'react'
import {FaLinkedin,FaTwitterSquare,FaTelegram} from "react-icons/fa"

const Footer = () => {
  return (
    <footer className='mx-24 mt-10'>
        {/* //innerdiv */}
        <div className='w-full flex items-center justify-between py-8 border-t border-zinc-800'>
            <div className='flex gap-6'>
                <FaLinkedin className='text-3xl'/>
                <FaTelegram className='text-3xl'/>
                <FaTwitterSquare className='text-3xl'/>
            </div>
            <div className='text-sm font-light tracking-widest'>
                CHAIN.NETWORK &copy; 2023
            </div>
        </div>
    </footer>
  )
}

export default Footer