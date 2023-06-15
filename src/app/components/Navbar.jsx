import React from 'react'
import Link from 'next/link'
const Navbar = () => {
  return (
    <nav className='mx-24'>
        {/* inner div */}
        <div className='w-full flex items-center justify-between py-8 border-b border-zinc-800'>
            <Link href={"/"}>
                <h1 className='text-2xl font-light bg-gradient-to-r from-teal-500 to-pink-500 bg-clip-text text-transparent tracking-wider'>MULTICHAIN NFT TRANSFER</h1>
            </Link>
            <button className='py-2 px-4 bg-pink-600 rounded-lg hover:bg-pink-500 font-semibold '>Connect Wallet</button>
        </div>
    </nav>
  )
}
export default Navbar