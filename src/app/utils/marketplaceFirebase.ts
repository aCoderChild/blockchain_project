import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  serverTimestamp,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface MarketplaceListing {
  id: string;
  blockchainListingId?: number; // Blockchain listing ID from smart contract
  seller: string;
  tokenId: string;
  collectionName: string;
  price: string;
  quantity: number;
  timestamp: string;
  status: "active" | "sold" | "cancelled";
}

const LISTINGS_COLLECTION = "marketplace_listings";

export const saveMarketplaceListing = async (
  listing: Omit<MarketplaceListing, "id">
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, LISTINGS_COLLECTION), {
      ...listing,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving listing:", error);
    throw error;
  }
};

export const getActiveListings = async (): Promise<MarketplaceListing[]> => {
  try {
    const q = query(
      collection(db, LISTINGS_COLLECTION),
      where("status", "==", "active"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MarketplaceListing[];
  } catch (error) {
    console.error("Error getting listings:", error);
    return [];
  }
};

export const getSellerListings = async (
  sellerAddress: string
): Promise<MarketplaceListing[]> => {
  try {
    const q = query(
      collection(db, LISTINGS_COLLECTION),
      where("seller", "==", sellerAddress),
      where("status", "==", "active"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MarketplaceListing[];
  } catch (error) {
    console.error("Error getting seller listings:", error);
    return [];
  }
};

export const updateListingStatus = async (
  listingId: string,
  status: "sold" | "cancelled"
): Promise<void> => {
  try {
    const listingRef = doc(db, LISTINGS_COLLECTION, listingId);
    await updateDoc(listingRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating listing:", error);
    throw error;
  }
};
