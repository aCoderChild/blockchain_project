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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900/90 to-cyan-900/40 backdrop-blur-xl border-b-2 border-cyan-500/30 p-8 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent mb-3">
            Activity Timeline
          </h1>
          <p className="text-slate-300 text-xl">
            Real-time tracking of all your blockchain transactions
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
          <div className="mb-10 flex flex-wrap gap-4 justify-between items-center">
            <div className="flex flex-wrap gap-3">
              {(["all", "mint", "claim", "transfer", "batch", "unknown"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-7 py-3 rounded-xl font-bold transition-all duration-300 border-2 ${
                    filter === f
                      ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-xl shadow-teal-500/50 border-teal-400"
                      : "bg-slate-800/50 border-slate-700/60 text-slate-300 hover:border-teal-500/50 hover:text-teal-200"
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
          <div className="space-y-5">
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="group bg-gradient-to-br from-slate-900/60 to-teal-900/20 border-2 border-teal-500/30 rounded-2xl p-8 hover:border-teal-400/70 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/20 hover:-translate-y-2"
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
                          className="px-4 py-2 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border-2 border-teal-400/50 rounded-full text-teal-200 text-xs font-bold shadow-lg"
                        >
                          {name}
                        </span>
                      ))}
                    </div>

                    {/* Transaction Details */}
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-br from-teal-500/10 to-teal-600/5 rounded-xl p-4 border-2 border-teal-500/30 group-hover:border-teal-400/60 transition-colors">
                        <p className="text-xs text-slate-400 mb-2 font-bold">Quantity</p>
                        <p className="text-2xl font-black text-teal-300">{tx.quantity}</p>
                      </div>
                      <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-xl p-4 border-2 border-emerald-500/30 group-hover:border-emerald-400/60 transition-colors">
                        <p className="text-xs text-slate-400 mb-2 font-bold">Items</p>
                        <p className="text-2xl font-black text-emerald-300">{tx.tokenIds.length}</p>
                      </div>
                      <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 rounded-xl p-4 border-2 border-cyan-500/30 group-hover:border-cyan-400/60 transition-colors">
                        <p className="text-xs text-slate-400 mb-2 font-bold">Type</p>
                        <p className="text-lg font-black text-cyan-300 capitalize">{tx.type}</p>
                      </div>
                      <div className="bg-gradient-to-br from-teal-500/10 to-emerald-600/5 rounded-xl p-4 border-2 border-teal-500/30 group-hover:border-teal-400/60 transition-colors">
                        <p className="text-xs text-slate-400 mb-2 font-bold">Hash</p>
                        <p className="text-xs font-mono text-emerald-300 truncate font-bold">{tx.hash.slice(0, 10)}...</p>
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
