const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const userControllers = require("../controllers/user.js");

// Rate limiter for auth routes: max 15 attempts per 15-minute window per IP
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15,                   // limit each IP to 15 requests per window
    message: "Too many attempts, please try again after 15 minutes.",
    standardHeaders: true,     // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false,      // Disable `X-RateLimit-*` headers
});

router.route("/signup")
    .get(userControllers.renderSignupForm)
    .post(authLimiter, wrapAsync(userControllers.userSignup));


router.route("/login")
    .get(userControllers.renderLoginForm)
    .post(
        authLimiter,
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true
        }),
        userControllers.userLogin
    );

router.get("/logout", userControllers.userLogout);

module.exports = router;