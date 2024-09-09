const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require('./schema.js');
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // Save the requested URL in session
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in.");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    // If redirect URL exists in session, pass it to res.locals for usage in templates
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${req.params.id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review.");
        return res.redirect(`/listings/${req.params.id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};