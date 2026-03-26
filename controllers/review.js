const ReviewService = require("../services/review.js");

module.exports.createReview = async (req, res) => {
    await ReviewService.createReview(req.params.id, req.body.review, req.user._id);
    req.flash("success", "Review Added Successfully!");
    res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await ReviewService.deleteReview(id, reviewId);
    req.flash("success", "Review Deleted Successfully!");
    res.redirect(`/listings/${id}`);
};
