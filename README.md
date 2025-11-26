# Account Abstraction Web Infrastructure

A comprehensive web application demonstrating **Account Abstraction** with [thirdweb](https://thirdweb.com/) SDK v5. This project showcases advanced blockchain features including sponsored transactions, batch minting, transaction history tracking, and a peer-to-peer NFT marketplace.

## 🚀 Features

### 1. **Sponsored Transactions (Gas-Free)**
- Users can claim NFTs without paying gas fees
- Transactions are sponsored by the protocol
- Perfect for onboarding new users
- **Page**: `/gasless`

### 2. **NFT Gallery & Direct Minting**
- Browse available NFT collections with aesthetic names
- Direct minting capability from gallery view
- Real-time NFT metadata display
- Transaction history integration
- **Page**: `/multichain`

### 3. **Batch Minting System**
- Mint multiple NFT types in a single transaction
- Customizable NFT selection and quantities
- Fixed token amounts per NFT type (0.1-0.4 TOK)
- Auto-calculated batch totals
- Atomic execution (all-or-nothing)
- Display-only token amount references
- **Page**: `/batching`

### 4. **Transaction History**
- Complete transaction tracking with localStorage persistence
- Auto-refresh every 2 seconds
- Filter by transaction type (mint, claim, transfer, batch)
- Sort by newest first
- Displays transaction hash, timestamp, and NFT details
- **Page**: `/history`

### 5. **P2P NFT Marketplace**
- Users can create and manage NFT listings
- Browse listings from all wallets
- Simulated purchase system
- Marketplace statistics (active listings, floor price, volume)
- Listing status management (active, sold, cancelled)
- **Page**: `/marketplace`

### 6. **Session Keys**
- Create temporary session keys with specific permissions
- Manage authorized contracts and methods
- Revoke sessions when needed

## 🛠 Tech Stack

- **Framework**: Next.js 14.1.0 with React 18 & TypeScript
- **Web3**: Thirdweb SDK v5.20.0
- **Blockchain**: Sepolia Testnet
- **Styling**: Tailwind CSS
- **Storage**: localStorage for transactions and marketplace listings
- **Smart Contracts**: ERC1155 Edition Drop (NFTs)

## 📋 Prerequisites

- Node.js v16 or higher
- npm or yarn package manager
- Thirdweb client ID

## ⚙️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aCoderChild/blockchain_project.git
   cd account-abstraction
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the project root:
   ```env
   NEXT_PUBLIC_TEMPLATE_CLIENT_ID=your_thirdweb_client_id_here
   ```
   
   Get your client ID from [thirdweb Dashboard](https://thirdweb.com/dashboard)

4. **Start the development server:**
   ```bash
   yarn dev
   # or
   npm run dev
   ```

5. **Open in browser:**
   Navigate to `http://localhost:3000`

## 📱 Pages & Features

### `/` - Home
- Main navigation hub
- Feature cards for all sections
- Quick access to all functionalities

### `/gasless` - Sponsored Transactions
- Gas-free NFT claiming
- Real-time transaction confirmation
- Automatic transaction history saving
- NFT preview modal

### `/multichain` - NFT Gallery
- Browse all available NFT collections
- Aesthetic collection names display
- Direct minting from gallery
- Batch minting navigation
- Transaction confirmation with history tracking

### `/batching` - Batch Minting
- Select multiple NFT types
- Customize quantities for each type
- Fixed token amount per NFT type
- Auto-calculated batch totals
- Customizable collection metadata
- Settings persistence via localStorage

### `/history` - Transaction History
- View all your NFT transactions
- Auto-refresh every 2 seconds
- Filter by transaction type
- Search and sort capabilities
- Transaction details (hash, timestamp, collections)

### `/marketplace` - P2P NFT Trading
- **My Listings**: Manage your NFT listings
- **Marketplace**: Browse all active listings
- Create new listings with price and quantity
- View seller information
- Simulated purchase system
- Marketplace statistics dashboard

## 🎮 How to Use

### Claiming NFTs (Sponsored)
1. Connect your wallet on the Sponsored page
2. Browse available NFTs
3. Click "Claim This NFT"
4. Confirm transaction (no gas required!)
5. View transaction in History page

### Batch Minting
1. Go to Batch Minting page
2. Click NFT type buttons to select them
3. Set quantity for each selected NFT
4. Adjust fixed token amount if needed
5. Review batch summary
6. Click "Claim All NFTs & Tokens at Once"
7. Transaction saved to history automatically

### Using Marketplace
1. **List Your NFTs**: 
   - Go to Marketplace → "Create Listing"
   - Select NFT type and quantity
   - Set price in ETH
   - Submit to list

2. **Browse & Purchase**:
   - View all active listings
   - Sort by price or newest
   - Search by collection name
   - Click "Buy Now" to purchase

3. **Manage Listings**:
   - View your active listings in "My Listings"
   - Cancel listings when needed

## 💾 Data Persistence

- **Transactions**: Stored in browser localStorage
- **Marketplace Listings**: Persistent in localStorage
- **App Settings**: Batch minting preferences saved
- **Max Storage**: Last 50 transactions retained

## 🔐 Smart Account Integration

- Uses Thirdweb Account Abstraction
- Smart Account address as wallet identifier
- Sponsored gas fees enabled
- Sepolia testnet configuration
- ERC1155 Edition Drop contract

## 📊 NFT Collections

Currently supported NFT types:

| Token # | Collection Name | Symbol |
|---------|-----------------|--------|
| 3 | 🎨 Pixel Dreamers | PXL |
| 4 | 🌟 Cosmic Legends | CSM |
| 5 | ⚡ Thunder Collective | THN |
| 6 | 🎭 Mystic Souls | MST |
| 7 | 🌸 Digital Garden | DGN |
| 8 | 🚀 Future Riders | FTR |
| 9 | 💎 Crystal Essence | CRE |

## 🔄 Transaction Types

- **Mint**: Direct NFT minting from gallery
- **Claim**: Gas-free sponsored claiming
- **Transfer**: NFT transfers between wallets
- **Batch**: Multiple NFTs in single transaction

## 🌐 Network Configuration

- **Chain**: Sepolia Testnet
- **RPC**: Thirdweb RPC endpoints
- **Contract**: ERC1155 Edition Drop
- **Smart Account**: Enabled with sponsored gas

## 📚 References

- [Thirdweb Documentation](https://portal.thirdweb.com/)
- [Account Abstraction Guide](https://portal.thirdweb.com/typescript/v5/account-abstraction)
- [ERC1155 Standard](https://eips.ethereum.org/EIPS/eip-1155)
- [Sepolia Testnet Faucet](https://sepoliafaucet.com/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📄 License

This project is open source and available under the MIT License.

## 📞 Support

For issues, questions, or feature requests, please open an issue in the repository or contact the development team.
