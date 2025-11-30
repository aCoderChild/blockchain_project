import Image from "next/image";
import { ConnectButton } from "thirdweb/react";
import walletIcon from "@public/bitcoin.svg";
import { accountAbstraction, client } from "./constants";
import Link from "next/link";
import { lightTheme } from "thirdweb/react";

export default function Home() {
  return (
      <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950">
        <div className="flex-1">
          {/* Hero Section */}
          <div className="relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 to-emerald-500/5 blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
            
            <div className="max-w-7xl mx-auto flex flex-col items-center py-24 px-6">
              {/* Connect Button */}
              <div className="mb-20 animate-fade-in transform hover:scale-110 transition-all duration-300">
                <div className="p-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl shadow-2xl shadow-teal-500/30">
                  <div className="bg-slate-900 rounded-xl">
                    <ConnectButton
                          client={client}
                          accountAbstraction={accountAbstraction}
                          theme={lightTheme()}
                          connectModal={{ size: "compact" }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Main Heading */}
              <div className="text-center mb-24 space-y-10">
                <div className="inline-block">
                  <span className="px-8 py-4 bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-cyan-500/10 border-2 border-teal-400/30 rounded-full text-teal-200 text-base font-bold shadow-2xl shadow-teal-500/20 backdrop-blur-sm">
                    🚀 Next-Gen Web3 Infrastructure
                  </span>
                </div>
                <h1 className="text-7xl md:text-[140px] font-black bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent leading-tight drop-shadow-2xl">
                  Account Abstraction
                </h1>
                <p className="text-slate-300 text-xl md:text-2xl max-w-5xl mx-auto leading-relaxed font-light">
                  Experience the future of blockchain with sponsored transactions, seamless interactions, and powerful batch operations.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-6 w-full max-w-7xl mx-auto px-6 mb-10">
                <FeatureCard
                  title="Gas-Free Minting"
                  description="Claim NFTs without paying any gas fees. Perfect for onboarding new users to Web3."
                  href="/gasless"
                  icon="⚡"
                  color="teal"
                />
                <FeatureCard
                  title="Session Keys"
                  description="Set up temporary permissions for seamless interactions without constant wallet approvals."
                  href="/session-keys"
                  icon="🔑"
                  color="emerald"
                />
                <FeatureCard
                  title="NFT Gallery"
                  description="Explore stunning NFT collections with instant minting and detailed ownership tracking."
                  href="/multichain"
                  icon="🎨"
                  color="cyan"
                />
              </div>

              {/* Additional Features Grid */}
              <div className="grid md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto px-6">
                <FeatureCard
                  title="Activity Timeline"
                  description="Monitor every transaction with real-time updates and comprehensive history tracking."
                  href="/history"
                  icon="📊"
                  color="teal"
                />
                <FeatureCard
                  title="NFT Marketplace"
                  description="Trade exclusive digital assets in a peer-to-peer marketplace with instant settlements."
                  href="/marketplace"
                  icon="🛒"
                  color="emerald"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

function FeatureCard({ title, description, href, icon = "✨", color = "teal" }: FeatureCardProps & { icon?: string; color?: string }) {
  const colorClasses = {
    teal: {
      gradient: "from-teal-500/15 to-teal-600/5",
      border: "border-teal-500/40 hover:border-teal-400/70",
      text: "group-hover:text-teal-200",
      glow: "from-teal-500 to-teal-600",
    },
    emerald: {
      gradient: "from-emerald-500/15 to-emerald-600/5",
      border: "border-emerald-500/40 hover:border-emerald-400/70",
      text: "group-hover:text-emerald-200",
      glow: "from-emerald-500 to-emerald-600",
    },
    cyan: {
      gradient: "from-cyan-500/15 to-cyan-600/5",
      border: "border-cyan-500/40 hover:border-cyan-400/70",
      text: "group-hover:text-cyan-200",
      glow: "from-cyan-500 to-cyan-600",
    },
  };

  const theme = colorClasses[color as keyof typeof colorClasses] || colorClasses.teal;

  return (
    <Link href={href}>
      <div className={`group relative h-full bg-gradient-to-br ${theme.gradient} ${theme.border} rounded-2xl p-10 transition-all duration-300 cursor-pointer overflow-hidden border-2 backdrop-blur-xl hover:shadow-2xl hover:shadow-${color}-500/40 hover:-translate-y-3`}>
        {/* Animated gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-all duration-300`} style={{background: `linear-gradient(135deg, rgba(20, 184, 166, 0.05), rgba(16, 185, 129, 0.05))`}}></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full min-h-[320px]">
          <div>
            {/* Icon */}
            <div className="text-8xl mb-8 transform group-hover:scale-110 transition-all duration-300 filter drop-shadow-2xl">
              {icon}
            </div>
            
            {/* Title */}
            <h2 className={`text-3xl font-black text-white mb-5 ${theme.text} transition-colors leading-tight`}>
              {title}
            </h2>
            
            {/* Description */}
            <p className="text-slate-400 text-base leading-relaxed group-hover:text-slate-300 transition-colors">
              {description}
            </p>
          </div>
          
          {/* CTA */}
          <div className="mt-8 inline-flex items-center gap-3 font-bold group-hover:gap-5 transition-all duration-300">
            <span className="text-teal-400 group-hover:text-teal-200 text-lg">Explore</span>
            <span className="text-teal-400 group-hover:text-teal-200 transform group-hover:translate-x-2 transition-transform text-xl">→</span>
          </div>
        </div>
        
        {/* Glow effect */}
        <div className={`absolute -inset-1 bg-gradient-to-r ${theme.glow} rounded-2xl opacity-0 group-hover:opacity-40 blur-xl transition-all duration-300 -z-10`}></div>
      </div>
    </Link>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  icon?: string;
  color?: string;
}