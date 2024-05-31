// import { ConnectKitButton } from 'connectkit'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  // WindowProvider
} from "wagmi";

import { Account } from "./components";

import {
  createWalletClient,
  createPublicClient,
  http,
  custom,
  WalletClient,
  parseUnits,
  getAddress,
} from "viem";
import { sepolia } from "viem/chains";
import { TokenboundClient } from "@tokenbound/sdk";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@mui/material";

import Web3Mint from "../artifacts/contracts/Web3Mint.sol/Web3Mint.json";

// interface WindowProvider {
//   request: (...args: any[]) => Promise<any>
//   // Add other properties and methods you expect to use
// }

interface NFTContract {
  address: string;
}

interface NFTId {
  tokenId: string;
  tokenMetadata: {
    tokenType: string;
  };
}

interface NFTTokenUri {
  gateway: string;
  raw: string;
}

interface NFTMedia {
  gateway: string;
  raw: string;
}

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
}

interface NFTContractMetadata {
  name: string;
  symbol: string;
  tokenType: string;
  contractDeployer: string;
  deployedBlockNumber: number;
  openSea: object;
}

interface NFT {
  contract: NFTContract;
  id: NFTId;
  balance: string;
  title: string;
  description: string;
  tokenUri: NFTTokenUri;
  media: NFTMedia[];
  metadata: NFTMetadata;
  timeLastUpdated: string;
  contractMetadata: NFTContractMetadata;
}

interface OwnedNFTsResponse {
  ownedNfts: NFT[];
  pageKey: string;
  totalCount: number;
  blockHash: string;
}

import NftCard from "./components/nftcard";

