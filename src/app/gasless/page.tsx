
"use client";
import {
  balanceOf,
  claimTo,
  getNFT,
} from "thirdweb/extensions/erc1155";
import {
  ConnectButton,
  lightTheme,
  MediaRenderer,
  TransactionButton,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import {
  accountAbstraction,
  client,
  editionDropContract,
} from "../constants";
import Link from "next/link";
import React, { useState } from "react";

const tokenIds = [3n, 4n, 5n, 6n, 7n, 8n, 9n];

const GaslessHome: React.FC = () => {
  const smartAccount = useActiveAccount();
  const [transactions, setTransactions] = useState<any[]>([]);

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
            Sponsored Transactions
          </h1>
          <p className="text-slate-300 text-lg">
            Claim NFTs with gas-free transactions powered by account abstraction
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
            theme={lightTheme()}
            connectModal={{ size: "compact" }}
          />
        </div>

        {/* NFT Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {tokenIds.map((tokenId) => (
            <NFTCard
              key={tokenId.toString()}
              tokenId={tokenId}
              smartAccountAddress={smartAccount?.address}
              onTransactionConfirmed={() =>
                handleTransactionConfirmed(
                  tokenId.toString(),
                  "Sepolia"
                )
              }
            />
          ))}
        </div>

        {/* Transaction History */}
        {transactions.length > 0 && (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">📜</span> Transaction History
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-slate-900/50 border border-indigo-500/30 rounded-lg p-4 flex justify-between items-center hover:border-indigo-400/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-white font-semibold">
                      NFT Token ID: {tx.tokenId}
                    </p>
                    <p className="text-slate-400 text-sm mt-1">
                      Chain: {tx.chainName}
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

const NFTCard: React.FC<{
  tokenId: bigint;
  smartAccountAddress?: string;
  onTransactionConfirmed?: () => void;
}> = ({ tokenId, smartAccountAddress, onTransactionConfirmed }) => {
  const { data: nft } = useReadContract(getNFT, {
    contract: editionDropContract,
    tokenId,
  });

  const { data: nftBalance } = useReadContract(balanceOf, {
    contract: editionDropContract,
    owner: smartAccountAddress!,
    tokenId,
    queryOptions: { enabled: !!smartAccountAddress },
  });

  return (
    <div className="group relative h-full bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-500/30 hover:border-indigo-400/50 rounded-2xl p-6 transition-all duration-300 cursor-pointer overflow-hidden">
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-10 blur transition-all duration-300 -z-10"></div>

      <div className="relative z-10 flex flex-col h-full">
        {nft ? (
          <>
            <MediaRenderer
              client={client}
              src={nft.metadata.image}
              style={{
                width: "100%",
                borderRadius: "0.75rem",
                border: "2px solid rgba(99, 102, 241, 0.3)",
                marginBottom: "1rem",
              }}
            />
            <h3 className="text-xl font-extrabold text-white group-hover:text-indigo-300 transition-colors">
              {nft.metadata.name}
            </h3>
            <p className="text-sm text-slate-300 mt-2 flex-grow">
              {nft.metadata.description}
            </p>

            {smartAccountAddress ? (
              <>
                <p className="text-sm mt-4 text-indigo-300 font-semibold">
                  You own: {nftBalance?.toString() || "0"}
                </p>
                <TransactionButton
                  className="mt-4 w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/50"
                  transaction={() =>
                    claimTo({
                      contract: editionDropContract,
                      tokenId,
                      to: smartAccountAddress,
                      quantity: 1n,
                    })
                  }
                  onError={(error) => alert(`Error: ${error.message}`)}
                  onTransactionConfirmed={() => {
                    alert("🎉 Claimed successfully!");
                    onTransactionConfirmed?.();
                  }}
                >
                  ⚡ Claim NFT
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

export default GaslessHome;
