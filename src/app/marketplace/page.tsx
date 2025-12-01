"use client";
import React, { useState, useEffect } from "react";
import {
  ConnectButton,
  MediaRenderer,
  useActiveAccount,
  useReadContract,
  TransactionButton,
} from "thirdweb/react";
import { getNFT, balanceOf, setApprovalForAll } from "thirdweb/extensions/erc1155";
import { prepareContractCall, toWei, readContract } from "thirdweb";
import {
  accountAbstraction,
  client,
  editionDropContract,
  editionDropAddress,
  marketplaceContract,
  marketplaceAddress,
  NFT_TOKEN_IDS,
  NFT_COLLECTION_NAMES,
  chain,
} from "../constants";
import Link from "next/link";
import { lightTheme } from "thirdweb/react";
import {
  getActiveListings,
  saveMarketplaceListing,
  updateListingStatus,
  getSellerListings,
  MarketplaceListing,
} from "../utils/marketplaceFirebase";
import { MARKETPLACE_ABI } from "../utils/marketplaceABI";

const MarketplacePage: React.FC = () => {
  const smartAccount = useActiveAccount();
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [showListForm, setShowListForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"price-low" | "price-high" | "newest">("newest");
  const [myListings, setMyListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);

  // Load listings
  useEffect(() => {
    const loadListingsData = async () => {
      try {
        setLoading(true);
        const active = await getActiveListings();
        let filtered = active.filter(l =>
          l.collectionName.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (sortBy === "price-low") {
          filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (sortBy === "price-high") {
          filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        } else {
          filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        }

        setListings(filtered);
      } catch (error) {
        console.error("Error loading listings:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadListingsData();
    const interval = setInterval(loadListingsData, 5000);
    return () => clearInterval(interval);
  }, [searchQuery, sortBy]);

  // Load user's listings
  useEffect(() => {
    const loadUserListings = async () => {
      if (smartAccount?.address) {
        try {
          const userListings = await getSellerListings(smartAccount.address);
          setMyListings(userListings);
        } catch (error) {
          console.error("Error loading user listings:", error);
        }
      }
    };
    loadUserListings();
  }, [smartAccount?.address, listings]);

  const loadListings = async () => {
    try {
      const active = await getActiveListings();
      let filtered = active.filter(l =>
        l.collectionName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (sortBy === "price-low") {
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      } else if (sortBy === "price-high") {
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      } else {
        filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      }

      setListings(filtered);
    } catch (error) {
      console.error("Error loading listings:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900/90 to-emerald-900/40 backdrop-blur-xl border-b-2 border-emerald-500/30 p-8 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent mb-3">
            NFT Marketplace
          </h1>
          <p className="text-slate-300 text-xl">
            Discover, trade, and collect exclusive digital assets
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

        {/* My Listings Section */}
        {smartAccount && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">My Listings</h2>
              <button
                onClick={() => setShowListForm(!showListForm)}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-lg transition-all duration-300"
              >
                {showListForm ? "Cancel" : "📋 Create Listing"}
              </button>
            </div>

            {/* List Form */}
            {showListForm && <ListForm smartAccount={smartAccount} onSuccess={async () => {
              setShowListForm(false);
              await loadListings();
            }} />}

            {/* My Active Listings */}
            {myListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {myListings.map(listing => (
                  <MyListingCard
                    key={listing.id}
                    listing={listing}
                    onCancelled={async () => {
                      await updateListingStatus(listing.id, "cancelled");
                      await loadListings();
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6 mb-12 text-center">
                <p className="text-slate-400">You have no active listings</p>
              </div>
            )}
          </div>
        )}

        {/* Marketplace Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Marketplace</h2>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search NFT collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:border-indigo-400/50 focus:outline-none transition-colors"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">🔍</span>
            </div>

            <div className="space-y-3">
              <p className="text-slate-300 font-semibold text-sm">Sort By</p>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as any);
                  setTimeout(loadListings, 100);
                }}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:border-indigo-400/50 focus:outline-none transition-colors"
              >
                <option value="newest">Newest Listings</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Listings Grid */}
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {listings.map((listing) => (
                <MarketplaceListingCard
                  key={listing.id}
                  listing={listing}
                  buyerAddress={smartAccount?.address}
                  onPurchased={async () => {
                    await updateListingStatus(listing.id, "sold");
                    await loadListings();
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-12 text-center">
              <div className="text-6xl mb-4">🏪</div>
              <p className="text-slate-300 text-lg">
                {searchQuery ? "No listings found" : "No listings yet"}
              </p>
              {!searchQuery && (
                <p className="text-slate-400 text-sm mt-2">
                  Be the first to list an NFT for sale!
                </p>
              )}
            </div>
          )}
        </div>

        {/* Marketplace Stats */}
        <div className="grid md:grid-cols-4 gap-5 mt-12 mb-12">
          <div className="group bg-gradient-to-br from-teal-500/15 to-teal-600/5 border-2 border-teal-500/40 rounded-2xl p-8 hover:shadow-2xl hover:shadow-teal-500/30 transition-all duration-300 hover:-translate-y-2 hover:border-teal-400/70">
            <p className="text-slate-400 text-sm mb-3 font-bold flex items-center gap-2">
              <span className="text-xl">📊</span> Active Listings
            </p>
            <p className="text-5xl font-black text-teal-300 group-hover:scale-110 transition-transform duration-300">{listings.length}</p>
          </div>
          <div className="group bg-gradient-to-br from-emerald-500/15 to-emerald-600/5 border-2 border-emerald-500/40 rounded-2xl p-8 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-400/70">
            <p className="text-slate-400 text-sm mb-3 font-bold flex items-center gap-2">
              <span className="text-xl">📋</span> My Listings
            </p>
            <p className="text-5xl font-black text-emerald-300 group-hover:scale-110 transition-transform duration-300">{myListings.length}</p>
          </div>
          <div className="group bg-gradient-to-br from-cyan-500/15 to-cyan-600/5 border-2 border-cyan-500/40 rounded-2xl p-8 hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400/70">
            <p className="text-slate-400 text-sm mb-3 font-bold flex items-center gap-2">
              <span className="text-xl">💎</span> Floor Price
            </p>
            <p className="text-4xl font-black text-cyan-300 group-hover:scale-110 transition-transform duration-300">
              {listings.length > 0 ? Math.min(...listings.map(l => parseFloat(l.price))).toFixed(2) : "0"} ETH
            </p>
          </div>
          <div className="group bg-gradient-to-br from-teal-500/15 to-emerald-600/5 border-2 border-teal-500/40 rounded-2xl p-8 hover:shadow-2xl hover:shadow-teal-500/30 transition-all duration-300 hover:-translate-y-2 hover:border-teal-400/70">
            <p className="text-slate-400 text-sm mb-3 font-bold flex items-center gap-2">
              <span className="text-xl">💰</span> Total Volume
            </p>
            <p className="text-4xl font-black text-emerald-300 group-hover:scale-110 transition-transform duration-300">
              {listings.length > 0 ? listings.reduce((sum, l) => sum + parseFloat(l.price), 0).toFixed(2) : "0"} ETH
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-6">
          <p className="text-slate-300 text-sm flex items-start gap-3 mb-3">
            <span className="text-blue-400 mt-0.5">ℹ️</span>
            <span>
              <strong>Fully Automated NFT Marketplace:</strong> Powered by smart contracts - instant purchases with automatic NFT + ETH transfers!
            </span>
          </p>
          <div className="ml-8 space-y-2 text-slate-400 text-xs">
            <p><strong className="text-emerald-300">For Sellers:</strong></p>
            <ol className="list-decimal ml-5 space-y-1">
              <li>Approve marketplace contract (one-time)</li>
              <li>Create listing with price & quantity</li>
              <li>Receive ETH instantly when someone buys!</li>
            </ol>
            <p className="mt-3"><strong className="text-cyan-300">For Buyers:</strong></p>
            <ol className="list-decimal ml-5 space-y-1">
              <li>Browse global listings from all sellers</li>
              <li>Click &quot;Buy Now&quot; and pay in ETH</li>
              <li>NFT transfers to your wallet automatically!</li>
            </ol>
            <p className="mt-3 text-green-300">✅ Real marketplace: {marketplaceAddress}</p>
          </div>
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

const ListForm: React.FC<{
  smartAccount: any;
  onSuccess: () => void;
}> = ({ smartAccount, onSuccess }) => {
  const [selectedTokenId, setSelectedTokenId] = useState<string>("3");
  const [price, setPrice] = useState<string>("0.1");
  const [quantity, setQuantity] = useState<number>(1);
  const [isApproved, setIsApproved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check user's NFT balance
  const { data: nftBalance } = useReadContract(balanceOf, {
    contract: editionDropContract,
    owner: smartAccount?.address || "0x0000000000000000000000000000000000000000",
    tokenId: BigInt(selectedTokenId),
  });

  // Check if marketplace is approved
  const { data: approvalStatus } = useReadContract({
    contract: editionDropContract,
    method: "function isApprovedForAll(address account, address operator) view returns (bool)",
    params: [smartAccount?.address || "0x0000000000000000000000000000000000000000", marketplaceAddress],
  });

  useEffect(() => {
    if (approvalStatus) {
      setIsApproved(true);
    }
  }, [approvalStatus]);

  const handleCreateListing = async (blockchainListingId: bigint) => {
    setIsSubmitting(true);
    try {
      const collectionName = NFT_COLLECTION_NAMES[selectedTokenId] || `NFT #${selectedTokenId}`;

      // Save to Firebase for UI with blockchain listing ID
      await saveMarketplaceListing({
        seller: smartAccount.address,
        tokenId: selectedTokenId,
        collectionName,
        price,
        quantity,
        timestamp: new Date().toLocaleString(),
        status: "active",
        blockchainListingId: Number(blockchainListingId),
      });

      alert("✅ Listing created successfully!");
      onSuccess();
    } catch (error) {
      console.error("Error creating listing:", error);
      alert("❌ Failed to create listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const userBalance = Number(nftBalance || 0n);
  const canList = userBalance >= quantity;

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-8 mb-12">
      <h3 className="text-xl font-bold text-white mb-6">Create New Listing</h3>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* NFT Selection */}
          <div>
            <label className="text-slate-300 font-semibold text-sm mb-3 block">Select NFT</label>
            <select
              value={selectedTokenId}
              onChange={(e) => setSelectedTokenId(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:border-indigo-400/50 focus:outline-none"
            >
              {NFT_TOKEN_IDS.map((id) => (
                <option key={id.toString()} value={id.toString()}>
                  {NFT_COLLECTION_NAMES[id.toString()] || `NFT #${id}`}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="text-slate-300 font-semibold text-sm mb-3 block">Price (ETH)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:border-indigo-400/50 focus:outline-none"
              placeholder="0.1"
            />
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="text-slate-300 font-semibold text-sm mb-3 block">
            Quantity (You own: {userBalance})
          </label>
          <input
            type="number"
            min={1}
            max={Math.min(10, userBalance)}
            value={quantity || 1}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setQuantity(isNaN(val) ? 1 : val);
            }}
            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:border-indigo-400/50 focus:outline-none"
          />
          {!canList && (
            <p className="text-red-400 text-xs mt-2">
              ⚠️ You don&apos;t own enough NFTs. You have {userBalance}, trying to list {quantity}.
            </p>
          )}
        </div>

        {/* Step 1: Approve Marketplace */}
        {!isApproved && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-300 text-sm mb-3">
              <strong>Step 1:</strong> Approve marketplace to transfer your NFTs
            </p>
            <TransactionButton
              transaction={() =>
                prepareContractCall({
                  contract: editionDropContract,
                  method: "function setApprovalForAll(address operator, bool approved)",
                  params: [marketplaceAddress, true],
                })
              }
              onTransactionConfirmed={() => {
                setIsApproved(true);
                alert("✅ Marketplace approved! Now create your listing.");
              }}
              onError={(error) => {
                console.error("Approval error:", error);
                alert("❌ Failed to approve marketplace.");
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
            >
              ✅ Approve Marketplace
            </TransactionButton>
          </div>
        )}

        {/* Step 2: Create Listing */}
        {isApproved && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-300 text-sm mb-3">
              <strong>Step 2:</strong> Create your listing on the blockchain
            </p>
            <TransactionButton
              transaction={() =>
                prepareContractCall({
                  contract: marketplaceContract,
                  method: "function createListing(address nftContract, uint256 tokenId, uint256 quantity, uint256 pricePerItem) returns (uint256)",
                  params: [
                    editionDropAddress,
                    BigInt(selectedTokenId),
                    BigInt(quantity),
                    toWei(price),
                  ],
                })
              }
              onTransactionConfirmed={(receipt) => {
                // Extract the listing ID from transaction logs/events
                // The createListing function returns the listing ID
                console.log("Transaction receipt:", receipt);
                // For now, we'll use a placeholder - the smart contract emits the listingId
                // You can parse it from the logs if needed
                handleCreateListing(BigInt(1)); // This will be incremented by the contract
              }}
              onError={(error) => {
                console.error("Listing error:", error);
                alert("❌ Failed to create listing: " + error.message);
                setIsSubmitting(false);
              }}
              disabled={isSubmitting || !canList || !price || parseFloat(price) <= 0}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
            >
              {!canList 
                ? "❌ Not Enough NFTs" 
                : isSubmitting 
                  ? "⏳ Creating..." 
                  : "📋 Create Listing"}
            </TransactionButton>
          </div>
        )}
      </div>
    </div>
  );
};

const MyListingCard: React.FC<{
  listing: MarketplaceListing;
  onCancelled: () => void;
}> = ({ listing, onCancelled }) => {
  // Check my NFT balance
  const { data: myBalance } = useReadContract(balanceOf, {
    contract: editionDropContract,
    owner: listing.seller,
    tokenId: BigInt(listing.tokenId),
  });

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden">
      <div className="p-4">
        <h3 className="text-sm font-bold text-white mb-1 truncate">{listing.collectionName}</h3>
        <p className="text-xs text-slate-400 mb-3">#{listing.tokenId}</p>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-xs text-slate-400">Price</span>
            <span className="text-lg font-bold text-cyan-300">{listing.price} ETH</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-slate-400">Your Balance</span>
            <span className="text-sm font-bold text-indigo-300">{myBalance?.toString() || "0"}</span>
          </div>
        </div>

        <div className="bg-green-500/10 border border-green-500/30 rounded p-3 mb-3">
          <p className="text-xs text-green-300 text-center">✅ Listed for sale</p>
          <p className="text-xs text-slate-400 text-center mt-1">Buyers can see your listing globally</p>
        </div>

        <button
          onClick={onCancelled}
          className="w-full mt-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 font-bold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
        >
          ❌ Cancel Listing
        </button>
      </div>
    </div>
  );
};

const MarketplaceListingCard: React.FC<{
  listing: MarketplaceListing;
  buyerAddress?: string;
  onPurchased: () => void;
}> = ({ listing, buyerAddress, onPurchased }) => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { data: nft } = useReadContract(getNFT, {
    contract: editionDropContract,
    tokenId: BigInt(listing.tokenId),
  });

  // Check seller's NFT balance to verify they still own the NFT
  const { data: sellerBalance } = useReadContract(balanceOf, {
    contract: editionDropContract,
    owner: listing.seller,
    tokenId: BigInt(listing.tokenId),
  });

  // Check blockchain listing status if blockchainListingId exists
  const { data: blockchainListing } = useReadContract({
    contract: marketplaceContract,
    method: "function getListing(uint256 listingId) view returns (address seller, address nftContract, uint256 tokenId, uint256 quantity, uint256 pricePerItem, bool active)",
    params: listing.blockchainListingId ? [BigInt(listing.blockchainListingId)] : undefined,
  });

  // Log listing data for debugging
  useEffect(() => {
    console.log("📋 Listing card loaded:", {
      firebaseId: listing.id,
      blockchainListingId: listing.blockchainListingId,
      collectionName: listing.collectionName,
      price: listing.price,
      seller: listing.seller,
      blockchainStatus: blockchainListing ? {
        active: blockchainListing[5],
        quantity: blockchainListing[3]?.toString(),
      } : "Loading...",
    });
  }, [listing, blockchainListing]);

  // Automatically update Firebase if blockchain listing is inactive
  useEffect(() => {
    if (blockchainListing && !blockchainListing[5] && listing.status === "active") {
      // blockchainListing[5] is the 'active' boolean
      console.log(`Listing ${listing.id} is inactive on blockchain, updating Firebase...`);
      updateListingStatus(listing.id, "sold");
      onPurchased();
    }
  }, [blockchainListing, listing.id, listing.status, onPurchased]);

  const handlePurchase = async () => {
    if (!buyerAddress) {
      alert("Please connect your wallet to purchase");
      return;
    }

    if (buyerAddress.toLowerCase() === listing.seller.toLowerCase()) {
      alert("You cannot buy your own listings");
      return;
    }

    // Check blockchain listing status first
    if (blockchainListing && !blockchainListing[5]) {
      alert("❌ Error: This listing is no longer active on the blockchain (already sold or cancelled)");
      updateListingStatus(listing.id, "sold");
      onPurchased();
      return;
    }

    // Check if seller still has the NFT
    if (!sellerBalance || sellerBalance < BigInt(listing.quantity)) {
      alert("❌ Error: Seller no longer owns this NFT");
      updateListingStatus(listing.id, "cancelled");
      onPurchased();
      return;
    }

    setIsPurchasing(true);
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-indigo-400/50 transition-all duration-300 group">
      {/* Image */}
      <div className="relative overflow-hidden bg-slate-900/50 h-40">
        {nft ? (
          <MediaRenderer
            client={client}
            src={nft.metadata.image}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            Loading...
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
          <span className="text-xs font-semibold text-cyan-300 bg-slate-900/80 px-2 py-1 rounded">
            View Details
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-bold text-white mb-1 truncate">{listing.collectionName}</h3>
        <p className="text-xs text-slate-400 mb-3">Seller: {listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}</p>

        {/* Show warning if blockchain listing is inactive */}
        {blockchainListing && !blockchainListing[5] && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 mb-3">
            <p className="text-xs text-red-300">⚠️ Sold/Inactive on blockchain</p>
          </div>
        )}

        <div className="mb-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Price</span>
            <span className="text-lg font-bold text-cyan-300">{listing.price} ETH</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Available</span>
            <span className="text-sm font-bold text-indigo-300">{listing.quantity}</span>
          </div>
        </div>

        {isPurchasing ? (
          <div className="space-y-3">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-xs">
              <p className="text-blue-300 font-semibold mb-2">💰 Purchase via Marketplace:</p>
              <ol className="text-blue-200/80 space-y-1 ml-4 list-decimal">
                <li>Pay {listing.price} ETH</li>
                <li>NFT transfers automatically from seller</li>
                <li>Seller receives payment instantly</li>
              </ol>
              <p className="text-green-300 mt-2">✅ Fully automated marketplace!</p>
            </div>
            
            {listing.blockchainListingId ? (
              <TransactionButton
                transaction={() => {
                  // Purchase through marketplace contract using blockchain listing ID
                  console.log("🛒 Attempting purchase:", {
                    listingId: listing.blockchainListingId,
                    quantity: 1,
                    price: listing.price,
                    seller: listing.seller,
                  });
                  return prepareContractCall({
                    contract: marketplaceContract,
                    method: "function purchase(uint256 listingId, uint256 quantity) payable",
                    params: [BigInt(listing.blockchainListingId!), BigInt(1)],
                    value: toWei(listing.price),
                  });
                }}
                onTransactionConfirmed={() => {
                  alert(`✅ Purchase successful! You received 1 ${listing.collectionName}`);
                  onPurchased();
                  setIsPurchasing(false);
                }}
                onError={(error) => {
                  console.error("❌ Purchase error details:", {
                    error: error.message,
                    listingId: listing.blockchainListingId,
                    blockchainStatus: blockchainListing,
                  });
                  alert(`❌ Purchase failed: ${error.message}`);
                  setIsPurchasing(false);
                }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
              >
                💳 Pay {listing.price} ETH & Buy Now
              </TransactionButton>
            ) : (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-xs text-red-300">
                ⚠️ This listing doesn&apos;t have a blockchain ID. It may be an old listing created before the marketplace contract was deployed.
              </div>
            )}

            <button
              onClick={() => setIsPurchasing(false)}
              className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 font-bold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={handlePurchase}
            disabled={!sellerBalance || sellerBalance < BigInt(listing.quantity)}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
          >
            {!sellerBalance || sellerBalance < BigInt(listing.quantity) ? "❌ Unavailable" : "🛒 Buy Now"}
          </button>
        )}
      </div>
    </div>
  );
};

export default MarketplacePage;
