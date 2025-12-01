"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    batchNFTQty: "1",
    batchTokenAmount: "0.1",
    nftCount: "7",
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

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("appSettings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
    alert("✅ Settings saved successfully!");
  };

  // Reset to defaults
  const resetDefaults = () => {
    setSettings({
      batchNFTQty: "1",
      batchTokenAmount: "0.1",
      nftCount: "7",
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
            ⚙️ Customization Settings
          </h1>
          <p className="text-slate-300 text-lg">
            Adjust your NFT quantities, token amounts, and collection names
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow max-w-6xl mx-auto w-full px-4 py-12">
        {/* Quick Settings */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Batch NFT Quantity */}
          <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-500/30 rounded-2xl p-6">
            <label className="text-white font-bold text-lg mb-3 block">
              📦 Batch NFT Quantity
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={settings.batchNFTQty}
              onChange={(e) =>
                setSettings({ ...settings, batchNFTQty: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-900/50 border border-indigo-500/50 rounded-lg text-white focus:border-indigo-400 focus:outline-none"
              placeholder="Enter NFT quantity"
            />
            <p className="text-slate-400 text-sm mt-2">
              How many NFTs to claim per batch transaction
            </p>
          </div>

          {/* Batch Token Amount */}
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-2xl p-6">
            <label className="text-white font-bold text-lg mb-3 block">
              💰 Batch Token Amount
            </label>
            <input
              type="text"
              value={settings.batchTokenAmount}
              onChange={(e) =>
                setSettings({ ...settings, batchTokenAmount: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/50 rounded-lg text-white focus:border-purple-400 focus:outline-none"
              placeholder="Enter token amount"
            />
            <p className="text-slate-400 text-sm mt-2">
              How many tokens to claim per batch transaction
            </p>
          </div>
        </div>

        {/* NFT Collection Names & Descriptions */}
        <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/10 border border-pink-500/30 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🎨</span> NFT Collections
          </h2>

          <div className="space-y-6">
            {Object.entries(settings.nftNames).map(([id, name]) => (
              <div
                key={id}
                className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-5 hover:border-pink-500/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-pink-300">
                    Token ID: {id}
                  </h3>
                  <span className="text-xs px-3 py-1 bg-pink-500/20 border border-pink-500/50 rounded-full text-pink-300">
                    #{id}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="text-slate-300 text-sm font-semibold block mb-2">
                      Collection Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) =>
                        handleNameChange(id, e.target.value)
                      }
                      className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded text-slate-100 focus:border-pink-400 focus:outline-none"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-slate-300 text-sm font-semibold block mb-2">
                      Description
                    </label>
                    <textarea
                      value={
                        settings.nftDescriptions[id as keyof typeof settings.nftDescriptions] ||
                        ""
                      }
                      onChange={(e) =>
                        handleDescriptionChange(id, e.target.value)
                      }
                      className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded text-slate-100 focus:border-pink-400 focus:outline-none resize-none"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-12">
          <button
            onClick={saveSettings}
            className="flex-1 py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50"
          >
            💾 Save Settings
          </button>
          <button
            onClick={resetDefaults}
            className="flex-1 py-4 px-6 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-bold rounded-lg transition-all duration-300"
          >
            🔄 Reset to Defaults
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-blue-300 mb-3 flex items-center gap-2">
            <span>ℹ️</span> How It Works
          </h3>
          <ul className="text-slate-300 space-y-2 text-sm">
            <li>✓ Changes are saved to your browser&apos;s local storage</li>
            <li>✓ Your settings persist when you refresh the page</li>
            <li>✓ Customize NFT names with emojis for visual appeal</li>
            <li>✓ Adjust batch quantities to fit your needs</li>
            <li>✓ Settings apply immediately across the app</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700/50 py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="text-slate-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-2 group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">
              ←
            </span>
            Back to menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
