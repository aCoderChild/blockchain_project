"use client";
import { balanceOf, claimTo as claimNFT } from "thirdweb/extensions/erc1155";
import {
  ConnectButton,
  MediaRenderer,
  TransactionButton,
  useActiveAccount,
  useReadContract,
  useSendBatchTransaction,
} from "thirdweb/react";
import {
  accountAbstraction,
  client,
  editionDropContract,
  editionDropTokenId,
  tokenDropContract,
} from "../constants";
import Link from "next/link";
import { getBalance, claimTo as claimToken } from "thirdweb/extensions/erc20";
import { lightTheme } from "thirdweb/react";

const BatchingHome = () => {
  const smartAccount = useActiveAccount();
  const { data: tokenBalance, refetch: refetchTokens } = useReadContract(
    getBalance,
    {
      contract: tokenDropContract,
      address: smartAccount?.address!,
      queryOptions: { enabled: !!smartAccount },
    }
  );
  const { data: nftBalance, refetch: refetchNFTs } = useReadContract(balanceOf, {
    contract: editionDropContract,
    owner: smartAccount?.address!,
    tokenId: editionDropTokenId,
    queryOptions: { enabled: !!smartAccount },
  });
  const { mutate: sendBatch, isPending } = useSendBatchTransaction();

  const handleClick = async () => {
    if (!smartAccount) return;
    const transactions = [
      claimNFT({
        contract: editionDropContract,
        tokenId: editionDropTokenId,
        to: smartAccount.address,
        quantity: 1n,
      }),
      claimToken({
        contract: tokenDropContract,
        quantity: "0.1",
        to: smartAccount.address,
      }),
    ];
    sendBatch(transactions, {
      onError: (error) => {
        alert(`Error: ${error.message}`);
      },
      onSuccess: (result) => {
        refetchNFTs();
        refetchTokens();
        alert("Success! Tx hash: " + result.transactionHash);
      },
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-md border-b border-slate-700/50 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
            Batch Transactions
          </h1>
          <p className="text-slate-300 text-lg">
            Claim multiple assets in a single transaction to save gas
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow max-w-4xl mx-auto w-full px-4 py-12">
        {/* Connect Button */}
        <div className="flex justify-center mb-12">
          <ConnectButton
            client={client}
            accountAbstraction={accountAbstraction}
            theme={lightTheme()}
            connectModal={{ size: "compact" }}
          />
        </div>

        {/* Balance Card */}
        {smartAccount && (nftBalance || tokenBalance) && (
          <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-500/30 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Your Balance</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-900/50 border border-indigo-500/50 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">NFTs Owned</p>
                <p className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {nftBalance?.toString() || "0"}
                </p>
              </div>
              <div className="bg-slate-900/50 border border-purple-500/50 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">Tokens Owned</p>
                <p className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {tokenBalance?.displayValue || "0"}
                </p>
                <p className="text-slate-400 text-xs mt-1">{tokenBalance?.symbol || ""}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Card */}
        {smartAccount ? (
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/10 border border-purple-500/30 rounded-2xl p-8">
            <div className="flex items-start gap-4 mb-8">
              <span className="text-5xl">📦</span>
              <div>
                <h2 className="text-2xl font-bold text-white">Batch Claim</h2>
                <p className="text-slate-300 mt-1">Claim 1 NFT + 0.1 Tokens in one transaction</p>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-slate-300 mb-4">Transaction Details</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span>
                  Multiple transactions bundled into one
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span>
                  Sponsored gas - you pay nothing
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span>
                  Atomic execution - all or nothing
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span>
                  Save time and money
                </li>
              </ul>
            </div>

            <button
              onClick={handleClick}
              disabled={isPending}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50"
            >
              {isPending ? "⏳ Processing..." : "🚀 Claim NFTs & Tokens at Once"}
            </button>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-12 text-center">
            <p className="text-slate-300 text-lg">Connect your wallet to get started</p>
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

export default BatchingHome;
