const express = require("express"); 
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const router = express.Router();
const userControllers = require("../controllers/user.js");

router.route("/signup")
.get(userControllers.renderSignupForm)
.post(wrapAsync(userControllers.userSignup));


router.route("/login")
.get(userControllers.renderLoginForm)
.post(
    saveRedirectUrl, 
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
   userControllers.userLogin
);

router.get("/logout", userControllers.userLogout);

module.exports = router;