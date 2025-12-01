const { ethers } = require("ethers");

const MARKETPLACE_ABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "listingId", "type": "uint256"}],
    "name": "getListing",
    "outputs": [
      {"internalType": "address", "name": "seller", "type": "address"},
      {"internalType": "address", "name": "nftContract", "type": "address"},
      {"internalType": "uint256", "name": "tokenId", "type": "uint256"},
      {"internalType": "uint256", "name": "quantity", "type": "uint256"},
      {"internalType": "uint256", "name": "pricePerItem", "type": "uint256"},
      {"internalType": "bool", "name": "active", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

async function checkListing() {
  const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.org");
  const marketplace = new ethers.Contract(
    "0x3C4cB2ABecfFA20b0bE9b05d1E81C45bc46c5a7a",
    MARKETPLACE_ABI,
    provider
  );
  
  try {
    const listing = await marketplace.getListing(1);
    console.log("\n=== Blockchain Listing ID 1 ===");
    console.log("Seller:", listing[0]);
    console.log("NFT Contract:", listing[1]);
    console.log("Token ID:", listing[2].toString());
    console.log("Quantity:", listing[3].toString());
    console.log("Price:", ethers.formatEther(listing[4]), "ETH");
    console.log("Active:", listing[5]);
    console.log("\n");
  } catch (error) {
    console.error("Error checking listing:", error.message);
  }
}

checkListing();
