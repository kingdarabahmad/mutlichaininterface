import React, { useContext } from 'react'
import { appState } from '../context/store'

const NftListCard = ({itemNumber}) => {
    console.log(itemNumber)
    const {setSelectedNFT}=useContext(appState)
  return (
    <div  onClick={()=>setSelectedNFT(itemNumber.toString())} className='border cursor-pointer hover:bg-zinc-800 border-pink-600 w-[100px] h-[100px] rounded-lg flex items-center justify-center'>
        <h1>{itemNumber}</h1>
    </div>
  )
}

export default NftListCard