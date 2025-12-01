// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title NFTMarketplace
 * @notice A simple marketplace for ERC1155 NFTs
 * @dev Sellers approve this contract, list NFTs, and buyers can purchase instantly
 */
contract NFTMarketplace is ReentrancyGuard {
    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 quantity;
        uint256 pricePerItem;
        bool active;
    }

    // Mapping from listing ID to Listing
    mapping(uint256 => Listing) public listings;
    uint256 public listingCounter;

    // Events
    event Listed(
        uint256 indexed listingId,
        address indexed seller,
        address indexed nftContract,
        uint256 tokenId,
        uint256 quantity,
        uint256 pricePerItem
    );

    event Purchased(
        uint256 indexed listingId,
        address indexed buyer,
        uint256 quantity,
        uint256 totalPrice
    );

    event ListingCancelled(uint256 indexed listingId);

    constructor() {}

    /**
     * @notice Create a new listing (seller must approve this contract first)
     * @param nftContract The ERC1155 contract address
     * @param tokenId The token ID to sell
     * @param quantity How many tokens to sell
     * @param pricePerItem Price per token in wei
     */
    function createListing(
        address nftContract,
        uint256 tokenId,
        uint256 quantity,
        uint256 pricePerItem
    ) external nonReentrant returns (uint256) {
        require(quantity > 0, "Quantity must be > 0");
        require(pricePerItem > 0, "Price must be > 0");

        IERC1155 nft = IERC1155(nftContract);
        require(
            nft.balanceOf(msg.sender, tokenId) >= quantity,
            "Insufficient NFT balance"
        );
        require(
            nft.isApprovedForAll(msg.sender, address(this)),
            "Marketplace not approved"
        );

        listingCounter++;
        listings[listingCounter] = Listing({
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            quantity: quantity,
            pricePerItem: pricePerItem,
            active: true
        });

        emit Listed(
            listingCounter,
            msg.sender,
            nftContract,
            tokenId,
            quantity,
            pricePerItem
        );

        return listingCounter;
    }

    /**
     * @notice Purchase NFTs from a listing
     * @param listingId The ID of the listing to purchase from
     * @param quantity How many tokens to buy
     */
    function purchase(uint256 listingId, uint256 quantity)
        external
        payable
        nonReentrant
    {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(quantity > 0 && quantity <= listing.quantity, "Invalid quantity");

        uint256 totalPrice = listing.pricePerItem * quantity;
        require(msg.value >= totalPrice, "Insufficient payment");

        // Update listing
        listing.quantity -= quantity;
        if (listing.quantity == 0) {
            listing.active = false;
        }

        // Transfer NFT from seller to buyer
        IERC1155(listing.nftContract).safeTransferFrom(
            listing.seller,
            msg.sender,
            listing.tokenId,
            quantity,
            ""
        );

        // Transfer payment to seller
        (bool success, ) = listing.seller.call{value: totalPrice}("");
        require(success, "Payment transfer failed");

        // Refund excess payment
        if (msg.value > totalPrice) {
            (bool refundSuccess, ) = msg.sender.call{value: msg.value - totalPrice}("");
            require(refundSuccess, "Refund failed");
        }

        emit Purchased(listingId, msg.sender, quantity, totalPrice);
    }

    /**
     * @notice Cancel a listing
     * @param listingId The ID of the listing to cancel
     */
    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(listing.seller == msg.sender, "Not the seller");

        listing.active = false;

        emit ListingCancelled(listingId);
    }

    /**
     * @notice Get listing details
     * @param listingId The ID of the listing
     */
    function getListing(uint256 listingId)
        external
        view
        returns (
            address seller,
            address nftContract,
            uint256 tokenId,
            uint256 quantity,
            uint256 pricePerItem,
            bool active
        )
    {
        Listing memory listing = listings[listingId];
        return (
            listing.seller,
            listing.nftContract,
            listing.tokenId,
            listing.quantity,
            listing.pricePerItem,
            listing.active
        );
    }
}
