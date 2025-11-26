import { NFT_COLLECTION_NAMES } from "../constants";

export interface Transaction {
  id: string;
  type: "mint" | "claim" | "transfer" | "batch";
  tokenIds: string[];
  collectionNames: string[];
  timestamp: string;
  status: "pending" | "confirmed" | "failed";
  hash: string;
  quantity: number;
}

export const saveTransaction = (transaction: Omit<Transaction, "id">) => {
  try {
    const existing = localStorage.getItem("transactionHistory");
    const transactions: Transaction[] = existing ? JSON.parse(existing) : [];
    
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    
    transactions.unshift(newTransaction);
    
    // Keep only last 50 transactions
    if (transactions.length > 50) {
      transactions.pop();
    }
    
    localStorage.setItem("transactionHistory", JSON.stringify(transactions));
    
    return newTransaction;
  } catch (error) {
    console.error("Failed to save transaction:", error);
  }
};

export const getTransactions = (): Transaction[] => {
  try {
    const existing = localStorage.getItem("transactionHistory");
    return existing ? JSON.parse(existing) : [];
  } catch (error) {
    console.error("Failed to get transactions:", error);
    return [];
  }
};

export const createTransactionRecord = (
  type: "mint" | "claim" | "transfer" | "batch",
  tokenIds: bigint[],
  hash: string,
  quantity: number = 1
): Omit<Transaction, "id"> => {
  const tokenIdStrings = tokenIds.map(id => id.toString());
  const collectionNames = tokenIdStrings.map(
    id => NFT_COLLECTION_NAMES[id] || `NFT #${id}`
  );

  return {
    type,
    tokenIds: tokenIdStrings,
    collectionNames,
    timestamp: new Date().toLocaleString(),
    status: "confirmed",
    hash,
    quantity,
  };
};