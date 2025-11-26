import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ArbitrumSepolia } from "@thirdweb-dev/chains";

// Deploy contracts to Arbitrum Sepolia
const deployToArbitrum = async () => {
  const sdk = ThirdwebSDK.fromPrivateKey(
    process.env.THIRDWEB_PRIVATE_KEY!,
    ArbitrumSepolia
  );

  console.log("🚀 Deploying to Arbitrum Sepolia...");

  try {
    // Deploy Edition Drop (NFT contract)
    console.log("\n📦 Deploying Edition Drop...");
    const editionDrop = await sdk.deployer.deployEditionDrop({
      name: "Cross-Chain NFTs",
      primary_sale_recipient: process.env.WALLET_ADDRESS!,
      symbol: "NFT",
      description: "NFTs for cross-chain account abstraction testing",
    });

    console.log("✅ Edition Drop deployed to:", editionDrop);

    // Deploy Token Drop (Token contract)
    console.log("\n📦 Deploying Token Drop...");
    const tokenDrop = await sdk.deployer.deployTokenDrop({
      name: "Cross-Chain Token",
      primary_sale_recipient: process.env.WALLET_ADDRESS!,
      symbol: "XCT",
      description: "Token for cross-chain account abstraction testing",
    });

    console.log("✅ Token Drop deployed to:", tokenDrop);

    console.log("\n" + "=".repeat(60));
    console.log("📋 DEPLOYMENT SUMMARY - Arbitrum Sepolia");
    console.log("=".repeat(60));
    console.log(`Edition Drop Address: ${editionDrop}`);
    console.log(`Token Drop Address:   ${tokenDrop}`);
    console.log("=".repeat(60));
    console.log("\nUpdate your constants.ts with these addresses!");
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
};

deployToArbitrum();
