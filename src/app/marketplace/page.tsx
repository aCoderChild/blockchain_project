"use client";
import React, { useState, useEffect } from "react";
import {
  ConnectButton,
  MediaRenderer,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { getNFT } from "thirdweb/extensions/erc1155";
import {
  accountAbstraction,
  client,
  editionDropContract,
  NFT_TOKEN_IDS,
  NFT_COLLECTION_NAMES,
} from "../constants";
import Link from "next/link";
import { lightTheme } from "thirdweb/react";
import {
  getActiveListings,
  saveMarketplaceListing,
  updateListingStatus,
  getSellerListings,
  MarketplaceListing,
} from "../utils/marketplaceStorage";

const MarketplacePage: React.FC = () => {
  const smartAccount = useActiveAccount();
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [showListForm, setShowListForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"price-low" | "price-high" | "newest">("newest");
  const [myListings, setMyListings] = useState<MarketplaceListing[]>([]);

  // Load listings
  useEffect(() => {
    loadListings();
    const interval = setInterval(loadListings, 2000);
    return () => clearInterval(interval);
  }, []);

  // Load user's listings
  useEffect(() => {
    if (smartAccount?.address) {
      const userListings = getSellerListings(smartAccount.address);
      setMyListings(userListings);
    }
  }, [smartAccount?.address]);

  const loadListings = () => {
    const active = getActiveListings();
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
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Reload with new search
    setTimeout(loadListings, 100);
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
            {showListForm && <ListForm smartAccount={smartAccount} onSuccess={() => {
              setShowListForm(false);
              loadListings();
            }} />}

            {/* My Active Listings */}
            {myListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {myListings.map(listing => (
                  <MyListingCard
                    key={listing.id}
                    listing={listing}
                    onCancelled={() => {
                      updateListingStatus(listing.id, "cancelled");
                      loadListings();
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
                onChange={(e) => handleSearch(e.target.value)}
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
                  onPurchased={() => {
                    updateListingStatus(listing.id, "sold");
                    loadListings();
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
          <p className="text-slate-300 text-sm flex items-start gap-3">
            <span className="text-blue-400 mt-0.5">ℹ️</span>
            <span>
              <strong>P2P Marketplace:</strong> List your NFTs for sale and browse listings from other users. Set your price and connect with buyers. All transactions are secured with account abstraction and sponsored gas fees!
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

const ListForm: React.FC<{
  smartAccount: any;
  onSuccess: () => void;
}> = ({ smartAccount, onSuccess }) => {
  const [selectedTokenId, setSelectedTokenId] = useState<string>("3");
  const [price, setPrice] = useState<string>("0.1");
  const [quantity, setQuantity] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const collectionName = NFT_COLLECTION_NAMES[selectedTokenId] || `NFT #${selectedTokenId}`;

    saveMarketplaceListing({
      seller: smartAccount.address,
      tokenId: selectedTokenId,
      collectionName,
      price,
      quantity,
      timestamp: new Date().toLocaleString(),
      status: "active",
    });

    alert("✅ Listing created successfully!");
    onSuccess();
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-8 mb-12">
      <h3 className="text-xl font-bold text-white mb-6">Create New Listing</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
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
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:border-indigo-400/50 focus:outline-none"
              placeholder="0.1"
            />
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="text-slate-300 font-semibold text-sm mb-3 block">Quantity</label>
          <input
            type="number"
            min="1"
            max="10"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:border-indigo-400/50 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
        >
          📋 Create Listing
        </button>
      </form>
    </div>
  );
};

const MyListingCard: React.FC<{
  listing: MarketplaceListing;
  onCancelled: () => void;
}> = ({ listing, onCancelled }) => {
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
            <span className="text-xs text-slate-400">Available</span>
            <span className="text-sm font-bold text-indigo-300">{listing.quantity}</span>
          </div>
        </div>

        <button
          onClick={onCancelled}
          className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 font-bold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
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
  const { data: nft } = useReadContract(getNFT, {
    contract: editionDropContract,
    tokenId: BigInt(listing.tokenId),
  });

  const handlePurchase = () => {
    if (!buyerAddress) {
      alert("Please connect your wallet to purchase");
      return;
    }

    if (buyerAddress.toLowerCase() === listing.seller.toLowerCase()) {
      alert("You cannot buy your own listings");
      return;
    }

    // In a real app, this would execute a purchase transaction
    alert(`✅ Purchase successful! You bought 1 ${listing.collectionName} for ${listing.price} ETH`);
    onPurchased();
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

        <button
          onClick={handlePurchase}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
        >
          🛒 Buy Now
        </button>
      </div>
    </div>
  );
};

export default MarketplacePage;
