const express = require("express"); 
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const listingControllers = require("../controllers/listing.js");
const multer  = require('multer')
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });

// Index Route
router.route("/")
.get( wrapAsync(listingControllers.index))
.post(isLoggedIn,upload.single('listing[image]'), validateListing,wrapAsync(listingControllers.createListing));// Create Route

// New Route
router.get("/new", isLoggedIn, wrapAsync(listingControllers.renderNewForm));

// Show Route
router.route("/:id")
.get(wrapAsync(listingControllers.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(listingControllers.updateListing))// Update Route
.delete(isLoggedIn,isOwner,wrapAsync(listingControllers.destroyListing));// Delete Route

// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingControllers.renderEditForm));


module.exports = router;