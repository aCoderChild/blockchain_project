import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import Image from "next/image";
import walletIcon from "@public/bitcoin.svg";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Account Abstraction examples | thirdweb",
  description: "Account Abstraction examples using the thirdweb Connect SDK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-slate-50 ${inter.className}`}>
        <ThirdwebProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12">
              {children}
            </main>
            <Footer />
          </div>
        </ThirdwebProvider>
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/70 border-b border-slate-700/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl group-hover:shadow-xl group-hover:shadow-indigo-500/50 transition-all transform group-hover:scale-110">
              <Image
                src={walletIcon}
                alt="Wallet Logo"
                width={32}
                height={32}
                className="opacity-95"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Account Abstraction
              </h1>
              <span className="text-xs text-slate-400 -mt-1">Web3 Infrastructure</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-12">
            <MenuItem title="Sponsored" href="/gasless" />
            <MenuItem title="Session keys" href="/session-keys" />
            <MenuItem title="Multichain" href="/multichain" />
            <MenuItem title="Batching" href="/batching" />
          </nav>
        </div>
      </div>
    </header>
  );
}

function MenuItem(props: { title: string; href: string }) {
  return (
    <Link
      href={props.href}
      className="text-sm font-semibold text-slate-300 hover:text-indigo-300 transition-colors duration-300 relative group py-2"
    >
      {props.title}
      <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 group-hover:w-full transition-all duration-300 rounded-full"></span>
    </Link>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-700/50 bg-gradient-to-t from-slate-900/50 to-transparent py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-6">
          {/* Links */}
          <div className="flex items-center space-x-8 text-sm">
            <Link
              className="text-slate-400 hover:text-indigo-300 transition-colors duration-300 inline-flex items-center space-x-1 group"
              target="_blank"
              href="https://github.com/aCoderChild/blockchain_project"
            >
              <span>GitHub</span>
              <span className="transform group-hover:translate-x-1 transition-transform">↗</span>
            </Link>
            <span className="text-slate-700">•</span>
            <Link
              className="text-slate-400 hover:text-indigo-300 transition-colors duration-300"
              target="_blank"
              href="https://thirdweb.com"
            >
              thirdweb
            </Link>
            <span className="text-slate-700">•</span>
            <Link
              className="text-slate-400 hover:text-indigo-300 transition-colors duration-300"
              target="_blank"
              href="https://nextjs.org"
            >
              Next.js
            </Link>
          </div>
          
          {/* Description */}
          <p className="text-xs text-slate-500 text-center max-w-md">
            Demonstrating the power of account abstraction with sponsored transactions, session keys, and batch processing.
          </p>
          
          {/* Copyright */}
          <p className="text-xs text-slate-600">© 2024 Account Abstraction. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}