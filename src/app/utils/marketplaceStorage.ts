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

export const saveMarketplaceListing = (listing: Omit<MarketplaceListing, "id">) => {
  try {
    const existing = localStorage.getItem("marketplaceListings");
    const listings: MarketplaceListing[] = existing ? JSON.parse(existing) : [];
    
    const newListing: MarketplaceListing = {
      ...listing,
      id: `listing-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    };
    
    listings.unshift(newListing);
    localStorage.setItem("marketplaceListings", JSON.stringify(listings));
    
    return newListing;
  } catch (error) {
    console.error("Failed to save marketplace listing:", error);
  }
};

export const getMarketplaceListings = (): MarketplaceListing[] => {
  try {
    const existing = localStorage.getItem("marketplaceListings");
    return existing ? JSON.parse(existing) : [];
  } catch (error) {
    console.error("Failed to get marketplace listings:", error);
    return [];
  }
};

export const getActiveListings = (): MarketplaceListing[] => {
  return getMarketplaceListings().filter(l => l.status === "active");
};

export const updateListingStatus = (listingId: string, status: "active" | "sold" | "cancelled") => {
  try {
    const existing = localStorage.getItem("marketplaceListings");
    const listings: MarketplaceListing[] = existing ? JSON.parse(existing) : [];
    
    const updated = listings.map(l => 
      l.id === listingId ? { ...l, status } : l
    );
    
    localStorage.setItem("marketplaceListings", JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error("Failed to update listing status:", error);
    return false;
  }
};

export const getSellerListings = (sellerAddress: string): MarketplaceListing[] => {
  return getMarketplaceListings()
    .filter(l => l.seller.toLowerCase() === sellerAddress.toLowerCase() && l.status === "active");
};

export const getUserPurchaseHistory = (buyerAddress: string): MarketplaceListing[] => {
  return getMarketplaceListings()
    .filter(l => l.status === "sold"); // In a real app, we'd track buyer separately
};
