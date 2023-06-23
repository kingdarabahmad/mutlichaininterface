'use client'
import React, { useContext,useEffect } from 'react'
import NFTList from '../components/NFTList'
import { appState } from '../context/store'

const YourNFT = () => {
  const {fetchNfts,connectKeplrWallet}=useContext(appState)
  
  useEffect(()=>{
    setTimeout(()=>{
      fetchNfts()
    },1)
  },[])
  return (
    <main className="mx-24 mt-10">
      <NFTList/>
    </main>
  )
}

export default YourNFT