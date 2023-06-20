'use client'
import { createContext } from "react";
import { useState,useEffect } from "react";
import { SigningStargateClient } from "@cosmjs/stargate";
import { CosmWasmClient, setupWebKeplr } from "cosmwasm";
const stargazeRpc="https://rpc.elgafar-1.stargaze-apis.com/"
const cosmoshubRpc="https://cosmos-testnet-rpc.polkachu.com/"



export const appState= createContext()



//nft collection
const nftCollections=[
    {name:"nft1",contractAddress:"asffgg"},
    {name:"nft2",contractAddress:"jhagfjha"}
]

//supported Chains
const supportedChains=[
    {chainName:"Cosmos-hub",chainId:"theta-testnet-001"},
    {chainName:"Stargaze",chainId:"elgafar-1"}
]

const GlobalStateProvider=({children})=>{
    
    
    //app state
    const [signer,setSigner]=useState(null);
    const [connectedAccount,setConnectedAccount]=useState(null)
    const [allChains,setAllChains]=useState(supportedChains);
    const [allNftCollections,setAllNftCollections]=useState(nftCollections)
    const [departureChain,setDepartureChain]=useState(null)
    const [destinationChain,setDestinationChain]=useState(null)
    const [cosmoClientSigner,setCosmoClientSigner]=useState(null)
    const [starClientSigner,setStarClientSigner]=useState(null)
    const [cosmocw721Contract,setCosmocw721Contract]=useState(" ")
    const [starcw721Contract,setStarcw721Contract]=useState(" ")
    const [cosmoics721Contract,setCosmoics721Contract]=useState(" ")
    const [starics721Contract,setStarics721Contract]=useState(" ")

    
    
    //wallet connect function
    const connectKeplrWallet=async()=>{
        try {
            //check if keplr wallet is installed or not
            if(!window.keplr){
                throw new Error('Keplr Wallet extension not found');
            }

            //request user to allow access to the wallet 
            await window.keplr.enable(["theta-testnet-001","elgafar-1"]);

            //get cosmoshub-4 keplr wallet signer
            const cosmoOfflineSigner=await window.keplr.getOfflineSigner("theta-testnet-001")

            //get stargaze offline signer
            const starOfflineSigner=await window.keplr.getOfflineSigner("elgafar-1")


            //create signingclient for cosmoshub
            const cosmoSigningClient=await setupWebKeplr({
                rpcEndpoint:cosmoshubRpc,
                chainId:"theta-testnet-001",
                prefix:"cosmos"
            })
            setCosmoClientSigner(cosmoSigningClient)
            console.log(cosmoSigningClient)

            //create signingclient for stargaze
            const starSigningClient=await setupWebKeplr({
                rpcEndpoint:stargazeRpc,
                chainId:"elgafar-1",
                prefix:"stargaze"
            })
            setStarClientSigner(starSigningClient)
            starSigningClient.execute()
            
            //for stargraze
            const starAccount= await starOfflineSigner.getAccounts();
            console.log(starAccount[0].address)

            //cosmohub
            const cosmoAccount= await cosmoOfflineSigner.getAccounts();
            setConnectedAccount(cosmoAccount[0].address)


        
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
                cosmoClientSigner,
                starClientSigner,
                cosmocw721Contract,
                starcw721Contract,
                cosmoics721Contract,
                starics721Contract

                
            }}>
        {children}
        </appState.Provider>
    )
}

export default GlobalStateProvider;