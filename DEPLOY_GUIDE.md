# 🚀 Deploy NFT Marketplace Contract

Since Hardhat 3 has ESM issues with your Next.js setup, we'll deploy using **Remix IDE** (browser-based, easy!):

## Step 1: Open Remix IDE
Go to: https://remix.ethereum.org

## Step 2: Create the Contract
1. In the File Explorer (left sidebar), create a new file: `NFTMarketplace.sol`
2. Copy and paste the entire contract code from: `contracts/NFTMarketplace.sol`

## Step 3: Install OpenZeppelin
1. Click the "File Explorer" icon (📁)
2. Right-click in the file explorer
3. Select "Add OpenZeppelin Contracts"
4. Or manually create `@openzeppelin/contracts` folder and add the required files

**Easier method:** The contract will auto-import from GitHub! Just compile it.

## Step 4: Compile
1. Click the "Solidity Compiler" icon (left sidebar, looks like 📋)
2. Select compiler version: `0.8.20`
3. Click "Compile NFTMarketplace.sol"
4. Wait for ✅ green checkmark

## Step 5: Deploy to Sepolia
1. Click "Deploy & Run Transactions" icon (left sidebar, looks like 🚀)
2. In "ENVIRONMENT" dropdown, select: **"Injected Provider - MetaMask"**
3. MetaMask will popup - connect your wallet
4. Make sure MetaMask is on **Sepolia** network
5. Contract dropdown should show "NFTMarketplace"
6. Click orange **"Deploy"** button
7. Confirm transaction in MetaMask
8. Wait for deployment (~30 seconds)

## Step 6: Copy Contract Address
1. After deployment, look in the "Deployed Contracts" section (bottom of left sidebar)
2. You'll see your contract with an address like: `0x1234...5678`
3. Click the copy icon to copy the address
4. **SAVE THIS ADDRESS** - you'll need it!

## Step 7: Update Your Project
Come back here and paste the marketplace contract address, then I'll update your code!

---

## Alternative: Use This Pre-Deployed Contract (For Testing)
If you want to skip deployment for now, I can set up the code structure and you can deploy later.

Let me know when you have the contract address!
