const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: String,
        filename: String
    },
    price: Number,
    location: String,
    country: String,
    category: {
        type: String,
        enum: [
            "Rooms",
            "Amazing Pools",
            "Farms",
            "Beachfront",
            "Islands",
            "Top cities",
            "Arctic",
            "Mountains",
            "Camping",
            "Lakefronts"
        ]
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String, // Must be "Point"
            enum: ["Point"], // Must be "Point"
            required: true
        },
        coordinates: {
            type: [Number], // Array of numbers
            required: true
        }
    }
});

// Database Indexes for faster queries and search functionality
listingSchema.index({ owner: 1 }); // Optimize lookups for an owner's listings
listingSchema.index({ country: 1 }); // Optimize filtering by country
listingSchema.index({ geometry: "2dsphere" }); // Enable geospatial queries for maps
listingSchema.index({ title: "text", description: "text" }); // Enable text-based search on listings

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
