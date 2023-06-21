'use client'
import React, { useContext, useEffect, useState } from 'react'
import { appState } from '../context/store'
import NftListCard from './NftListCard'

const NFTList = () => {
  const { departureChain, destinationChain } = useContext(appState)
  const [destinationAddress, setDestinationAddress] = useState(null)
  const [yourNfts,setYourNfts]=useState([])
  const { osmosisClientSigner,
    starClientSigner, osmosiscw721Contract, starcw721Contract,connectedAccount,
    osmosisics721Contract,
    starics721Contract,starAccountAddress ,setSelectedNFT,selectedNFT} = useContext(appState)


  const handleDestinationAddress = (event) => {
    const { value } = event.target
    setDestinationAddress(value)
  }

  useEffect(()=>{
    fetchNfts()
  },[yourNfts.length])

  // const mintNft=async()=>{
  //   const data=await osmosisClientSigner.execute(connectedAccount,osmosiscw721Contract,{
  //     mint:{
  //       token_id:"2",
  //       owner:connectedAccount,
  //       token_uri:"",
  //     }
  //   },
  //   "auto")
  //   console.log(data)
  // }

  const fetchNfts=async()=>{
    console.log("fetch nfts ")
    console.log(departureChain)
    if (departureChain==="Osmosis"){
      console.log("departureChain is Osmosis")
      const data=await osmosisClientSigner.queryContractSmart(osmosiscw721Contract,{
        tokens:{
          owner:connectedAccount,
          start_after:"",
          limit:10,
        }
      })
      setYourNfts(data.tokens)
    }

    console.log(yourNfts)

    //if departure-chain is "stargaze"
    if (departureChain==="Stargaze"){
      const data=await starClientSigner.queryContractSmart(starcw721Contract,{
        Tokens:{
          owner:starAccountAddress,
          start_after:"",
          limit:10,
        }
      })
      setYourNfts(data.tokens)
    }
  }

  console.log(osmosisClientSigner)
  console.log(starClientSigner)

  //handleSendNft
  const handleSendNft = async () => {
    if (departureChain === "Osmosis" && destinationChain === "Stargaze") {
      const ibcMessage = {
        receiver: destinationAddress,
        channel_id: "channel-120",
        timeout: {
          block: {
            revision: 1,
            height: 90000,
          },
        },

      }

      const encode = btoa(JSON.stringify(ibcMessage));
      
      console.log(osmosisics721Contract)
      console.log(destinationAddress)
      //execute sendNft 
      const sendData=await osmosisClientSigner.execute(
        connectedAccount,
        osmosiscw721Contract,
        {
          send_nft:
          {
            contract: osmosisics721Contract,
            token_id: `${selectedNFT}`,
            msg: encode
          }
        },
        "auto"
      )
      console.log(sendData)

      //execute cwics721 recieveNft 
      // const recieveData=await osmosisClientSigner.execute(
      //   connectedAccount,
      //   osmosisics721Contract,
      //   {
      //     receive_nft: {
      //       receiver: destinationAddress,
      //       channel_id: "channel-75",
      //       timeout: 123456,
      //       memo: ""

      //     },
      //   },
      //   "auto"
      // )
    }

    console.log(recieveData)

    if (departureChain == "Stargaze" && destinationChain === "Osmosis") {

      await starClientSigner.execute(
        connectedAccount,
        starcw721Contract,
        {
          sendNft: {
            contract: osmosiscw721Contract,
            token_id: `${selectedNFT}`,
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
            channel_id: "channel-0",
            timeout: 123456,
            memo: ""

          },
        },
        "auto"
      )

    }
  }

  return (
    <div className="flex gap-4">
      {/* //div for NFT list */}
      <div className='w-[150%] h-[450px] border border-zinc-800 rounded-2xl p-4'>
        <div className='flex gap-3 items-center mt-1'>
          <h1 className='text-xl tracking-wider font-bold'>Your NFTs on</h1>
          <div className=' flex gap-3 rounded-3xl border border-pink-600 px-3 py-2 items-center'>
            <img width={25} height={25} src={departureChain==="Cosmos-hub"?`https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/cosmoshub/uatom.png`:`https://stargaze.zone/logo.png`} alt="" />
            <h1 className='text-sm '>{departureChain}</h1>
          </div>
        </div>
        {/* //div for list */}
        <div className='flex flex-wrap mt-5 gap-6'>
          {yourNfts.map((item)=>(
            <NftListCard itemNumber={item}/>
          ))}
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
        {/* //selected Nft to transfer */}
        {selectedNFT && (
          <div className='mt-8 flex gap-5'>
          <h2 className='text-sm tracking-wider font-semibold'>Selected NFT Id:</h2>
          <h2 className='text-sm tracking-wider font-semibold'>{selectedNFT}</h2>
        </div>
        )}
        <input className='p-4 mt-8 rounded-3xl text-zinc-800' type="text" placeholder='Paste destination Address' value={destinationAddress} onChange={handleDestinationAddress} />

        {/* //Transfer button */}
        <button className='border mt-10 border-pink-500 rounded-3xl px-8 py-2 hover:bg-pink-600' onClick={handleSendNft}>Send</button>

        {/* <button onClick={mintNft}>mint</button> */}
      </div>
    </div>
  )
}

export default NFTList