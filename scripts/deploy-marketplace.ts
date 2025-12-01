import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying NFT Marketplace contract...");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy the marketplace
  const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
  const marketplace = await NFTMarketplace.deploy();
  await marketplace.waitForDeployment();

  const marketplaceAddress = await marketplace.getAddress();
  console.log("\n✅ NFTMarketplace deployed to:", marketplaceAddress);

  console.log("\n📋 Next steps:");
  console.log("1. Add this to your .env.local:");
  console.log(`   NEXT_PUBLIC_MARKETPLACE_ADDRESS=${marketplaceAddress}`);
  console.log("\n2. Update constants.ts with the marketplace address");
  console.log("\n3. Verify on Etherscan (optional):");
  console.log(`   npx hardhat verify --network sepolia ${marketplaceAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
