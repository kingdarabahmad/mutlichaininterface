'use client'
import React, { useContext, useEffect, useState } from 'react'
import { appState } from '../context/store'
import NftListCard from './NftListCard'

const NFTList = () => {
  const { departureChain, destinationChain,yourNfts,fetchNfts } = useContext(appState)
  const [destinationAddress, setDestinationAddress] = useState(null)
  const [fetchData,setFetchData]=useState({
    status:false,
    msg:null
  })
  const {
    junoClientSigner,
    junocw721Contract,
    connectedAccount,
    junoicsBridgeContract,
    selectedNFT
  } = useContext(appState)


  const handleDestinationAddress = (event) => {
    const { value } = event.target
    setDestinationAddress(value)
  }

  useEffect(() => {
    fetchNfts()
  }, [yourNfts?.length])

  
  //function to mint nft

  const mintNft=async()=>{
    const data=await junoClientSigner.execute(connectedAccount,junocw721Contract,{
      mint:{
        token_id:"7",
        owner:connectedAccount,
        token_uri:"",
      }
    },
    "auto")
    console.log(data)
  }

  //function to fetch your owned nfts

    console.log(yourNfts)


    //handleSendNft
    const handleSendNft = async () => {
      try {
        
        if (departureChain === "Juno" && destinationChain === "Stargaze") {

          //ibc message
          const ibcMessage = {
            receiver: destinationAddress,
            channel_id: "channel-120",
            timeout: {
              block: {
                revision: 1,
                height: 9000000000,
              },
            },
  
          }
  
          const encode = btoa(JSON.stringify(ibcMessage));
  
          //execute sendNft
          setFetchData({
            ...fetchData,
            status:true,
          }) 
          const sendData = await junoClientSigner.execute(
            connectedAccount,
            junocw721Contract,
            {
              send_nft:
              {
                contract: junoicsBridgeContract,
                token_id: `${selectedNFT}`,
                msg: encode
              }
            },
            "auto"
          )
          console.log(sendData)

          setFetchData({
            status:false,
            msg:"Nft Sent Successfully"
          })
          setDestinationAddress(null)
        }
      } catch (error) {
        setFetchData({
          status:false,
          msg:"Error in Sending Nft"
        })
      }

    }

    return (
      <div className="flex gap-4">
        {/* //div for NFT list */}
        <div className='w-[150%] h-[450px] border border-zinc-800 rounded-2xl p-4'>
          <div className='flex gap-3 items-center mt-1'>
            <h1 className='text-xl tracking-wider font-bold'>Your NFTs on</h1>
            <div className=' flex gap-3 rounded-3xl border border-pink-600 px-3 py-2 items-center'>
              <img width={25} height={25} src={departureChain === "Juno" ? `https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/juno/ujuno.png` : `https://stargaze.zone/logo.png`} alt="" />
              <h1 className='text-sm '>{departureChain}</h1>
            </div>
          </div>
          {/* //div for list */}
          <div className='flex flex-wrap mt-5 gap-6'>
            {yourNfts?.map((item) => (
              <NftListCard itemNumber={item} />
            ))}
          </div>
        </div>
        {/* //div for content */}
        <div className="flex flex-col items-center border border-zinc-800 rounded-2xl p-6 w-full">
          <div className='w-full flex justify-between items-center gap-4'>
            <h1 className="text-xl tracking-wider font-bold">Destination</h1>
            <div className=' flex gap-3 rounded-3xl border border-pink-600 px-4 py-2 items-center'>
              <img width={25} height={25} src={destinationChain === "Juno" ? `https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/juno/ujuno.png` : `https://stargaze.zone/logo.png`} alt="" />
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
          <button className='border mt-10 border-pink-500 rounded-3xl px-8 py-2 hover:bg-pink-600' onClick={handleSendNft}>
            {fetchData.status===true?"Sending":"Send"}
          </button>
          {fetchData.msg &&(
            <h2 className='text-sm tracking-wider font-semibold mt-10 text-pink-600'>{fetchData.msg}</h2>
          )}

          <button onClick={mintNft}>mint</button>
        </div>
      </div>
    )
  }

  export default NFTList