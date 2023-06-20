'use client'
import React, { useContext, useEffect, useState } from 'react'
import { appState } from '../context/store'

const NFTList = () => {
  const { departureChain, destinationChain } = useContext(appState)
  const [destinationAddress, setDestinationAddress] = useState(null)
  const [yourNfts,setYourNfts]=useState([])
  const { cosmoClientSigner,
    starClientSigner, cosmocw721Contract, starcw721Contract,
    cosmoics721Contract,
    starics721Contract } = useContext(appState)


  const handleDestinationAddress = (event) => {
    const { value } = event.target
    setDestinationAddress(value)
  }

  useEffect(()=>{
    fetchNfts()
  },[])

  const fetchNfts=async()=>{
    if (departureChain==="Cosmos-hub"){
      const data=await cosmoClientSigner.queryContractSmart(cosmocw721Contract,{
        Tokens:{
          owner:connectedAccount,
          start_after,
          limit:10,
        }
      })
      setYourNfts(data.tokens)
    }

    //if departure-chain is "stargaze"
    if (departureChain==="Stargaze"){
      const data=await starClientSigner.queryContractSmart(starcw721Contract,{
        Tokens:{
          owner:connectedAccount,
          start_after:"",
          limit:10,
        }
      })
      setYourNfts(data.tokens)
    }
  }

  console.log(cosmoClientSigner)
  console.log(starClientSigner)

  //handleSendNft
  const handleSendNft = async () => {
    if (departureChain === "Cosmos-hub" && destinationChain === "Stargaze") {

      //execute sendNft 
      await cosmoClientSigner.execute(
        connectedAccount,
        cosmocw721Contract,
        {
          sendNft:
          {
            constract: starcw721Contract,
            tokenId: 1,
            msg: {
              ReceiveNft: {},
            }
          }
        },
        "auto"
      )

      //execute cwics721 recieveNft 
      await cosmoClientSigner.execute(
        connectedAccount,
        cosmoics721Contract,
        {
          ReceiveNft: {
            receiver: destinationAddress,
            channel_id: "channel-65",
            timeout: 1234,
            memo: ""

          },
        },
        "auto"
      )
    }

    if (departureChain == "Stargaze" && destinationChain === "Cosmo-hub") {

      await starClientSigner.execute(
        connectedAccount,
        starcw721Contract,
        {
          sendNft: {
            contract: cosmocw721Contract,
            tokenId: 1,
            msg: {
              ReceiveNft: {}
            }
          }
        },
        "auto"
      )

      await starClientSigner.execute(
        connectedAccount,
        starics721Contract,
        {
          ReceiveNft: {
            receiver: destinationAddress,
            channel_id: "channel-65",
            timeout: 1234,
            memo: ""

          },
        },
        "auto"
      )

    }
  }

  return (
    <div className="flex gap-4">
      {/* //div for crousel */}
      <div className='w-[150%] h-[450px] border border-zinc-800 rounded-2xl p-4'>
        <div className='flex gap-3 items-center mt-1'>
          <h1 className='text-xl tracking-wider font-bold'>Your NFTs on</h1>
          <div className=' flex gap-3 rounded-3xl border border-pink-600 px-3 py-2 items-center'>
            <img width={25} height={25} src={departureChain==="Cosmos-hub"?`https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/cosmoshub/uatom.png`:`https://stargaze.zone/logo.png`} alt="" />
            <h1 className='text-sm '>{departureChain}</h1>
          </div>
        </div>
      </div>
      {/* //div for content */}
      <div className="flex flex-col items-center border border-zinc-800 rounded-2xl p-6 w-full">
        <div className='w-full flex justify-between items-center gap-4'>
          <h1 className="text-xl tracking-wider font-bold">Destination</h1>
          <div className=' flex gap-3 rounded-3xl border border-pink-600 px-4 py-2 items-center'>
            <img width={25} height={25} src={destinationChain==="Cosmos-hub"?`https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/cosmoshub/uatom.png`:`https://stargaze.zone/logo.png`} alt="" />
            <h1 className='text-sm '>{destinationChain}</h1>
          </div>
        </div>
        <input className='p-4 mt-8 rounded-3xl text-zinc-800' type="text" placeholder='Paste destination Address' value={destinationAddress} onChange={handleDestinationAddress} />

        {/* //Transfer button */}
        <button className='border mt-10 border-pink-500 rounded-3xl px-8 py-2 hover:bg-pink-600' onClick={handleSendNft}>Send</button>
      </div>
    </div>
  )
}

export default NFTList