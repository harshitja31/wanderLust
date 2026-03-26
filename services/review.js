const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports = {
    createReview: async (listingId, reviewData, authorId) => {
        let listing = await Listing.findById(listingId);
        let newReview = new Review(reviewData);
        newReview.author = authorId;
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        return newReview;
    },

    deleteReview: async (listingId, reviewId) => {
        await Listing.findByIdAndUpdate(listingId, { $pull: { reviews: reviewId } });
        return await Review.findByIdAndDelete(reviewId);
    }
};
