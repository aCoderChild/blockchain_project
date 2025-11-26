const { ThirdwebSDK } = require("@thirdweb-dev/sdk");

// Arbitrum Sepolia chain ID is 421614
const deployToArbitrum = async () => {
  try {
    console.log("🚀 Deploying to Arbitrum Sepolia...");
    
    // Ensure private key has 0x prefix
    const privateKey = process.env.THIRDWEB_PRIVATE_KEY.startsWith('0x') 
      ? process.env.THIRDWEB_PRIVATE_KEY 
      : '0x' + process.env.THIRDWEB_PRIVATE_KEY;
    
    const sdk = ThirdwebSDK.fromPrivateKey(
      privateKey,
      421614, // Arbitrum Sepolia Chain ID
      {
        clientId: process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID,
      }
    );

    console.log("📦 Deploying Edition Drop (NFT)...");
    const editionDropAddress = await sdk.deployer.deployEditionDrop({
      name: "Cross-Chain NFTs",
      primary_sale_recipient: process.env.WALLET_ADDRESS,
      symbol: "NFT",
      description: "NFTs for cross-chain account abstraction testing",
    });

    console.log("✅ Edition Drop deployed to:", editionDropAddress);

    console.log("\n📦 Deploying Token Drop...");
    const tokenDropAddress = await sdk.deployer.deployTokenDrop({
      name: "Cross-Chain Token",
      primary_sale_recipient: process.env.WALLET_ADDRESS,
      symbol: "XCT",
      description: "Token for cross-chain account abstraction testing",
    });

    console.log("✅ Token Drop deployed to:", tokenDropAddress);

    console.log("\n" + "=".repeat(70));
    console.log("✨ DEPLOYMENT COMPLETE - Arbitrum Sepolia");
    console.log("=".repeat(70));
    console.log(`\n📋 Update your constants.ts with these addresses:\n`);
    console.log(`Edition Drop: ${editionDropAddress}`);
    console.log(`Token Drop:   ${tokenDropAddress}`);
    console.log("\n" + "=".repeat(70));
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    process.exit(1);
  }
};

deployToArbitrum();
