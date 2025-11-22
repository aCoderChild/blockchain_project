import Image from "next/image";
import { ConnectButton } from "thirdweb/react";
import walletIcon from "@public/bitcoin.svg";
import { accountAbstraction, client } from "./constants";
import Link from "next/link";
import { lightTheme } from "thirdweb/react";

export default function Home() {
  return (
      <div className="min-h-screen flex flex-col justify-between">
        <div className="flex-1">
          {/* Hero Section */}
          <div className="relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-purple-500/5 blur-3xl -z-10"></div>
            
            <div className="max-w-6xl mx-auto flex flex-col items-center py-20">
              {/* Connect Button */}
              <div className="mb-16 animate-fade-in scale-125">
                <ConnectButton
                        client={client}
                        accountAbstraction={accountAbstraction}
                        theme={lightTheme()}
                        connectModal={{ size: "compact" }}
                  />
              </div>
              
              {/* Main Heading */}
              <div className="text-center mb-16 space-y-6">
                <div className="inline-block">
                  <span className="px-4 py-2 bg-indigo-500/10 border border-indigo-400/30 rounded-full text-indigo-300 text-sm font-medium">
                    Web3 Infrastructure for Everyone
                  </span>
                </div>
                <h1 className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent animate-fade-in leading-tight">
                  Account Abstraction
                </h1>
                <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto animate-fade-in leading-relaxed">
                  Unlock the power of account abstraction with sponsored transactions, session keys, and batch processing. Build seamless Web3 experiences.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto px-4">
                <FeatureCard
                  title="Sponsored Transactions"
                  description="Enable gas-free transactions for users, reducing barriers to Web3 adoption and improving user experience."
                  href="/gasless"
                  icon="⚡"
                  color="indigo"
                />
                <FeatureCard
                  title="Session Keys"
                  description="Create restricted keys with specific permissions for seamless user experiences without constant approvals."
                  href="/session-keys"
                  icon="🔑"
                  color="purple"
                />
                <FeatureCard
                  title="Batching Transactions"
                  description="Execute multiple transactions in one, optimizing costs and efficiency for complex operations."
                  href="/batching"
                  icon="📦"
                  color="pink"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

function FeatureCard({ title, description, href, icon = "✨", color = "indigo" }: FeatureCardProps & { icon?: string; color?: string }) {
  const colorClasses = {
    indigo: {
      gradient: "from-indigo-500/20 to-indigo-600/10",
      border: "border-indigo-500/30 hover:border-indigo-400/50",
      text: "group-hover:text-indigo-300",
      glow: "from-indigo-500 to-indigo-600",
    },
    purple: {
      gradient: "from-purple-500/20 to-purple-600/10",
      border: "border-purple-500/30 hover:border-purple-400/50",
      text: "group-hover:text-purple-300",
      glow: "from-purple-500 to-purple-600",
    },
    pink: {
      gradient: "from-pink-500/20 to-pink-600/10",
      border: "border-pink-500/30 hover:border-pink-400/50",
      text: "group-hover:text-pink-300",
      glow: "from-pink-500 to-pink-600",
    },
  };

  const theme = colorClasses[color as keyof typeof colorClasses] || colorClasses.indigo;

  return (
    <Link href={href}>
      <div className={`group relative h-full bg-gradient-to-br ${theme.gradient} ${theme.border} rounded-2xl p-8 transition-all duration-300 cursor-pointer overflow-hidden border backdrop-blur-sm hover:shadow-2xl hover:shadow-${color}-500/20`}>
        {/* Animated gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-all duration-300`} style={{background: `linear-gradient(135deg, rgb(99, 102, 241), rgb(139, 92, 246))`}}></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            {/* Icon */}
            <div className="text-6xl mb-6 transform group-hover:scale-125 transition-all duration-300 filter drop-shadow-lg">
              {icon}
            </div>
            
            {/* Title */}
            <h2 className={`text-2xl font-bold text-white mb-4 ${theme.text} transition-colors leading-tight`}>
              {title}
            </h2>
            
            {/* Description */}
            <p className="text-slate-300 text-sm leading-relaxed min-h-24">
              {description}
            </p>
          </div>
          
          {/* CTA */}
          <div className="mt-8 inline-flex items-center gap-3 font-semibold group-hover:gap-4 transition-all">
            <span className="text-indigo-400 group-hover:text-indigo-300">Explore</span>
            <span className="text-indigo-400 group-hover:text-indigo-300 transform group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
        
        {/* Glow effect */}
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${theme.glow} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300 -z-10`}></div>
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