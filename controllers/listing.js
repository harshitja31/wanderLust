const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = async (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested doesn't exist.");
        return res.redirect("/listings");  // Add return here to stop further execution
    }

    res.render("listings/show.ejs", { listing });
};


module.exports.createListing = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename};
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash("success","New Listing Added Successfully!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing you requested doesn't exist.");
        return res.redirect("/listings");
    };
    let originalImgUrl = listing.image.url;
    originalImgUrl = originalImgUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", { listing ,originalImgUrl});
};


module.exports.updateListing = async (req, res) => {
   let listing =  await Listing.findByIdAndUpdate(req.params.id, req.body.listing);

   if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save(); 
};
 // Always save after updating the listing
    req.flash("success","Listing Updated Successfully!");
    res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyListing = async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success","Listing Deleted Successfully!");
    res.redirect("/listings");
};