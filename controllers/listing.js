const ListingService = require("../services/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 12; // Or 8, depending on grid preference
    const data = await ListingService.getAllListings(page, limit);

    res.render("listings/index.ejs", {
        allListings: data.listings,
        currentPage: data.page,
        totalPages: Math.ceil(data.total / data.limit)
    });
};

module.exports.renderNewForm = async (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    const listing = await ListingService.getListingByIdPopulated(req.params.id);

    if (!listing) {
        req.flash("error", "Listing you requested doesn't exist.");
        return res.redirect("/listings"); // Add return here to stop further execution
    }

    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
    let response = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        })
        .send();

    if (!req.file) {
        req.flash("error", "Please upload an image for the listing.");
        return res.redirect("/listings/new");
    }

    if (!response.body.features || response.body.features.length === 0) {
        req.flash("error", "Could not find the location. Please enter a valid address.");
        return res.redirect("/listings/new");
    }

    let url = req.file.path;
    let filename = req.file.filename;

    await ListingService.createListing(
        req.body.listing,
        req.user._id,
        { url, filename },
        response.body.features[0].geometry
    );

    req.flash("success", "New Listing Added Successfully!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    const listing = await ListingService.getListingById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing you requested doesn't exist.");
        return res.redirect("/listings");
    }
    let originalImgUrl = listing.image.url;
    originalImgUrl = originalImgUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImgUrl });
};

module.exports.updateListing = async (req, res) => {
    let imageInfo = null;
    if (typeof req.file !== "undefined") {
        imageInfo = { url: req.file.path, filename: req.file.filename };
    }

    await ListingService.updateListing(req.params.id, req.body.listing, imageInfo);

    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyListing = async (req, res) => {
    await ListingService.deleteListing(req.params.id);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
};
