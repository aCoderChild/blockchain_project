export interface MarketplaceListing {
  id: string;
  seller: string;
  tokenId: string;
  collectionName: string;
  price: string; // in ETH
  quantity: number;
  image?: string;
  description?: string;
  timestamp: string;
  status: "active" | "sold" | "cancelled";
}

// Storage key constants
const GLOBAL_LISTINGS_KEY = "marketplaceListings_global";
const ACCOUNT_LISTINGS_KEY_PREFIX = "marketplaceListings_account_";

// Helper function to get account-specific storage key
const getAccountListingsKey = (sellerAddress: string): string => {
  return `${ACCOUNT_LISTINGS_KEY_PREFIX}${sellerAddress.toLowerCase()}`;
};

// Get all global listings (across all accounts)
const getGlobalListings = (): MarketplaceListing[] => {
  try {
    const existing = localStorage.getItem(GLOBAL_LISTINGS_KEY);
    return existing ? JSON.parse(existing) : [];
  } catch (error) {
    console.error("Failed to get global marketplace listings:", error);
    return [];
  }
};

// Save to global listings
const saveGlobalListings = (listings: MarketplaceListing[]): void => {
  try {
    localStorage.setItem(GLOBAL_LISTINGS_KEY, JSON.stringify(listings));
  } catch (error) {
    console.error("Failed to save global marketplace listings:", error);
  }
};

export const saveMarketplaceListing = (listing: Omit<MarketplaceListing, "id">) => {
  try {
    const globalListings = getGlobalListings();
    
    const newListing: MarketplaceListing = {
      ...listing,
      id: `listing-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    };
    
    // Add to global listings
    globalListings.unshift(newListing);
    saveGlobalListings(globalListings);
    
    // Also save to account-specific storage
    const accountKey = getAccountListingsKey(listing.seller);
    const accountListings = getAccountSpecificListings(listing.seller);
    accountListings.unshift(newListing);
    try {
      localStorage.setItem(accountKey, JSON.stringify(accountListings));
    } catch (error) {
      console.error("Failed to save account-specific listing:", error);
    }
    
    return newListing;
  } catch (error) {
    console.error("Failed to save marketplace listing:", error);
  }
};

export const getMarketplaceListings = (): MarketplaceListing[] => {
  return getGlobalListings();
};

// Get account-specific listings (all listings by a seller)
const getAccountSpecificListings = (sellerAddress: string): MarketplaceListing[] => {
  try {
    const accountKey = getAccountListingsKey(sellerAddress);
    const existing = localStorage.getItem(accountKey);
    return existing ? JSON.parse(existing) : [];
  } catch (error) {
    console.error("Failed to get account-specific listings:", error);
    return [];
  }
};

export const getActiveListings = (): MarketplaceListing[] => {
  return getGlobalListings().filter(l => l.status === "active");
};

export const updateListingStatus = (listingId: string, status: "active" | "sold" | "cancelled") => {
  try {
    // Update in global listings
    const globalListings = getGlobalListings();
    const updated = globalListings.map(l => 
      l.id === listingId ? { ...l, status } : l
    );
    saveGlobalListings(updated);
    
    // Also update in account-specific listings
    const targetListing = globalListings.find(l => l.id === listingId);
    if (targetListing) {
      const accountKey = getAccountListingsKey(targetListing.seller);
      const accountListings = getAccountSpecificListings(targetListing.seller);
      const accountUpdated = accountListings.map(l =>
        l.id === listingId ? { ...l, status } : l
      );
      try {
        localStorage.setItem(accountKey, JSON.stringify(accountUpdated));
      } catch (error) {
        console.error("Failed to update account-specific listing status:", error);
      }
    }
    
    return true;
  } catch (error) {
    console.error("Failed to update listing status:", error);
    return false;
  }
};

export const getSellerListings = (sellerAddress: string): MarketplaceListing[] => {
  // Use account-specific storage for faster lookup
  return getAccountSpecificListings(sellerAddress)
    .filter(l => l.status === "active");
};

export const getUserPurchaseHistory = (buyerAddress: string): MarketplaceListing[] => {
  return getGlobalListings()
    .filter(l => l.status === "sold"); // In a real app, we'd track buyer separately
};
