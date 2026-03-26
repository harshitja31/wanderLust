const Listing = require("../models/listing.js");

module.exports = {
    getAllListings: async (page = 1, limit = 12) => {
        const skip = (page - 1) * limit;
        const total = await Listing.countDocuments({});
        const listings = await Listing.find({}).skip(skip).limit(limit);
        return { listings, total, limit, page };
    },

    getListingByIdPopulated: async (id) => {
        return await Listing.findById(id)
            .populate({ path: "reviews", populate: { path: "author" } })
            .populate("owner");
    },

    getListingById: async (id) => {
        return await Listing.findById(id);
    },

    createListing: async (listingData, ownerId, imageInfo, geometry) => {
        const newListing = new Listing(listingData);
        newListing.owner = ownerId;
        newListing.image = imageInfo;
        newListing.geometry = geometry;
        await newListing.save();
        return newListing;
    },

    updateListing: async (id, listingData, imageInfo) => {
        let listing = await Listing.findByIdAndUpdate(id, listingData);
        if (imageInfo) {
            listing.image = imageInfo;
            await listing.save();
        }
        return listing;
    },

    deleteListing: async (id) => {
        return await Listing.findByIdAndDelete(id);
    }
};
