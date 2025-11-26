
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
  NFT_TOKEN_IDS,
  NFT_COLLECTION_NAMES,
  NFT_DESCRIPTIONS,
} from "../constants";
import Link from "next/link";
import React, { useState } from "react";
import { saveTransaction, createTransactionRecord } from "../utils/transactionHistory";

const GaslessHome: React.FC = () => {
  const smartAccount = useActiveAccount();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedTokenId, setSelectedTokenId] = useState<bigint>(3n);

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
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
            Sponsored Transactions
          </h1>
          <p className="text-slate-300 text-lg">
            Experience gas-free NFT claiming powered by account abstraction
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 py-12">
        {/* Connect Button */}
        <div className="flex justify-center mb-12">
          <ConnectButton
            client={client}
            accountAbstraction={accountAbstraction}
            theme={lightTheme()}
            connectModal={{ size: "compact" }}
          />
        </div>

        {/* Hero Section with Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-500/30 rounded-2xl p-8">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-white mb-2">Zero Gas Fees</h3>
            <p className="text-slate-300 text-sm">
              Pay zero gas fees on all your NFT transactions. The sponsorship covers everything.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-2xl p-8">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-bold text-white mb-2">Account Abstraction</h3>
            <p className="text-slate-300 text-sm">
              Smart wallet technology that abstracts away complexity and improves security.
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/10 border border-pink-500/30 rounded-2xl p-8">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-white mb-2">Seamless Experience</h3>
            <p className="text-slate-300 text-sm">
              One-click NFT claiming with no wallets, no approvals, no complications.
            </p>
          </div>
        </div>

        {/* Quick Claim Section */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Claim</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* NFT Selection */}
            <div>
              <p className="text-slate-300 font-semibold mb-4">Select an NFT:</p>
              <div className="space-y-3">
                {NFT_TOKEN_IDS.map((tokenId) => (
                  <button
                    key={tokenId.toString()}
                    onClick={() => setSelectedTokenId(tokenId)}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-300 ${
                      selectedTokenId.toString() === tokenId.toString()
                        ? "bg-indigo-500/20 border-indigo-400/50"
                        : "bg-slate-800/30 border-slate-700/50 hover:border-slate-600/50"
                    }`}
                  >
                    <p className="font-semibold text-white">{NFT_COLLECTION_NAMES[tokenId.toString()]}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected NFT Details */}
            <SelectedNFTQuickView
              tokenId={selectedTokenId}
              smartAccountAddress={smartAccount?.address}
              onTransactionConfirmed={() =>
                handleTransactionConfirmed(selectedTokenId.toString(), "Sepolia")
              }
            />
          </div>
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

        {/* Info Box */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-6 mt-12">
          <p className="text-slate-300 text-sm flex items-start gap-3">
            <span className="text-blue-400 mt-0.5">ℹ️</span>
            <span>
              <strong>How it works:</strong> Select an NFT, click claim, and your transaction is processed instantly with zero gas fees. All sponsored by our account abstraction infrastructure.
            </span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700/50 py-6 px-4 mt-12">
        <div className="max-w-7xl mx-auto">
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

const SelectedNFTQuickView: React.FC<{
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

  if (!nft) return null;

  return (
    <div className="space-y-4">
      <div className="bg-slate-900/50 rounded-lg overflow-hidden border border-slate-700/50">
        <MediaRenderer
          client={client}
          src={nft.metadata.image}
          style={{
            width: "100%",
            height: "300px",
            objectFit: "cover",
          }}
        />
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-2">{NFT_COLLECTION_NAMES[tokenId.toString()] || nft.metadata.name}</h3>
        <p className="text-slate-400 text-sm mb-4">{nft.metadata.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Token ID</p>
            <p className="text-lg font-bold text-cyan-300">#{tokenId.toString()}</p>
          </div>
          {smartAccountAddress && (
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-slate-400 mb-1">You Own</p>
              <p className="text-lg font-bold text-cyan-300">{nftBalance?.toString() || "0"}</p>
            </div>
          )}
        </div>

        {smartAccountAddress ? (
          <TransactionButton
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/50"
            transaction={() =>
              claimTo({
                contract: editionDropContract,
                tokenId,
                to: smartAccountAddress,
                quantity: 1n,
              })
            }
            onTransactionConfirmed={(result: any) => {
              // Save transaction to history
              const transactionRecord = createTransactionRecord(
                "claim",
                [tokenId],
                result.transactionHash
              );
              saveTransaction(transactionRecord);
              onTransactionConfirmed?.();
            }}
          >
            🚀 Claim NFT (Gas-Free)
          </TransactionButton>
        ) : (
          <div className="text-center py-3 text-slate-400 text-sm">
            Connect wallet to claim
          </div>
        )}
      </div>
    </div>
  );
};

export default GaslessHome;
