'use client';
import React, { useContext } from 'react'
import { Carousel } from 'flowbite-react';
import Link from 'next/link';
// import { appState } from '../context/store';

import { appState } from '@/app/context/store';
const Transfer = () => {
  const{allChains,departureChain,setDepartureChain,destinationChain,setDestinationChain}=useContext(appState);
  const handleChangeDeparture=(event)=>{
    const {value}=event.target
    setDepartureChain(value)  
  }
  console.log("departureChain:",departureChain)


  const handleChangeDestination=(event)=>{
    const {value}=event.target
    setDestinationChain(value)
  }
  console.log("destinationChain",destinationChain)
  return (
    <div className="flex gap-4">
        {/* //div for crousel */}
          <div className='w-full h-[450px] border border-zinc-800 rounded-2xl '>
            <Carousel slideInterval={2000} className='rounded-2xl'>
            <img className='rounded-2xl w-full h-full object-cover' src="https://res.cloudinary.com/stargaze/image/upload/f_auto,w_700/nugwcgjua9fxd7couvlm" alt="" />
            <img className='rounded-2xl w-full h-full object-cover' src="https://ipfs-gw.stargaze-apis.com/ipfs/bafybeiheprl5v5fo4gt6b6nbx3ilbwyqbvyyyantgdc4lzyhoosnuhcudq/images/432.jpg" alt="" />
            <img className='rounded-2xl w-full h-full object-cover' src="https://res.cloudinary.com/stargaze/image/upload/w_512/er64kdjg6etkcdmfgi9c.jpg" alt="" />
            <img className='rounded-2xl w-full h-full object-cover' src="https://res.cloudinary.com/stargaze/image/upload/w_512/pnnnmsiajcdbjubhrllz.jpg" alt="" />
          </Carousel>
          </div>
        {/* //div for content */}
        <div className="flex flex-col items-center border border-zinc-800 rounded-2xl p-6 w-full">
          <h1 className="text-2xl mt-8 tracking-wider font-bold">Transfer NFTs Between Blockchain</h1>
          {/* //chain select section */}
          <div className='mt-6 flex flex-col'>
            <select className='border-none bg-zinc-800 text-zinc-300 text-center px-4 py-4 rounded-t-2xl w-[300px]' name="Departure chain" value={departureChain} onChange={handleChangeDeparture}>
              <option value="near">Select Departure chain</option>
              {allChains.map((item)=>(
                <option value={item.chainName}>{item.chainName}</option>
              ))}
            </select>

            {/* //destination chain */}
            <select className='border-none mt-1 bg-zinc-800 text-zinc-300 text-center px-4 py-4 rounded-b-2xl w-[300px]' name="Departure chain" value={destinationChain} onChange={handleChangeDestination}>
              <option value="near">Select Destination chain</option>
              { allChains.map((item)=>(
                <option value={item.chainName}>{item.chainName}</option>
              ))}

            </select>
          </div>

          {/* //Transfer button */}
          <Link href={"/yournft"}>
            {
            departureChain===destinationChain?(
              <h1 className='text-sm text-pink-600 mt-10'>Departure and Destination Chain Cant Be Equal</h1>
            ):(
              <button className='border mt-10 border-pink-500 rounded-3xl px-8 py-3 hover:bg-pink-600'>Continue Transfer</button>
            )
            }
            
          </Link>
        </div>
      </div>
  )
}

export default Transfer