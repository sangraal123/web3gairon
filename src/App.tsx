// import { ConnectKitButton } from 'connectkit'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import {
  useAccount,
  // WindowProvider
} from 'wagmi'

import { Account } from './components'

import {
  createWalletClient,
  http,
  custom,
  WalletClient,
  parseUnits,
  getAddress,
} from 'viem'
import { sepolia } from 'viem/chains'
import { TokenboundClient } from '@tokenbound/sdk'

import { useCallback, useEffect, useState } from 'react'

// interface WindowProvider {
//   request: (...args: any[]) => Promise<any>
//   // Add other properties and methods you expect to use
// }

declare global {
  interface Window {
    // ethereum?: WindowProvider
    ethereum?: any // CoinbaseWalletSDK also defines window.ethereum, so we have to work around that :(
  }
}

// const sendingTBA = '0x047A2F5c8C97948675786e9a1A12EB172CF802a1'  // Sapienz #5 on Goerli w/ V2 contract: https://tokenbound.org/assets/goerli/0x26c55c8d83d657b2fc1df497f0c991e3612bc6b2/5
const sendingTBA = '0x05D1A0b8Cdc62E366CEe49C95A2B498C9b0f6CF7' // Sapienz #5 on Goerli w/ V3 contract
const recipientAddress = getAddress('0x7CA59586338fF416769846Be369E1706b18F4f89')
const ethAmount = 0.005
const ethAmountWei = parseUnits(`${ethAmount}`, 18)

const TOKEN_CONTRACT = `0x0000000000000000000000000000000000000000`
const TOKEN_ID = '0'   

export function App() {
  const { isConnected, address } = useAccount()

  const [tokenContractInput, setTokenContractInput] = useState(TOKEN_CONTRACT)
  const [tokenIdInput, setTokenIdInput] = useState(TOKEN_ID)

  const walletClient: WalletClient = createWalletClient({
    chain: sepolia,
    account: address,
    // transport: http(),
    transport: window.ethereum ? custom(window.ethereum) : http(),
  })

  const tokenboundClient = new TokenboundClient({
    walletClient,
    chainId: sepolia.id,
    // implementationAddress: '0x2d25602551487c3f3354dd80d76d54383a243358',
  })

  useEffect(() => {
    async function testTokenboundClass() {
      if (!tokenboundClient) return

      const tokenboundAccount = tokenboundClient.getAccount({
        tokenContract: tokenContractInput as `0x${string}`,
        tokenId: tokenIdInput,
      })

      const preparedExecution = await tokenboundClient.prepareExecution({
        account: tokenboundAccount,
        to: recipientAddress,
        value: 0n,
        data: '',
      })

      const preparedCreateAccount = await tokenboundClient.prepareCreateAccount({
        tokenContract: tokenContractInput as `0x${string}`,
        tokenId: tokenIdInput,
      })

      console.log('getAccount', tokenboundAccount)
      console.log('preparedExecution', preparedExecution)
      console.log('preparedAccount', preparedCreateAccount)

      // if (address) {
      //   walletClient?.sendTransaction(preparedCreateAccount)
      //   walletClient?.sendTransaction(preparedExecuteCall)
      // }
    }

    testTokenboundClass()
  }, [tokenContractInput, tokenIdInput])

  const createAccount = useCallback(async () => {
    if (!tokenboundClient || !address) return
    const createdAccount = await tokenboundClient.createAccount({
      tokenContract: tokenContractInput as `0x${string}`,
      tokenId: tokenIdInput,
    })
    console.log(`new account: ${createdAccount.account}`)
    alert(`new account: ${createdAccount.account}`)
  }, [tokenboundClient, tokenContractInput, tokenIdInput])

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

  return (
    <>
      <h1>erc6551 demo</h1>
      <ConnectButton />
      {isConnected && <Account />}
      {address && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            margin: '32px 0 0',
            maxWidth: '480px',
          }}
        >

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
        <button onClick={() => createAccount()}>CREATE ACCOUNT</button>
        <br/>※OpenSeaなどで作成したERC-1155には対応してません
{/*
        <button onClick={() => execute()}>EXECUTE</button>
        <button onClick={() => transferETH()}>TRANSFER ETH</button>
*/}
        </div>
      )}
    </>
  )
}
