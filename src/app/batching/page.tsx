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
  BATCH_NFT_QUANTITY,
  BATCH_TOKEN_AMOUNT,
  NFT_TOKEN_IDS,
} from "../constants";
import Link from "next/link";
import { getBalance, claimTo as claimToken } from "thirdweb/extensions/erc20";
import { lightTheme } from "thirdweb/react";
import { useState, useEffect } from "react";
import { saveTransaction, createTransactionRecord } from "../utils/transactionHistory";

const BatchMintingHome = () => {
  const [settings, setSettings] = useState({
    nftSelections: {
      "4": "1",
      "9": "3",
    },
    fixedTokenAmount: "0.1",
    nftTokenAmounts: {
      "3": "0.1",
      "4": "0.2",
      "5": "0.15",
      "6": "0.25",
      "7": "0.3",
      "8": "0.35",
      "9": "0.4",
    },
    nftNames: {
      "3": "🎨 Pixel Dreamers",
      "4": "🌟 Cosmic Legends",
      "5": "⚡ Thunder Collective",
      "6": "🎭 Mystic Souls",
      "7": "🌸 Digital Garden",
      "8": "🚀 Future Riders",
      "9": "💎 Crystal Essence",
    },
    nftDescriptions: {
      "3": "Experience the magic of pixel art with unique digital creatures",
      "4": "Join an interstellar journey with cosmic-inspired artwork",
      "5": "Powered by electric energy and dynamic visuals",
      "6": "Mysterious and theatrical digital performances",
      "7": "Nature meets technology in this harmonious collection",
      "8": "Speed and innovation at its finest",
      "9": "Premium collection with crystalline aesthetics",
    },
  });
  const [showSettings, setShowSettings] = useState(false);
  const [nftBalances, setNftBalances] = useState<{ [key: string]: bigint }>({});

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("appSettings");
    if (saved) {
      const loadedSettings = JSON.parse(saved);
      // Ensure required fields exist with default values
      if (!loadedSettings.nftSelections) {
        loadedSettings.nftSelections = { "4": "1", "9": "3" };
      }
      if (!loadedSettings.fixedTokenAmount) {
        loadedSettings.fixedTokenAmount = "0.1";
      }
      if (!loadedSettings.nftTokenAmounts) {
        loadedSettings.nftTokenAmounts = {
          "3": "0.1",
          "4": "0.2",
          "5": "0.15",
          "6": "0.25",
          "7": "0.3",
          "8": "0.35",
          "9": "0.4",
        };
      }
      setSettings(loadedSettings);
    }
  }, []);

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

  // Fetch balances for each NFT type individually
  const nft3Balance = useReadContract(balanceOf, {
    contract: editionDropContract,
    owner: smartAccount?.address!,
    tokenId: 3n,
    queryOptions: { enabled: !!smartAccount },
  });
  const nft4Balance = useReadContract(balanceOf, {
    contract: editionDropContract,
    owner: smartAccount?.address!,
    tokenId: 4n,
    queryOptions: { enabled: !!smartAccount },
  });
  const nft5Balance = useReadContract(balanceOf, {
    contract: editionDropContract,
    owner: smartAccount?.address!,
    tokenId: 5n,
    queryOptions: { enabled: !!smartAccount },
  });
  const nft6Balance = useReadContract(balanceOf, {
    contract: editionDropContract,
    owner: smartAccount?.address!,
    tokenId: 6n,
    queryOptions: { enabled: !!smartAccount },
  });
  const nft7Balance = useReadContract(balanceOf, {
    contract: editionDropContract,
    owner: smartAccount?.address!,
    tokenId: 7n,
    queryOptions: { enabled: !!smartAccount },
  });
  const nft8Balance = useReadContract(balanceOf, {
    contract: editionDropContract,
    owner: smartAccount?.address!,
    tokenId: 8n,
    queryOptions: { enabled: !!smartAccount },
  });
  const nft9Balance = useReadContract(balanceOf, {
    contract: editionDropContract,
    owner: smartAccount?.address!,
    tokenId: 9n,
    queryOptions: { enabled: !!smartAccount },
  });

  // Update nftBalances whenever individual balances change
  useEffect(() => {
    const newBalances: { [key: string]: bigint } = {
      "3": nft3Balance.data || 0n,
      "4": nft4Balance.data || 0n,
      "5": nft5Balance.data || 0n,
      "6": nft6Balance.data || 0n,
      "7": nft7Balance.data || 0n,
      "8": nft8Balance.data || 0n,
      "9": nft9Balance.data || 0n,
    };
    setNftBalances(newBalances);
  }, [
    nft3Balance.data,
    nft4Balance.data,
    nft5Balance.data,
    nft6Balance.data,
    nft7Balance.data,
    nft8Balance.data,
    nft9Balance.data,
  ]);
  const { mutate: sendBatch, isPending } = useSendBatchTransaction();

  const handleClick = async () => {
    if (!smartAccount) return;
    
    // Build transactions for each selected NFT type with fixed token amount
    const nftTransactions = Object.entries(settings.nftSelections)
      .filter(([_, qty]) => parseInt(qty) > 0)
      .map(([tokenId, qty]) => {
        return claimToken({
          contract: tokenDropContract,
          quantity: settings.fixedTokenAmount,
          to: smartAccount.address,
        });
      });

    // Add NFT claims
    const nftClaims = Object.entries(settings.nftSelections)
      .filter(([_, qty]) => parseInt(qty) > 0)
      .map(([tokenId, qty]) =>
        claimNFT({
          contract: editionDropContract,
          tokenId: BigInt(tokenId),
          to: smartAccount.address,
          quantity: BigInt(parseInt(qty)),
        })
      );

    const transactions = [...nftTransactions, ...nftClaims];

    sendBatch(transactions, {
      onError: (error) => {
        alert(`Error: ${error.message}`);
      },
      onSuccess: (result) => {
        refetchNFTs();
        refetchTokens();
        
        // Save batch transaction to history
        const selectedTokenIds = Object.entries(settings.nftSelections)
          .filter(([_, qty]) => parseInt(qty) > 0)
          .map(([tokenId]) => BigInt(tokenId));
        
        const totalQuantity = Object.entries(settings.nftSelections)
          .filter(([_, qty]) => parseInt(qty) > 0)
          .reduce((sum, [_, qty]) => sum + parseInt(qty), 0);
        
        const transactionRecord = createTransactionRecord(
          "batch",
          selectedTokenIds,
          result.transactionHash,
          totalQuantity
        );
        saveTransaction(transactionRecord);
        
        alert("Success! Tx hash: " + result.transactionHash);
      },
    });
  };

  // Calculate total quantity
  const totalBatchQuantity = Object.entries(settings.nftSelections)
    .filter(([_, qty]) => parseInt(qty) > 0)
    .reduce((sum, [_, qty]) => sum + parseInt(qty), 0);

  // Calculate total token amount (fixed amount per NFT type selected)
  const totalTokenAmount = Object.entries(settings.nftSelections)
    .filter(([_, qty]) => parseInt(qty) > 0)
    .length * parseFloat(settings.fixedTokenAmount);

  const saveSettings = () => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
    alert("✅ Settings saved successfully!");
  };

  const resetDefaults = () => {
    setSettings({
      nftSelections: {
        "4": "1",
        "9": "3",
      },
      fixedTokenAmount: "0.1",
      nftTokenAmounts: {
        "3": "0.1",
        "4": "0.2",
        "5": "0.15",
        "6": "0.25",
        "7": "0.3",
        "8": "0.35",
        "9": "0.4",
      },
      nftNames: {
        "3": "🎨 Pixel Dreamers",
        "4": "🌟 Cosmic Legends",
        "5": "⚡ Thunder Collective",
        "6": "🎭 Mystic Souls",
        "7": "🌸 Digital Garden",
        "8": "🚀 Future Riders",
        "9": "💎 Crystal Essence",
      },
      nftDescriptions: {
        "3": "Experience the magic of pixel art with unique digital creatures",
        "4": "Join an interstellar journey with cosmic-inspired artwork",
        "5": "Powered by electric energy and dynamic visuals",
        "6": "Mysterious and theatrical digital performances",
        "7": "Nature meets technology in this harmonious collection",
        "8": "Speed and innovation at its finest",
        "9": "Premium collection with crystalline aesthetics",
      },
    });
    alert("🔄 Reset to defaults!");
  };

  const handleNameChange = (id: string, value: string) => {
    setSettings({
      ...settings,
      nftNames: { ...settings.nftNames, [id]: value },
    });
  };

  const handleDescriptionChange = (id: string, value: string) => {
    setSettings({
      ...settings,
      nftDescriptions: { ...settings.nftDescriptions, [id]: value },
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-md border-b border-slate-700/50 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
            Batch Minting
          </h1>
          <p className="text-slate-300 text-lg">
            Mint multiple NFTs in a single batch transaction with custom quantities
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

        {/* Settings Toggle Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-lg transition-all duration-300 inline-flex items-center gap-2"
          >
            <span>⚙️</span>
            {showSettings ? "Hide Settings" : "Show Settings"}
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/10 border border-pink-500/30 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Customize Batch Settings</h2>

            {/* Quick Settings - Auto Calculation Display */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Total NFT Quantity */}
              <div className="bg-slate-900/50 border border-indigo-500/30 rounded-lg p-6">
                <label className="text-white font-bold text-lg mb-3 block">
                  📦 Batch NFT Quantity
                </label>
                <div className="text-5xl font-bold text-indigo-300 mb-2">
                  {totalBatchQuantity}
                </div>
                <p className="text-slate-400 text-sm">
                  Total NFTs in this batch (automatically calculated)
                </p>
              </div>

              {/* Fixed Token Amount per NFT Type */}
              <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg p-6">
                <label className="text-white font-bold text-lg mb-3 block">
                  💰 Token per NFT Type
                </label>
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    value={settings.fixedTokenAmount}
                    onChange={(e) =>
                      setSettings({ ...settings, fixedTokenAmount: e.target.value })
                    }
                    className="text-3xl font-bold text-purple-300 bg-slate-800/50 border border-purple-500/50 rounded px-4 py-2 focus:border-purple-400 focus:outline-none w-full"
                  />
                  <span className="text-slate-400 text-lg whitespace-nowrap">TOK</span>
                </div>
                <p className="text-slate-400 text-sm">
                  Total tokens: {totalTokenAmount.toFixed(2)} TOK ({Object.entries(settings.nftSelections).filter(([_, qty]) => parseInt(qty) > 0).length} types × {settings.fixedTokenAmount})
                </p>
              </div>
            </div>

            {/* NFT Type Selection with Quantities */}
            <div className="bg-slate-900/50 border border-cyan-500/30 rounded-lg p-6 mb-8">
              <label className="text-white font-bold text-lg mb-4 block">
                🎯 Select NFTs to Claim (with Quantities)
              </label>
              <p className="text-slate-400 text-sm mb-4">
                Customize the NFT types and quantities below. The batch will automatically calculate the total NFTs.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {Object.entries(settings.nftNames).map(([id, name]) => {
                  const isSelected = settings.nftSelections.hasOwnProperty(id);
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        const newSelections = { ...settings.nftSelections } as Record<string, string>;
                        if (isSelected) {
                          delete newSelections[id];
                        } else {
                          newSelections[id] = "1";
                        }
                        setSettings({ ...settings, nftSelections: newSelections });
                      }}
                      className={`p-3 rounded-lg border-2 transition-all text-sm font-semibold text-center cursor-pointer ${
                        isSelected
                          ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                          : "border-slate-600/50 bg-slate-800/50 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <div className="text-xs text-slate-400">Token #{id}</div>
                      <div className="text-xs mt-1">{name.split(" ")[0]}</div>
                    </button>
                  );
                })}
              </div>

              {/* Quantity Inputs for Selected NFTs */}
              {settings.nftSelections && Object.keys(settings.nftSelections).length > 0 && (
                <div className="bg-slate-800/50 border border-slate-600/50 rounded p-6">
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <span>📝</span> NFT Quantities
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(settings.nftSelections).map(([id, qty]) => (
                      <div key={id} className="flex items-center gap-4">
                        <div className="flex-1">
                          <p className="text-slate-300 font-semibold text-sm">
                            {settings.nftNames[id as keyof typeof settings.nftNames]}
                          </p>
                          <p className="text-slate-500 text-xs">Token #{id}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={qty}
                            onChange={(e) => {
                              const newSelections = { ...settings.nftSelections };
                              newSelections[id] = e.target.value;
                              setSettings({ ...settings, nftSelections: newSelections });
                            }}
                            className="w-16 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded text-slate-100 text-sm focus:border-cyan-400 focus:outline-none text-center"
                          />
                          <span className="text-slate-400 text-sm">NFTs</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* NFT Collection Names & Descriptions */}
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🎨</span> NFT Collections
              </h3>

              <div className="space-y-4 max-h-60 overflow-y-auto">
                {Object.entries(settings.nftNames).map(([id, name]) => (
                  <div
                    key={id}
                    className="bg-slate-800/50 border border-slate-600/50 rounded p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-pink-300 font-semibold">Token ID: {id}</h4>
                      <span className="text-xs px-2 py-1 bg-pink-500/20 border border-pink-500/50 rounded text-pink-300">
                        #{id}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                          handleNameChange(id, e.target.value)
                        }
                        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded text-slate-100 text-sm focus:border-pink-400 focus:outline-none"
                        placeholder="Collection name"
                      />
                      <textarea
                        value={
                          settings.nftDescriptions[id as keyof typeof settings.nftDescriptions] ||
                          ""
                        }
                        onChange={(e) =>
                          handleDescriptionChange(id, e.target.value)
                        }
                        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded text-slate-100 text-sm focus:border-pink-400 focus:outline-none resize-none"
                        rows={1}
                        placeholder="Description"
                      />
                      <div className="bg-slate-900/50 border border-purple-500/30 rounded p-3 mt-2">
                        <p className="text-slate-400 text-xs font-semibold mb-1">💰 Token Amount per NFT</p>
                        <p className="text-purple-300 font-bold text-lg">
                          {settings.nftTokenAmounts[id as keyof typeof settings.nftTokenAmounts] || "0.1"} TOK
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={saveSettings}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50"
              >
                💾 Save Settings
              </button>
              <button
                onClick={resetDefaults}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-bold rounded-lg transition-all duration-300"
              >
                🔄 Reset to Defaults
              </button>
            </div>
          </div>
        )}

        {/* Balance Card */}
        {smartAccount && (nftBalance || tokenBalance) && (
          <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-500/30 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Your Balance</h2>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-slate-900/50 border border-indigo-500/50 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">Total NFTs Owned</p>
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

            {/* NFT Types Breakdown */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>📊</span> NFT Types Owned
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(settings.nftNames).map(([id, name]) => {
                  const balance = nftBalances[id] ? nftBalances[id].toString() : "0";
                  const hasNFT = balance !== "0";
                  return (
                    <div
                      key={id}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        hasNFT
                          ? "border-cyan-400/50 bg-cyan-500/10"
                          : "border-slate-600/50 bg-slate-700/50"
                      }`}
                    >
                      <div className="text-xs text-slate-400 mb-1">Token #{id}</div>
                      <div className={`text-2xl font-bold mb-1 ${
                        hasNFT ? "text-cyan-300" : "text-slate-400"
                      }`}>
                        {balance}
                      </div>
                      <div className="text-xs text-slate-300 truncate">
                        {name.split(" ").slice(0, 2).join(" ")}
                      </div>
                    </div>
                  );
                })}
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
                <div className="text-slate-300 mt-2 text-sm">
                  {settings.nftSelections && Object.keys(settings.nftSelections).length > 0 ? (
                    <div>
                      <p className="mb-2">Claiming:</p>
                      <ul className="ml-4 space-y-2">
                        {Object.entries(settings.nftSelections).map(([id, qty]) => {
                          return (
                            <li key={id}>
                              • {qty} NFT{parseInt(qty) !== 1 ? "s" : ""} from{" "}
                              <span className="text-cyan-300 font-semibold">
                                {settings.nftNames[id as keyof typeof settings.nftNames]}
                              </span>
                            </li>
                          );
                        })}
                        <li className="text-purple-300 mt-2 pt-2 border-t border-slate-700/50">
                          💰 {settings.fixedTokenAmount} TOK per NFT type ({Object.entries(settings.nftSelections).filter(([_, qty]) => parseInt(qty) > 0).length} types) = {totalTokenAmount.toFixed(2)} TOK total
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <p>Select NFT types above to create a batch claim</p>
                  )}
                </div>
              </div>
            </div>

            {settings.nftSelections && Object.keys(settings.nftSelections).length > 0 && (
              <>
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-slate-300 mb-4">Transaction Details</h3>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li className="flex items-center gap-2">
                      <span className="text-purple-400">✓</span>
                      {Object.keys(settings.nftSelections).length} NFT types bundled into one transaction
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
                  {isPending ? "⏳ Processing..." : "🚀 Claim All NFTs & Tokens at Once"}
                </button>
              </>
            )}

            {(!settings.nftSelections || Object.keys(settings.nftSelections).length === 0) && (
              <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6 text-center">
                <p className="text-slate-400">Click on NFT types in the settings above to select them for claiming</p>
              </div>
            )}
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

export default BatchMintingHome;
