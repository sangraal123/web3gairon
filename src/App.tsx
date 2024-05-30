// import { ConnectKitButton } from 'connectkit'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import {
  useAccount,
  // WindowProvider
} from 'wagmi'

import { Account } from './components'

import {
  createWalletClient,
  createPublicClient,
  http,
  custom,
  WalletClient,
  parseUnits,
  getAddress,
} from 'viem'
import { sepolia } from 'viem/chains'
import { TokenboundClient } from '@tokenbound/sdk'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@mui/material';

import Web3Mint from '../artifacts/contracts/Web3Mint.sol/Web3Mint.json';

// interface WindowProvider {
//   request: (...args: any[]) => Promise<any>
//   // Add other properties and methods you expect to use
// }

interface Contract {
  address: string;
}

interface TokenMetadata {
  tokenType: string;
}

interface TokenId {
  tokenId: string;
  tokenMetadata: TokenMetadata;
}

interface TokenUri {
  raw: string;
  gateway: string;
}

interface Media {
  raw: string;
  gateway: string;
}

interface Attribute {
  value: string;
  trait_type: string;
}

interface Metadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: Attribute[];
}

interface OwnedNft {
  contract: Contract;
  id: TokenId;
  title: string;
  description: string;
  tokenUri: TokenUri;
  media: Media[];
  metadata: Metadata;
  timeLastUpdated: string;
}

import NftCard from './components/nftcard';

declare global {
  interface Window {
    // ethereum?: WindowProvider
    ethereum?: any // CoinbaseWalletSDK also defines window.ethereum, so we have to work around that :(
  }
}

// const sendingTBA = '0x047A2F5c8C97948675786e9a1A12EB172CF802a1'  // Sapienz #5 on Goerli w/ V2 contract: https://tokenbound.org/assets/goerli/0x26c55c8d83d657b2fc1df497f0c991e3612bc6b2/5
// const sendingTBA = '0xa2221cc0f5012D60d0bF91B840A4Ef990D44Ae39' // Sapienz #5 on Goerli w/ V3 contract
// const recipientAddress = getAddress('0x9FefE8a875E7a9b0574751E191a2AF205828dEA4')
// const ethAmount = 0.005
// const ethAmountWei = parseUnits(`${ethAmount}`, 18)

// const TOKEN_CONTRACT = `0x26c55c8d83d657b2fc1df497f0c991e3612bc6b2`
// const TOKEN_ID = '5'

export function App() {
  const { isConnected, address } = useAccount()

  const walletClient: WalletClient = createWalletClient({
    chain: sepolia,
    account: address,
    // transport: http(),
    transport: window.ethereum ? custom(window.ethereum) : http(),
  })

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http()
  })

  const tokenboundClient = new TokenboundClient({
    walletClient,
    chainId: sepolia.id,
    // implementationAddress: '0x2d25602551487c3f3354dd80d76d54383a243358',
  })

  const [tokenContractInput, setTokenContractInput] = useState('0x0000000000000000000000000000000000000000')
  const [tokenIdInput, setTokenIdInput] = useState('0')
  const [NFTs, setNFTs] = useState<OwnedNft[] | null>(null);

  useEffect(() => {
    async function testTokenboundClass() {
      if (!tokenboundClient) return

      const tokenboundAccount = tokenboundClient.getAccount({
        tokenContract: tokenContractInput as `0x${string}`,
        tokenId: tokenIdInput,
      })
/*
      const preparedExecution = await tokenboundClient.prepareExecution({
        account: tokenboundAccount,
        to: recipientAddress,
        value: 0n,
        data: '',
      })
*/
      const preparedCreateAccount = await tokenboundClient.prepareCreateAccount({
        tokenContract: tokenContractInput as `0x${string}`,
        tokenId: tokenIdInput,
      })

      console.log('getAccount', tokenboundAccount)
//    console.log('preparedExecution', preparedExecution)
      console.log('preparedAccount', preparedCreateAccount)

      // if (address) {
      //   walletClient?.sendTransaction(preparedCreateAccount)
      //   walletClient?.sendTransaction(preparedExecuteCall)
      // }
    }

    testTokenboundClass()
    fetchNFTs()
  }, [tokenContractInput, tokenIdInput, NFTs])

  const createAccount = useCallback(async () => {
    if (!tokenboundClient || !address) return
    const createdAccount = await tokenboundClient.createAccount({
      tokenContract: tokenContractInput as `0x${string}`,
      tokenId: tokenIdInput,
    })
    console.log(`new account: ${createdAccount}`)
    alert(`new account: ${createdAccount}`)
  }, [tokenboundClient])
/*
  const execute = useCallback(async () => {
    if (!tokenboundClient || !address) return
    const executedCall = await tokenboundClient.execute({
      account: sendingTBA,
      to: recipientAddress,
      value: ethAmountWei,
      data: '0x',
    })
    executedCall && alert(`Executed: ${executedCall}`)
  }, [tokenboundClient])

  const transferETH = useCallback(async () => {
    if (!tokenboundClient || !address) return
    const executedTransfer = await tokenboundClient.transferETH({
      account: sendingTBA,
      recipientAddress,
      amount: ethAmount,
    })
    executedTransfer && alert(`Sent ${ethAmount} ETH to ${recipientAddress}`)
  }, [tokenboundClient])
*/

