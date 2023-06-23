'use client'
import { createContext } from "react";
import { useState,useEffect } from "react";
import { SigningStargateClient } from "@cosmjs/stargate";
import { CosmWasmClient, GasPrice, setupWebKeplr } from "cosmwasm";
import { useSearchParams } from 'next/navigation'
const stargazeRpc="https://rpc.elgafar-1.stargaze-apis.com/"
const junoRpc="https://rpc.uni.junonetwork.io:443"
const junocw721Contract="juno1z6cem6s7ggkvghvt3ksl9eum8d9mktzp49l8z9ewwxm658je7peswkf4dx"
const junoicsBridgeContract="juno1stv6sk0mvku34fj2mqrlyru6683866n306mfv52tlugtl322zmks26kg7a"
const stargazeicsBridgeContract="stars1dm9ndnq9pe6u3j6klwjf4cldl5whcmjdpkyj6psv2k2pxmx3ztcs9fx3zc"

//supported Chains
const allChains=[
    {chainName:"Juno",chainId:"uni-6"},
    {chainName:"Stargaze",chainId:"elgafar-1"}
]

const Stargaze={
    chainId:"elgafar-1",
    rpcEndpoint:"https://rpc.elgafar-1.stargaze-apis.com/",
    prefix:"stargaze",
    gasPrice:"ustars",
}

const Juno={
    chainId:"uni-6",
    rpcEndpoint:"https://rpc.uni.junonetwork.io:443",
    prefix:"juno",
    gasPrice:"ujunox",
}



//
export const appState= createContext()

//function to add test chain
const addTestChain=async()=>{
    await window.keplr.experimentalSuggestChain({
        chainId: "uni-6",
        chainName: "juno testnet",
        rpc: "https://rpc.uni.junonetwork.io:443",
        rest: "https://juno.web3validator.info:1317",
        bip44: {
            coinType: 118,
        },
        bech32Config: {
            bech32PrefixAccAddr: "juno",
            bech32PrefixAccPub: "junopub",
            bech32PrefixValAddr: "junovaloper",
            bech32PrefixValPub: "junovaloperpub",
            bech32PrefixConsAddr: "junovalcons",
            bech32PrefixConsPub: "junovalconspub"
        },
        currencies: [ 
            { 
                coinDenom: "JUNOX",   
                coinMinimalDenom: "ujunox", 
                coinDecimals: 6, 
                coinGeckoId: "juno-network", 
            }, 
        ],
        feeCurrencies: [
            {
                coinDenom: "JUNOX",
                coinMinimalDenom: "ujunox",
                coinDecimals: 6,
                coinGeckoId: "juno-network",
                gasPriceStep: {
                    low: 0.2,
                    average: 0.3,
                    high: 0.4,
                },
            },
        ],
        stakeCurrency: {
            coinDenom: "JUNOX",
            coinMinimalDenom: "ujunox",
            coinDecimals: 6,
            coinGeckoId: "juno-network",
        },
    });
    
}



const GlobalStateProvider=({children})=>{

    const queryParams=useSearchParams()
    const departure = queryParams.get('departureChain')
    const destination = queryParams.get('destinationChain')

    
    //app state
    const [connectedAccount,setConnectedAccount]=useState(null)
    const [starAccountAddress,setStarAccountAddress]=useState(null)
    const [departureChain,setDepartureChain]=useState(departure)
    const [destinationChain,setDestinationChain]=useState(destination)
    const [selectedNFT,setSelectedNFT]=useState(null)
    const [junoClientSigner,setJunoClientSigner]=useState(null)
    const [yourNfts, setYourNfts] = useState([])


    // juno14u7pcjqercu9k2s40ppq8mk89gwqhxhkuayw7p080at2r6vustwse8xg05
    
    //wallet connect function
    const connectKeplrWallet=async()=>{
        console.log("connect wallet")
        try {

            //addTestChain()
            
            //check if keplr wallet is installed or not
            if(!window.keplr){
                throw new Error('Keplr Wallet extension not found');
            }

            //request user to allow access to the wallet 
            await window.keplr.enable(["uni-6","elgafar-1"]);

            //get cosmoshub-4 keplr wallet signer
            const junoOfflineSigner=await window.keplr.getOfflineSigner("uni-6")
            const account=await junoOfflineSigner.getAccounts();
            setConnectedAccount(account[0]?.address)



            //create signingclient
            const junoSigningClient=await setupWebKeplr({
                rpcEndpoint:junoRpc,
                chainId:"uni-6",
                prefix:"juno",
                gasPrice: GasPrice.fromString("0.25ujunox"),
            })
            setJunoClientSigner(junoSigningClient)

        
        } catch (error) {
            console.log(`error connecting to keplr wallet: ${error}`)
        }
    }

    //function to fetch nfts
    const fetchNfts = async () => {
        console.log("fetch nft")
        if (departureChain === "Juno") {
            console.log(junoClientSigner)
            console.log(connectedAccount)
          const data = await junoClientSigner?.queryContractSmart(junocw721Contract, {
            tokens: {
              owner: connectedAccount,
              start_after: "",
              limit: 10,
            }
          })
          setYourNfts(data?.tokens)
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
                connectKeplrWallet,
                connectedAccount,
                junoClientSigner,
                junocw721Contract,
                junoicsBridgeContract,
                stargazeicsBridgeContract,
                selectedNFT,
                setSelectedNFT,
                fetchNfts,
                yourNfts

                
            }}>
        {children}
        </appState.Provider>
    )
}

export default GlobalStateProvider;