declare global {
  interface Window {
    // ethereum?: WindowProvider
    ethereum?: any; // CoinbaseWalletSDK also defines window.ethereum, so we have to work around that :(
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
  const { isConnected, address } = useAccount();

  const walletClient: WalletClient = createWalletClient({
    chain: sepolia,
    account: address,
    // transport: http(),
    transport: window.ethereum ? custom(window.ethereum) : http(),
  });

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
  });

  const tokenboundClient = new TokenboundClient({
    walletClient,
    chainId: sepolia.id,
    // implementationAddress: '0x2d25602551487c3f3354dd80d76d54383a243358',
  });

  const [tokenContractInput, setTokenContractInput] = useState(
    "0x0000000000000000000000000000000000000000"
  );
  const [tokenIdInput, setTokenIdInput] = useState("0");
  const [CurrentNFTs, setCurrentNFTs] = useState<NFT[] | undefined>([]);

  useEffect(() => {
    async function testTokenboundClass() {
      if (!tokenboundClient) return;

      const tokenboundAccount = tokenboundClient.getAccount({
        tokenContract: tokenContractInput as `0x${string}`,
        tokenId: tokenIdInput,
      });
      /*
      const preparedExecution = await tokenboundClient.prepareExecution({
        account: tokenboundAccount,
        to: recipientAddress,
        value: 0n,
        data: '',
      })
*/
      const preparedCreateAccount = await tokenboundClient.prepareCreateAccount(
        {
          tokenContract: tokenContractInput as `0x${string}`,
          tokenId: tokenIdInput,
        }
      );

      console.log("getAccount", tokenboundAccount);
      //    console.log('preparedExecution', preparedExecution)
      console.log("preparedAccount", preparedCreateAccount);

      // if (address) {
      //   walletClient?.sendTransaction(preparedCreateAccount)
      //   walletClient?.sendTransaction(preparedExecuteCall)
      // }
    }

    testTokenboundClass();
  }, [tokenContractInput, tokenIdInput]);

  useEffect(() => {
    async function wrapperFetchNFTs() {
      setCurrentNFTs(await fetchNFTs(0));
    }
    wrapperFetchNFTs();
  }, [isConnected]);

  const createAccount = useCallback(async () => {
    if (!tokenboundClient || !address) return;
    const createdAccount = await tokenboundClient.createAccount({
      tokenContract: tokenContractInput as `0x${string}`,
      tokenId: tokenIdInput,
    });
    console.log(`new account: ${createdAccount}`);
    alert(`new account: ${createdAccount}`);
  }, [tokenboundClient]);
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

  const Pinata_JWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2MmEzM2I0ZC1jZDYzLTQ1NmEtOWRiYi1hYmFhMGZmMWVkZTMiLCJlbWFpbCI6Imdvb2dvbGhlcm9pY3F1ZXN0c0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYzhlYmI1YjQ0OGMxM2M1Njc2MjYiLCJzY29wZWRLZXlTZWNyZXQiOiJjZTk1NjhjMzNkMWY5NTk4OGNiZmQzOWNhNGMxZGFiMGI0ZmU3N2UwMDY0Yzk2ZDQ2YzI2OGM4N2Q3MzBhZjZjIiwiaWF0IjoxNzE2NTI4NDc1fQ.8ogGbOwOAGhfP0lh9fwSn8ikBYw2Bo7sIdy-ZNuZmd8";
  const Pinata_Gateway = "scarlet-capitalist-goat-720.mypinata.cloud";

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

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Pinata_JWT}`,
      },
      body: formData,
    });
    const resData = await res.json();
    const imageURI =
      `https://${Pinata_Gateway}/ipfs/${resData.IpfsHash}` as string;
    console.log(imageURI);

    const name = "sample" as string;
    const [account] = await walletClient.getAddresses();
    const contractAddress = "0xeBF9cBa35EE6eDdaBe75CdC90A4a5FD91b733C45";

    const { result } = await publicClient.simulateContract({
      address: contractAddress,
      abi: Web3Mint.abi,
      functionName: "mintIpfsNFT",
      args: [name, resData.IpfsHash],
      account: account,
      chain: sepolia,
    });

    const TxnHash = await walletClient.writeContract({
      address: contractAddress,
      abi: Web3Mint.abi,
      functionName: "mintIpfsNFT",
      args: [name, resData.IpfsHash],
      account: account,
      chain: sepolia,
    });
    console.log(`https://sepolia.etherscan.io/tx/${TxnHash}`);

    setTokenContractInput(contractAddress);
    setTokenIdInput(`${Number(result)}`);

    const unwatch = publicClient.watchEvent({
      address: contractAddress,
      onLogs: async (logs) => {
        console.log("Started watching events.");
        console.log(CurrentNFTs);
        const newNFTs = await fetchNFTs(0);
        setCurrentNFTs(newNFTs);
        console.log(newNFTs);
      },
    });

    setTimeout(() => {
      unwatch();
      console.log("Stopped watching events.");
    }, 60000);

  };

  const Alchemy_API = "IkLCDxEjkwe4tb30m9XNxMu-HRmpeee0";
  const endpoint = `https://eth-sepolia.g.alchemy.com/v2/${Alchemy_API}`;

  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const fetchNFTs = async (second: number, retryAttempt = 0) => {
    const [account] = await walletClient.getAddresses();
    if (retryAttempt === 5) {
      return;
    }
    if (account) {
      try {
        await sleep(second * 1000);
        const data = (await fetch(`${endpoint}/getNFTs?owner=${account}`).then(
          (data) => data.json()
        )) as OwnedNFTsResponse;
        // console.log(data.ownedNfts[0].contractMetadata.deployedBlockNumber);
        return await data.ownedNfts.sort((a, b) => {
          if (
            b.contractMetadata.deployedBlockNumber !==
            a.contractMetadata.deployedBlockNumber
          ) {
            return (
              b.contractMetadata.deployedBlockNumber -
              a.contractMetadata.deployedBlockNumber
            );
          } else {
            return Number(b.id.tokenId) - Number(a.id.tokenId);
          }
        });
      } catch (e) {
        fetchNFTs(retryAttempt + 1);
      }
    }
  };

  return (
    <>
      <div className="title">
        <h1>Web3概論 簡単デモ</h1>
        <ConnectButton />
        {isConnected && <Account />}
      </div>
      {address && (
        <div style={{ display: "flex" }}>
          <div style={{ width: "50%" }}>
            <h2>NFTアップローダー</h2>
            <p>画像を選択すると、ERC-721のNFTをミントできます。</p>
            <Button variant="contained">
              画像を選択しＮＦＴをミントする
              <input
                type="file"
                style={{
                  opacity: "0",
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "100%",
                  cursor: "pointer",
                }}
                accept=".jpg , .jpeg , .png"
                onChange={imageToNFT}
              />
            </Button>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                maxWidth: "400px",
              }}
            >
              <h2>TokenBoundAccount生成機能</h2>
              Token Contract(ERC-721)
              <input
                type="text"
                placeholder="Please input Token Contract here"
                value={tokenContractInput}
                onChange={(e) => setTokenContractInput(e.target.value)}
              />
              Token ID
              <input
                type="text"
                placeholder="Please input Token ID here"
                value={tokenIdInput}
                onChange={(e) => setTokenIdInput(e.target.value)}
              />
              <Button variant="contained" onClick={() => createAccount()}>
                アカウントを生成する
              </Button>
            </div>
          </div>
          <div style={{ width: "50%" }}>
            <h2>保有NFT(Sepolia Testnet)表示機能</h2>
            <NftList passedNFTs={CurrentNFTs} />
          </div>
        </div>
      )}
    </>
  );
}

interface NftListProp {
  passedNFTs: NFT[] | undefined;
}

const NftList = ({ passedNFTs }: NftListProp) => {
  return (
    <section
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "left" }}
    >
      {passedNFTs ? (
        passedNFTs.slice(0, 3).map((NFT) => {
          return (
            <NftCard
              key={`${NFT.contract.address}_${NFT.id.tokenId}`}
              image={NFT.media[0].gateway}
              id={NFT.id.tokenId}
              title={NFT.title}
              address={NFT.contract.address}
              description={NFT.description}
            />
          );
        })
      ) : (
        <div>No NFTs found</div>
      )}
    </section>
  );
};
