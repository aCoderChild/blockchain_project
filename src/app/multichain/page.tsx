"use client";
import React, { useState, useEffect } from "react";
import { getNFT, balanceOf, claimTo } from "thirdweb/extensions/erc1155";
import {
  ConnectButton,
  MediaRenderer,
  useActiveAccount,
  useReadContract,
  TransactionButton,
} from "thirdweb/react";
import { accountAbstraction, client, editionDropContract, NFT_TOKEN_IDS, NFT_COLLECTION_NAMES } from "../constants";
import Link from "next/link";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { saveTransaction, createTransactionRecord } from "../utils/transactionHistory";

const NFTGalleryHome: React.FC = () => {
  const smartAccount = useActiveAccount();
  const [selectedNFT, setSelectedNFT] = useState<bigint | null>(null);

  const contract = editionDropContract;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-md border-b border-slate-700/50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
            NFT Gallery
          </h1>
          <p className="text-slate-300 text-lg">
            Browse and preview all available NFT collections
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
            connectModal={{ size: "compact" }}
          />
        </div>

        {/* NFT Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {NFT_TOKEN_IDS.map((tokenId) => (
            <NFTGalleryCard
              key={tokenId.toString()}
              tokenId={tokenId}
              contract={contract}
              smartAccountAddress={smartAccount?.address}
              isSelected={selectedNFT?.toString() === tokenId.toString()}
              onSelect={() => setSelectedNFT(tokenId)}
            />
          ))}
        </div>

        {/* Selected NFT Details Modal */}
        {selectedNFT && (
          <SelectedNFTDetails
            tokenId={selectedNFT}
            contract={contract}
            smartAccountAddress={smartAccount?.address}
            onClose={() => setSelectedNFT(null)}
          />
        )}

        {/* Gallery Info */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-6 mt-12">
          <p className="text-slate-300 text-sm flex items-start gap-3">
            <span className="text-blue-400 mt-0.5">ℹ️</span>
            <span>
              <strong>NFT Gallery:</strong> Browse all available NFT collections on Sepolia. Click on any NFT to view details, check ownership, and prepare for minting.
              <br className="mt-2 block" />
              <span className="text-xs text-slate-400">
                💡 Use the &quot;Batch Minting&quot; feature to mint multiple NFTs at once with custom quantities.
              </span>
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

const NFTGalleryCard: React.FC<{
  tokenId: bigint;
  contract: any;
  smartAccountAddress?: string;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ tokenId, contract, smartAccountAddress, isSelected, onSelect }) => {
  const { data: nft, isLoading: nftLoading } = useReadContract(getNFT, {
    contract,
    tokenId,
    queryOptions: { retry: 1 },
  });

  const { data: balance } = useReadContract(balanceOf, {
    contract,
    owner: smartAccountAddress!,
    tokenId,
    queryOptions: { enabled: !!smartAccountAddress, retry: 2 },
  });

  if (nftLoading) {
    return (
      <div className="group relative bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-xl p-4 overflow-hidden animate-pulse">
        <div className="w-full h-48 bg-purple-500/20 rounded-lg mb-4"></div>
        <div className="w-3/4 h-4 bg-purple-500/20 rounded mb-2"></div>
        <div className="w-1/2 h-3 bg-purple-500/20 rounded"></div>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 text-center">
        <p className="text-slate-400 text-sm">Unable to load NFT</p>
      </div>
    );
  }

  return (
    <div
      onClick={onSelect}
      className={`group relative cursor-pointer transition-all duration-300 rounded-xl overflow-hidden ${
        isSelected
          ? "ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/50"
          : "border border-purple-500/30 hover:border-purple-400/50"
      }`}
    >
      <div className={`bg-gradient-to-br ${isSelected ? "from-cyan-500/20 to-blue-600/10" : "from-purple-500/20 to-purple-600/10"} p-4 h-full`}>
        {/* NFT Image */}
        <div className="relative mb-4 rounded-lg overflow-hidden bg-slate-900/50">
          <MediaRenderer
            client={client}
            src={nft.metadata.image}
            style={{
              width: "100%",
              height: "160px",
              objectFit: "cover",
              borderRadius: "0.5rem",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
            <span className="text-xs font-semibold text-cyan-300 bg-slate-900/80 px-2 py-1 rounded">
              Click to view
            </span>
          </div>
        </div>

        {/* NFT Name */}
        <h3 className={`text-sm font-bold truncate mb-2 ${isSelected ? "text-cyan-300" : "text-white"}`}>
          {NFT_COLLECTION_NAMES[tokenId.toString()] || nft.metadata.name}
        </h3>

        {/* Token ID & Balance */}
        <div className="space-y-1">
          <p className="text-xs text-slate-400">
            ID: <span className="text-slate-300 font-mono">#{tokenId.toString()}</span>
          </p>
          {smartAccountAddress && (
            <p className="text-xs text-slate-400">
              You own: <span className="text-slate-300 font-semibold">{balance?.toString() || "0"}</span>
            </p>
          )}
        </div>

        {/* Selection Badge */}
        {isSelected && (
          <div className="absolute top-2 right-2 bg-cyan-500/20 border border-cyan-400/50 rounded-full p-2">
            <span className="text-cyan-300 text-lg">✓</span>
          </div>
        )}
      </div>
    </div>
  );
};

const SelectedNFTDetails: React.FC<{
  tokenId: bigint;
  contract: any;
  smartAccountAddress?: string;
  onClose: () => void;
}> = ({ tokenId, contract, smartAccountAddress, onClose }) => {
  const { data: nft, isLoading, refetch: refetchNFT } = useReadContract(getNFT, {
    contract,
    tokenId,
    queryOptions: { retry: 1 },
  });

  const { data: balance, refetch: refetchBalance } = useReadContract(balanceOf, {
    contract,
    owner: smartAccountAddress!,
    tokenId,
    queryOptions: { enabled: !!smartAccountAddress, retry: 2 },
  });

  const smartAccount = useActiveAccount();

  if (isLoading || !nft) return null;

  const handleMintSuccess = () => {
    refetchNFT();
    refetchBalance();
    // Save transaction to history
    const transactionRecord = createTransactionRecord(
      "mint",
      [tokenId],
      "0x" + Math.random().toString(16).slice(2)
    );
    saveTransaction(transactionRecord);
    alert("🎉 NFT minted successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl max-w-2xl w-full p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors text-2xl"
        >
          ✕
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* NFT Image */}
          <div className="flex flex-col gap-4">
            <MediaRenderer
              client={client}
              src={nft.metadata.image}
              style={{
                width: "100%",
                borderRadius: "1rem",
                border: "2px solid rgba(168, 85, 247, 0.3)",
              }}
            />
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-2">Token ID</p>
              <p className="text-lg font-mono font-bold text-cyan-300">#{tokenId.toString()}</p>
            </div>
          </div>

          {/* NFT Details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{NFT_COLLECTION_NAMES[tokenId.toString()] || nft.metadata.name}</h2>
              <p className="text-slate-400 text-sm">{nft.metadata.description}</p>
            </div>

            {/* Ownership Info */}
            {smartAccountAddress && (
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-4">
                <p className="text-sm text-slate-400 mb-2">Your Collection</p>
                <p className="text-2xl font-bold text-cyan-300">{balance?.toString() || "0"} Owned</p>
              </div>
            )}

            {/* Collection Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-2">Chain</p>
                <p className="text-white font-semibold">Sepolia</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-2">Type</p>
                <p className="text-white font-semibold">ERC1155</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {smartAccount ? (
                <>
                  <TransactionButton
                    transaction={() =>
                      claimTo({
                        contract: editionDropContract,
                        tokenId: tokenId,
                        to: smartAccount.address,
                        quantity: 1n,
                      })
                    }
                    onTransactionConfirmed={(result: any) => {
                      // Save transaction to history with actual hash
                      const transactionRecord = createTransactionRecord(
                        "mint",
                        [tokenId],
                        result.transactionHash
                      );
                      saveTransaction(transactionRecord);
                      handleMintSuccess();
                    }}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/50"
                  >
                    🚀 Mint This NFT
                  </TransactionButton>
                  <Link
                    href="/batching"
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/50 text-center block"
                  >
                    📦 Batch Mint Multiple
                  </Link>
                </>
              ) : (
                <div className="w-full bg-slate-700/50 text-slate-400 font-bold py-3 px-6 rounded-lg text-center">
                  Connect wallet to mint
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTGalleryHome;
