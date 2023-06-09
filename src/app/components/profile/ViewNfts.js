"use client";
import { useEffect, useState } from "react";
import { useAccount, useContractReads } from "wagmi";

import nftABI from "../../abi/nft.json";

export function ViewNfts({ profAddress }) {
  // state
  const [tokenId, setTokenId] = useState(0);

  const nftContract = {
    address: process.env.nftAddress,
    abi: nftABI,
  };

  // wagmi hooks
  const { isConnected, address } = useAccount();
  const { data, isLoading } = useContractReads({
    contracts: [
      {
        ...nftContract,
        functionName: "tokenOfOwnerByIndex",
        args: [profAddress, 0],
      },
      {
        ...nftContract,
        functionName: "balanceOf",
        args: [profAddress],
      },
      {
        ...nftContract,
        functionName: "tokenURI",
        args: [tokenId],
      },
    ],
  });

  const getNftImage = async () => {
    console.log(data);
    console.log(tokenId);

    let metadata_url;
    const prefix = "ipfs://";
    const metadata = data[2].result.toString();
    if (metadata.startsWith(prefix))
      metadata_url = `https://cloudflare-ipfs.com/ipfs/${metadata.slice(
        prefix.length
      )}.json`;

    const response = await fetch(metadata_url, {
      method: "GET",
      mode: "no-cors",
    });
    console.log(response);
  };

  useEffect(() => {
    if (data[0].result) setTokenId(parseInt(data[0].result.toString()));
    // getNftImage(); // returning an error
  }, []);

  if (!isLoading) {
    return (
      <div className="mx-2 py-4 rounded bg-white text-black border rounded shadow">
        <div className="flex flex-col flex-wrap px-4">
          <div className="py-5">
            <div className="px-5 border-b border-slate-200 pb-4 mb-4">
              <h1 className="lg:text-3xl md:text-2xl text-xl font-bold text-slate-500">
                View NFTs
              </h1>
            </div>
            <div className="rounded-lg">
              {data[1].result ? parseInt(data[1].result.toString()) > 0 ? (
                <div className="flex flex-row flex-wrap justify-start">
                  <div className="bg-slate-100 rounded-xl">
                    <div className="flex items-center text-center bg-slate-500 rounded-t-xl w-96 h-28">
                      <h1 className="w-full text-white text-3xl font-bold">
                        NFT
                      </h1>
                    </div>
                    <div className="p-4">
                      <p className="text-xl font-semibold">
                        Id: {data[0].result.toString()}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              ): "-"}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