const Pinata_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2MmEzM2I0ZC1jZDYzLTQ1NmEtOWRiYi1hYmFhMGZmMWVkZTMiLCJlbWFpbCI6Imdvb2dvbGhlcm9pY3F1ZXN0c0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYzhlYmI1YjQ0OGMxM2M1Njc2MjYiLCJzY29wZWRLZXlTZWNyZXQiOiJjZTk1NjhjMzNkMWY5NTk4OGNiZmQzOWNhNGMxZGFiMGI0ZmU3N2UwMDY0Yzk2ZDQ2YzI2OGM4N2Q3MzBhZjZjIiwiaWF0IjoxNzE2NTI4NDc1fQ.8ogGbOwOAGhfP0lh9fwSn8ikBYw2Bo7sIdy-ZNuZmd8';
const Pinata_Gateway = 'scarlet-capitalist-goat-720.mypinata.cloud';

const imageToNFT = async (e: any) => {

  console.log(e.target);

  const formData = new FormData();
  formData.append("file", e.target.files[0]);

  const metadata = JSON.stringify({
    name: "Test images",
  });
  formData.append("pinataMetadata", metadata);

  const options = JSON.stringify({
    cidVersion: 0,
  });
  formData.append("pinataOptions", options);

  const res = await fetch(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Pinata_JWT}`,
      },
      body: formData,
    }
  );
  const resData = await res.json();
  const imageURI = `https://${Pinata_Gateway}/ipfs/${resData.IpfsHash}` as string
  console.log(imageURI);

  const name = 'sample' as string;
  const [account] = await walletClient.getAddresses();
  const contractAddress = '0x1255A9Fa337aE9E990Cb12B1fEa9a3D4EfC6bB73';

const { result } = await publicClient.simulateContract({
  address: contractAddress,
  abi: Web3Mint.abi,
  functionName: 'mintIpfsNFT',
  args: [name, resData.IpfsHash],
  account: account,
  chain: sepolia
});


const TxnHash = await walletClient.writeContract({
  address: contractAddress,
  abi: Web3Mint.abi,
  functionName: 'mintIpfsNFT',
  args: [name, resData.IpfsHash],
  account: account,
  chain: sepolia
});
console.log(`https://sepolia.etherscan.io/tx/${TxnHash}`);

setTokenContractInput(contractAddress);
setTokenIdInput(`${Number(result)}`);

}

const Alchemy_API = "IkLCDxEjkwe4tb30m9XNxMu-HRmpeee0";
  const endpoint = `https://eth-sepolia.g.alchemy.com/v2/${Alchemy_API}`;

  const fetchNFTs = async (retryAttempt = 0) => {
    const [account] = await walletClient.getAddresses();
    if (retryAttempt === 5) {
        return;
    }
    if (account) {
        let data;
        try {
            data = await fetch(`${endpoint}/getNFTs?owner=${account}`).then(data => data.json());
        } catch (e) {
            fetchNFTs(retryAttempt+1);
        }

        setNFTs(data.ownedNfts.sort((a :any, b :any) => {
          const timeA = new Date(a.timeLastUpdated).getTime(); 
          const timeB = new Date(b.timeLastUpdated).getTime(); 
          return timeB - timeA;
        })
        );
        return data;
    }
  }

  return (
    <>
      <div style={{display: 'flex'}}>
      <div style={{width: '50%'}}>
      <div className="title">
      <h1>Web3概論 簡単デモ</h1>
      <ConnectButton />
      {isConnected && <Account />}
      </div>
      <h2>NFTアップローダー</h2>
      <p>画像を選択すると、ERC-721のNFTをミントできます。</p>
      <Button variant="contained">
        画像を選択しＮＦＴをミントする
        <input type="file" style={{
          opacity: '0',
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          cursor: 'pointer'
        }} accept=".jpg , .jpeg , .png" onChange={imageToNFT} />
      </Button>
      {address && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            maxWidth: '480px',
          }}
        >
        <h2>TokenBoundAccount生成機能</h2>
        Token Contract(ERC-721)<input
            type="text"
            placeholder="Please input Token Contract here"
            value={tokenContractInput}
            onChange={(e) => setTokenContractInput(e.target.value)}
        />
        Token ID<input
            type="text"
            placeholder="Please input Token ID here"   
            value={tokenIdInput}
            onChange={(e) => setTokenIdInput(e.target.value)}
        />
        <button onClick={() => createAccount()}>アカウントを生成する</button>
        </div>
      )}
      </div>
      <div style={{width: '50%'}}>
        <h2>保有NFT(Sepolia Testnet)表示機能</h2>
          <section style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {
                    NFTs ? NFTs.slice(0,3).map(NFT => {
                        return (
                           <NftCard image={NFT.media[0].gateway} id={NFT.id.tokenId } title={NFT.title} address={NFT.contract.address} description={NFT.description} attributes={NFT.metadata.attributes} ></NftCard>
                        )
                    }) : <div>No NFTs found</div>
                }
          </section>
  </div>
    </div>
  </>
  )
}
