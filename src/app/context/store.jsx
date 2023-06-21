'use client'
import { createContext } from "react";
import { useState,useEffect } from "react";
import { SigningStargateClient } from "@cosmjs/stargate";
import { CosmWasmClient, GasPrice, setupWebKeplr } from "cosmwasm";
const stargazeRpc="https://rpc.elgafar-1.stargaze-apis.com/"
const osmosisRpc="https://rpc.osmotest5.osmosis.zone"



export const appState= createContext()



//nft collection
const nftCollections=[
    {name:"nft1",contractAddress:"asffgg"},
    {name:"nft2",contractAddress:"jhagfjha"}
]

//supported Chains
const supportedChains=[
    {chainName:"Osmosis",chainId:"osmo-test-5"},
    {chainName:"Stargaze",chainId:"elgafar-1"}
]

const GlobalStateProvider=({children})=>{
    
    
    //app state
    const [signer,setSigner]=useState(null);
    const [connectedAccount,setConnectedAccount]=useState(null)
    const [starAccountAddress,setStarAccountAddress]=useState(null)
    const [allChains,setAllChains]=useState(supportedChains);
    const [allNftCollections,setAllNftCollections]=useState(nftCollections)
    const [departureChain,setDepartureChain]=useState(null)
    const [destinationChain,setDestinationChain]=useState(null)
    const [selectedNFT,setSelectedNFT]=useState(null)
    const [osmosisClientSigner,setOsmosisClientSigner]=useState(null)
    const [starClientSigner,setStarClientSigner]=useState(null)
    const [osmosiscw721Contract,setOsmosiscw721Contract]=useState("osmo1k3j435f0pkla0tvgv20g73zm86aftg37surzndceex6any89qkvqfj6y4g")
    const [starcw721Contract,setStarcw721Contract]=useState(" ")
    const [osmosisics721Contract,setOsmosisics721Contract]=useState("osmo1x08mcumvth3fg9cv3zkuvk4tf3h3vf2js9cwdyuxapcxu7xrwehsusnhjp")
    const [starics721Contract,setStarics721Contract]=useState("stars1dm9ndnq9pe6u3j6klwjf4cldl5whcmjdpkyj6psv2k2pxmx3ztcs9fx3zc")

    
    
    //wallet connect function
    const connectKeplrWallet=async()=>{
        try {
            //check if keplr wallet is installed or not
            if(!window.keplr){
                throw new Error('Keplr Wallet extension not found');
            }

            //request user to allow access to the wallet 
            await window.keplr.enable(["osmo-test-5","elgafar-1"]);

            //get cosmoshub-4 keplr wallet signer
            const osmosisOfflineSigner=await window.keplr.getOfflineSigner("osmo-test-5")

            //get stargaze offline signer
            const starOfflineSigner=await window.keplr.getOfflineSigner("elgafar-1")


            //create signingclient for cosmoshub
            const osmosisSigningClient=await setupWebKeplr({
                rpcEndpoint:osmosisRpc,
                chainId:"osmo-test-5",
                prefix:"osmos",
                gasPrice: GasPrice.fromString("0.25uosmo"),
            })
            setOsmosisClientSigner(osmosisSigningClient)
            console.log(osmosisSigningClient)

            //create signingclient for stargaze
            const starSigningClient=await setupWebKeplr({
                rpcEndpoint:stargazeRpc,
                chainId:"elgafar-1",
                prefix:"stargaze",
                gasPrice: GasPrice.fromString("0.25ustars"),
            })
            setStarClientSigner(starSigningClient)
            
            //for stargraze
            const starAccount= await starOfflineSigner.getAccounts();
            setStarAccountAddress(starAccount[0].address)

            //for osmosis
            const osmosisAccount= await osmosisOfflineSigner.getAccounts();
            setConnectedAccount(osmosisAccount[0].address)


        
        } catch (error) {
            console.log(`error connecting to keplr wallet: ${error}`)
        }
    }



    
    return (
        <appState.Provider value={
            {
                allChains,
                departureChain,
                setDepartureChain,
                destinationChain,
                setDestinationChain,
                signer,
                connectKeplrWallet,
                connectedAccount,
                osmosisClientSigner,
                starClientSigner,
                osmosiscw721Contract,
                starcw721Contract,
                osmosisics721Contract,
                starics721Contract,
                starAccountAddress,
                selectedNFT,
                setSelectedNFT

                
            }}>
        {children}
        </appState.Provider>
    )
}

export default GlobalStateProvider;