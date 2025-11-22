"use client";
import React, { useState } from "react";
import {
  balanceOf,
  claimTo,
  getNFT,
} from "thirdweb/extensions/erc1155";
import {
  ConnectButton,
  MediaRenderer,
  TransactionButton,
  useActiveAccount,
  useReadContract,
  useActiveWallet,
} from "thirdweb/react";
import { accountAbstraction, client, editionDropAddress, supportedChains } from "../constants";
import Link from "next/link";
import { getContract } from "thirdweb";

const tokenIds = [3n, 4n, 5n];

const MultichainHome: React.FC = () => {
  const smartAccount = useActiveAccount();
  const wallet = useActiveWallet();
  const [selectedChain, setSelectedChain] = useState(supportedChains[0]);
  const [transactions, setTransactions] = useState<any[]>([]);

  const currentContract = getContract({
    address: editionDropAddress,
    chain: selectedChain,
    client,
  });

  const handleTransactionConfirmed = (tokenId: string, chainName: string) => {
    const newTransaction = {
      id: Date.now(),
      tokenId,
      chainName,
      timestamp: new Date().toLocaleString(),
      status: "Confirmed",
    };
    setTransactions([newTransaction, ...transactions]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-md border-b border-slate-700/50 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
            Multichain NFT Claims
          </h1>
          <p className="text-slate-300 text-lg">
            Claim NFTs across multiple blockchains with sponsored transactions
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow max-w-6xl mx-auto w-full px-4 py-12">
        {/* Connect Button */}
        <div className="flex justify-center mb-12">
          <ConnectButton
            client={client}
            accountAbstraction={accountAbstraction}
            connectModal={{ size: "compact" }}
          />
        </div>

        {/* Chain Selection */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">Select Chain</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {supportedChains.map((chain) => (
              <button
                key={chain.id}
                onClick={() => setSelectedChain(chain)}
                className={`p-4 rounded-lg font-semibold transition-all duration-300 ${
                  selectedChain.id === chain.id
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/50"
                    : "bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:border-indigo-500/50"
                }`}
              >
                {chain.name}
              </button>
            ))}
          </div>
        </div>

        {/* NFT Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {tokenIds.map((tokenId) => (
            <MultichainNFTCard
              key={tokenId.toString()}
              tokenId={tokenId}
              chain={selectedChain}
              smartAccountAddress={smartAccount?.address}
              onTransactionConfirmed={() =>
                handleTransactionConfirmed(tokenId.toString(), selectedChain.name || "Unknown Chain")
              }
            />
          ))}
        </div>

        {/* Transaction History */}
        {transactions.length > 0 && (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">🌐</span> Multichain Transaction History
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-slate-900/50 border border-purple-500/30 rounded-lg p-4 flex justify-between items-center hover:border-purple-400/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-white font-semibold">
                      NFT Token ID: {tx.tokenId}
                    </p>
                    <p className="text-purple-300 text-sm mt-1">
                      🔗 Chain: {tx.chainName}
                    </p>
                    <p className="text-slate-500 text-xs mt-1">{tx.timestamp}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-green-300 text-sm font-semibold">
                      {tx.status}
                    </span>
                    <span className="text-2xl">✓</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700/50 py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="text-slate-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-2 group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            Back to menu
          </Link>
        </div>
      </div>
    </div>
  );
};

const MultichainNFTCard: React.FC<{
  tokenId: bigint;
  chain: any;
  smartAccountAddress?: string;
  onTransactionConfirmed?: () => void;
}> = ({ tokenId, chain, smartAccountAddress, onTransactionConfirmed }) => {
  const contract = getContract({
    address: editionDropAddress,
    chain,
    client,
  });

  const { data: nft } = useReadContract(getNFT, {
    contract,
    tokenId,
  });

  const { data: nftBalance } = useReadContract(balanceOf, {
    contract,
    owner: smartAccountAddress!,
    tokenId,
    queryOptions: { enabled: !!smartAccountAddress },
  });

  return (
    <div className="group relative h-full bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 hover:border-purple-400/50 rounded-2xl p-6 transition-all duration-300 cursor-pointer overflow-hidden">
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-10 blur transition-all duration-300 -z-10"></div>

      <div className="relative z-10 flex flex-col h-full">
        {nft ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300">
                {chain.name}
              </span>
              <span className="text-sm text-slate-400">#{tokenId.toString()}</span>
            </div>

            <MediaRenderer
              client={client}
              src={nft.metadata.image}
              style={{
                width: "100%",
                borderRadius: "0.75rem",
                border: "2px solid rgba(168, 85, 247, 0.3)",
                marginBottom: "1rem",
              }}
            />
            <h3 className="text-xl font-extrabold text-white group-hover:text-purple-300 transition-colors">
              {nft.metadata.name}
            </h3>
            <p className="text-sm text-slate-300 mt-2 flex-grow">
              {nft.metadata.description}
            </p>

            {smartAccountAddress ? (
              <>
                <p className="text-sm mt-4 text-purple-300 font-semibold">
                  You own: {nftBalance?.toString() || "0"} on {chain.name}
                </p>
                <TransactionButton
                  className="mt-4 w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50"
                  transaction={() =>
                    claimTo({
                      contract,
                      tokenId,
                      to: smartAccountAddress,
                      quantity: 1n,
                    })
                  }
                  onError={(error) => alert(`Error: ${error.message}`)}
                  onTransactionConfirmed={() => {
                    alert(`🎉 Claimed on ${chain.name}!`);
                    onTransactionConfirmed?.();
                  }}
                >
                  🌐 Claim on {chain.name}
                </TransactionButton>
              </>
            ) : (
              <p className="text-xs mt-4 text-slate-500 text-center py-4">
                Connect wallet to claim.
              </p>
            )}
          </>
        ) : (
          <p className="text-slate-400">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default MultichainHome;
