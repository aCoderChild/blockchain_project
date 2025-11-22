"use client";
import { useState, useCallback } from "react";
import {
  ConnectButton,
  lightTheme,
  useActiveAccount,
  useReadContract,
  useSendTransaction,
} from "thirdweb/react";
import {
  addSessionKey,
  getAllActiveSigners,
  removeSessionKey,
} from "thirdweb/extensions/erc4337";
import { getContract } from "thirdweb";
import { Secp256k1 } from "ox";
import { privateKeyToAccount } from "thirdweb/wallets";
import { claimTo } from "thirdweb/extensions/erc1155";
import Link from "next/link";

import {
  client,
  accountAbstraction,
  chain,
  editionDropAddress,
} from "../constants";

const AddSigner = () => {
  const smartAccount = useActiveAccount();
  const [generating, setGenerating] = useState(false);
  const [exportedSession, setExportedSession] = useState<{
    privateKey: string;
    address: string;
  } | null>(null);
  const { data: activeSigners, refetch } = useReadContract(
    getAllActiveSigners,
    {
      contract: getContract({
        address: smartAccount?.address!,
        chain,
        client,
      }),
      queryOptions: { enabled: !!smartAccount?.address },
    },
  );
  const { mutateAsync: sendTx } = useSendTransaction();

  const handleGenerateSessionKey = useCallback(async () => {
    try {
      setGenerating(true);
      const privateKey = Secp256k1.randomPrivateKey();
      const subAccount = privateKeyToAccount({
        client,
        privateKey,
      });
      setExportedSession({
        privateKey,
        address: subAccount.address,
      });

      if (!smartAccount) throw new Error("No smart account");
      const contract = getContract({
        address: smartAccount.address,
        chain,
        client,
      });

      const transaction = addSessionKey({
        contract,
        account: smartAccount,
        sessionKeyAddress: subAccount.address,
        permissions: {
          approvedTargets: [editionDropAddress],
        },
      });
      await sendTx(transaction);
      await refetch();
      alert("Session key created successfully: " + subAccount.address);
    } finally {
      setGenerating(false);
    }
  }, [client, smartAccount, chain, editionDropAddress, sendTx, refetch]);

  const mintNFT = useCallback(
    async (targetAddress: string) => {
      const contract = getContract({
        address: editionDropAddress,
        chain,
        client,
      });
      const transaction = claimTo({
        contract,
        to: targetAddress,
        tokenId: 5n,
        quantity: 1n,
      });
      await sendTx(transaction);
      alert("NFT minted successfully for: " + targetAddress);
    },
    [editionDropAddress, chain, client, sendTx],
  );

  const revokeSessionKey = useCallback(
    async (address: string) => {
      if (!smartAccount) throw new Error("No smart account");
      const contract = getContract({
        address: smartAccount.address,
        chain,
        client,
      });
      const transaction = removeSessionKey({
        contract,
        account: smartAccount,
        sessionKeyAddress: address,
      });
      await sendTx(transaction);
      alert("Session key revoked: " + address);
      await refetch();
    },
    [smartAccount, chain, client, sendTx, refetch],
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-md border-b border-slate-700/50 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
            Session Keys
          </h1>
          <p className="text-slate-300 text-lg">
            Create restricted keys with specific permissions for seamless transactions
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
            chain={chain}
            theme={lightTheme()}
            connectModal={{ size: "compact" }}
          />
        </div>

        {/* Create Session Key Card */}
        <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-500/30 rounded-2xl p-8 mb-12">
          <div className="flex items-start gap-4 mb-6">
            <span className="text-5xl">🔑</span>
            <div>
              <h2 className="text-2xl font-bold text-white">Create Session Key</h2>
              <p className="text-slate-300 mt-1">Generate a new restricted session key</p>
            </div>
          </div>

          <button
            className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/50"
            disabled={generating}
            onClick={handleGenerateSessionKey}
          >
            {generating ? "⏳ Generating..." : "✨ Create Session Key"}
          </button>

          {/* Exported Session */}
          {exportedSession && (
            <div className="mt-6 bg-slate-900/50 border border-green-500/30 rounded-lg p-4">
              <h3 className="text-lg font-bold text-green-300 mb-4">Session Key Generated</h3>
              <div className="space-y-4 text-sm font-mono">
                <div>
                  <p className="text-slate-400 text-xs mb-1">Address:</p>
                  <p className="text-slate-200 break-all bg-slate-800/50 p-2 rounded">
                    {exportedSession.address}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Private Key:</p>
                  <p className="text-slate-200 break-all bg-slate-800/50 p-2 rounded">
                    {exportedSession.privateKey}
                  </p>
                </div>
              </div>
              <button
                className="mt-4 w-full px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-300 rounded font-semibold transition-colors"
                onClick={() => {
                  navigator.clipboard.writeText(exportedSession.privateKey);
                  alert("Private key copied to clipboard!");
                  setExportedSession(null);
                }}
              >
                📋 Copy & Close
              </button>
            </div>
          )}
        </div>

        {/* Active Session Keys */}
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🔓</span> Active Session Keys
          </h2>

          {activeSigners && activeSigners.length > 0 ? (
            <div className="space-y-3">
              {activeSigners.map((signer) => (
                <div
                  key={signer.signer}
                  className="bg-slate-900/50 border border-purple-500/30 rounded-lg p-4 flex items-center justify-between hover:border-purple-400/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-300 text-sm font-mono break-all">
                      {signer.signer}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <button
                      className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-300 text-sm rounded font-semibold transition-colors"
                      onClick={() => mintNFT(signer.signer)}
                    >
                      Mint NFT
                    </button>
                    <button
                      className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 text-sm rounded font-semibold transition-colors"
                      onClick={() => revokeSessionKey(signer.signer)}
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-400">No active session keys yet</p>
              <p className="text-slate-500 text-sm mt-2">Create one to get started</p>
            </div>
          )}
        </div>
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

export default AddSigner;
