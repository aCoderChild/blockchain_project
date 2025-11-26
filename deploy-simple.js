require('dotenv').config();
const { ThirdwebSDK } = require("@thirdweb-dev/sdk");

const deploy = async () => {
  console.log("🚀 Starting deployment to Arbitrum Sepolia...");
  console.log("Private Key exists:", !!process.env.THIRDWEB_PRIVATE_KEY);
  console.log("Wallet Address:", process.env.WALLET_ADDRESS);
  console.log("Client ID:", process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID);

  try {
    const pk = process.env.THIRDWEB_PRIVATE_KEY;
    const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;
    console.log("Using private key:", pk.substring(0, 10) + "...");

    const sdk = ThirdwebSDK.fromPrivateKey(pk, 421614, {
      clientId: clientId
    });
    console.log("✅ SDK initialized");

    console.log("📦 Deploying Edition Drop...");
    const edition = await sdk.deployer.deployEditionDrop({
      name: "Cross-Chain NFTs",
      primary_sale_recipient: process.env.WALLET_ADDRESS,
      symbol: "NFT",
    });
    console.log("✅ Edition Drop:", edition);

    console.log("📦 Deploying Token Drop...");
    const token = await sdk.deployer.deployTokenDrop({
      name: "Cross-Chain Token",
      primary_sale_recipient: process.env.WALLET_ADDRESS,
      symbol: "XCT",
    });
    console.log("✅ Token Drop:", token);

    console.log("\n" + "=".repeat(60));
    console.log("SUCCESS! Add to constants.ts:");
    console.log("=".repeat(60));
    console.log(`Edition: ${edition}`);
    console.log(`Token:   ${token}`);
    console.log("=".repeat(60));
  } catch (err) {
    console.error("❌ Error:", err.message);
    console.error(err);
  }
};

deploy();
