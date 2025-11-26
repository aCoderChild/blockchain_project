import { createThirdwebClient, getContract } from "thirdweb";
import { sepolia, arbitrumSepolia } from "thirdweb/chains";
import { SmartWalletOptions } from "thirdweb/wallets";

// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;

if (!clientId) {
	throw new Error("No client ID provided");
}

export const client = createThirdwebClient({
	clientId: clientId,
});

export const chain = sepolia;
export const tokenDropAddress = "0xB559DbB23fb9c383E759404B70591FD3764Ed63b";
export const editionDropAddress = "0xa2c644D07a78aD12A71c75D5185Fc6885D4bBb48";
export const editionDropTokenId = 9n;

export const editionDropContract = getContract({
	address: editionDropAddress,
	chain,
	client,
});

export const tokenDropContract = getContract({
	address: tokenDropAddress,
	chain,
	client,
});

// Multichain configuration - Supporting Sepolia and Arbitrum Sepolia
export const supportedChains = [sepolia, arbitrumSepolia];

// Chains where contracts are currently deployed
export const deployedChains = [sepolia.id, arbitrumSepolia.id];

// Chain-specific contract addresses
export const chainContractAddresses: { [key: number]: { edition: string; token: string } } = {
	[sepolia.id]: {
		edition: "0xa2c644D07a78aD12A71c75D5185Fc6885D4bBb48",
		token: "0xB559DbB23fb9c383E759404B70591FD3764Ed63b",
	},
	[arbitrumSepolia.id]: {
		edition: "0xa2c644D07a78aD12A71c75D5185Fc6885D4bBb48",
		token: "0xB559DbB23fb9c383E759404B70591FD3764Ed63b",
	},
};

// ===== CUSTOMIZABLE PARAMETERS =====
// Batching: Quantities to claim
export const BATCH_NFT_QUANTITY = 1n;
export const BATCH_TOKEN_AMOUNT = "0.1"; // in token units

// Gasless/Sponsored: NFT token IDs to display
export const NFT_TOKEN_IDS = [3n, 4n, 5n, 6n, 7n, 8n, 9n];

// NFT Collection Names (Customize these!)
export const NFT_COLLECTION_NAMES: { [key: string]: string } = {
	"3": "🎨 Pixel Dreamers",
	"4": "🌟 Cosmic Legends",
	"5": "⚡ Thunder Collective",
	"6": "🎭 Mystic Souls",
	"7": "🌸 Digital Garden",
	"8": "🚀 Future Riders",
	"9": "💎 Crystal Essence",
};

// NFT Collection Descriptions
export const NFT_DESCRIPTIONS: { [key: string]: string } = {
	"3": "Experience the magic of pixel art with unique digital creatures",
	"4": "Join an interstellar journey with cosmic-inspired artwork",
	"5": "Powered by electric energy and dynamic visuals",
	"6": "Mysterious and theatrical digital performances",
	"7": "Nature meets technology in this harmonious collection",
	"8": "Speed and innovation at its finest",
	"9": "Premium collection with crystalline aesthetics",
};

export const accountAbstraction: SmartWalletOptions = {
	chain,
	sponsorGas: true,
};
