import React from 'react'

const NFTList = () => {
  return (
    <div className="flex gap-4">
        {/* //div for crousel */}
          <div className='w-[150%] h-[450px] border border-zinc-800 rounded-2xl p-4'>
            <div className='flex gap-3 items-center mt-1'>
              <h1 className='text-xl tracking-wider font-bold'>Your NFTs on</h1>
              <div className=' flex gap-3 rounded-3xl border border-pink-600 px-3 py-2 items-center'>
                <img width={25} height={25} src="https://bridge.xp.network/static/media/Moonbeam.c0522d32ee7db2c2ab39b99872cd8bdb.svg" alt="" />
                <h1>Moonbeam</h1>
              </div>
            </div>
          </div>
        {/* //div for content */}
        <div className="flex flex-col items-center border border-zinc-800 rounded-2xl p-6 w-full">
          <div className='w-full flex justify-between items-center gap-4'>
            <h1 className="text-xl tracking-wider font-bold">Destination</h1>
            <div className=' flex gap-3 rounded-3xl border border-pink-600 px-4 py-2 items-center'>
              <img src="https://bridge.xp.network/static/media/Solana.b0c0af546e09f2530fc0c93e58fb0258.svg" alt="" />
              <h1>Solana</h1>
            </div>
          </div>
          <input className='p-4 mt-8 rounded-3xl' type="text" placeholder='Paste destination Address' />

          {/* //Transfer button */}
          <button className='border mt-10 border-pink-500 rounded-3xl px-8 py-2 hover:bg-pink-600'>Send</button>
        </div>
      </div>
  )
}

export default NFTList