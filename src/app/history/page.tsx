"use client";
import React, { useState, useEffect } from "react";
import {
  ConnectButton,
  useActiveAccount,
} from "thirdweb/react";
import {
  accountAbstraction,
  client,
  NFT_COLLECTION_NAMES,
} from "../constants";
import Link from "next/link";
import { lightTheme } from "thirdweb/react";

interface Transaction {
  id: string;
  type: "mint" | "claim" | "transfer" | "batch" | "unknown";
  tokenIds: string[];
  collectionNames: string[];
  timestamp: string;
  status: "pending" | "confirmed" | "failed";
  hash: string;
  quantity: number;
  from?: string;
  to?: string;
  value?: string;
}

const HistoryPage: React.FC = () => {
  const smartAccount = useActiveAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<"all" | "mint" | "claim" | "transfer" | "batch" | "unknown">("all");
  const [loading, setLoading] = useState(false);
  const [localTransactions, setLocalTransactions] = useState<Transaction[]>([]);

  // Load transactions from localStorage
  useEffect(() => {
    loadLocalTransactions();
    const interval = setInterval(loadLocalTransactions, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadLocalTransactions = () => {
    const savedTransactions = localStorage.getItem("transactionHistory");
    if (savedTransactions) {
      try {
        const parsed = JSON.parse(savedTransactions);
        setLocalTransactions(parsed);
      } catch (e) {
        console.error("Failed to load transaction history:", e);
      }
    }
  };

  // Update transactions when local transactions change
  useEffect(() => {
    const sorted = [...localTransactions].sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return timeB - timeA; // Sort by newest first
    });
    setTransactions(sorted);
  }, [localTransactions]);

  const filteredTransactions = filter === "all" 
    ? transactions 
    : transactions.filter(tx => tx.type === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 border-green-500/50 text-green-300";
      case "pending":
        return "bg-yellow-500/20 border-yellow-500/50 text-yellow-300";
      case "failed":
        return "bg-red-500/20 border-red-500/50 text-red-300";
      default:
        return "bg-slate-500/20 border-slate-500/50 text-slate-300";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "mint":
        return "🎨";
      case "claim":
        return "⚡";
      case "transfer":
        return "🔄";
      case "batch":
        return "📦";
      default:
        return "✨";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-md border-b border-slate-700/50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
            Transaction History
          </h1>
          <p className="text-slate-300 text-lg">
            Track all your NFT transactions and activities
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

        {/* Filter Buttons */}
        {transactions.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-3 justify-between items-center">
            <div className="flex flex-wrap gap-3">
              {(["all", "mint", "claim", "transfer", "batch", "unknown"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    filter === f
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/50"
                      : "bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-slate-600/50"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Transactions List */}
        {filteredTransactions.length > 0 ? (
          <div className="space-y-4">
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left Side - Type Icon and Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-4xl">{getTypeIcon(tx.type)}</span>
                      <div>
                        <h3 className="text-lg font-bold text-white capitalize">
                          {tx.type} Transaction
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">{tx.timestamp}</p>
                      </div>
                    </div>

                    {/* Collections */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tx.collectionNames.map((name, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/50 rounded-full text-indigo-300 text-xs font-semibold"
                        >
                          {name}
                        </span>
                      ))}
                    </div>

                    {/* Transaction Details */}
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-900/50 rounded-lg p-3">
                        <p className="text-xs text-slate-400 mb-1">Quantity</p>
                        <p className="text-lg font-bold text-white">{tx.quantity}</p>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3">
                        <p className="text-xs text-slate-400 mb-1">Items</p>
                        <p className="text-lg font-bold text-white">{tx.tokenIds.length}</p>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3">
                        <p className="text-xs text-slate-400 mb-1">Type</p>
                        <p className="text-lg font-bold text-white capitalize">{tx.type}</p>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3">
                        <p className="text-xs text-slate-400 mb-1">Hash</p>
                        <p className="text-xs font-mono text-cyan-300 truncate">{tx.hash.slice(0, 10)}...</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Status */}
                  <div className="flex-shrink-0">
                    <span className={`px-4 py-2 border rounded-full text-sm font-bold inline-flex items-center gap-2 ${getStatusColor(tx.status)}`}>
                      <span className={`w-2 h-2 rounded-full ${tx.status === 'confirmed' ? 'bg-green-400' : tx.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'}`}></span>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">📜</div>
            <p className="text-slate-300 text-lg mb-6">
              {smartAccount ? "No transactions found" : "Connect your wallet to view your transaction history"}
            </p>
            {smartAccount && (
              <p className="text-slate-400 text-sm">
                Showing transactions for:
                <br />
                <span className="font-mono text-cyan-300 text-xs">{smartAccount.address}</span>
              </p>
            )}
          </div>
        )}

        {/* Info Box */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-6 mt-12">
          <p className="text-slate-300 text-sm flex items-start gap-3">
            <span className="text-blue-400 mt-0.5">ℹ️</span>
            <span>
              <strong>Transaction History:</strong> View and track all your NFT transactions from this app.
              <br className="mt-2 block" />
              Transactions are automatically saved when you:
              <br />
              • Claim NFTs on the Sponsored page
              <br />
              • Mint NFTs on the Gallery page
              <br />
              • Batch mint multiple NFTs
              <br className="mt-2 block" />
              Auto-refreshes every 2 seconds to show your latest activities.
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

export default HistoryPage;
