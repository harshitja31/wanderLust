if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
};
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const helmet = require("helmet");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Security: Helmet with customised Content-Security-Policy
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://cdnjs.cloudflare.com",
                    "https://cdn.jsdelivr.net",
                    "https://api.mapbox.com",
                ],
                styleSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://cdnjs.cloudflare.com",
                    "https://cdn.jsdelivr.net",
                    "https://api.mapbox.com",
                    "https://fonts.googleapis.com",
                ],
                imgSrc: [
                    "'self'",
                    "data:",
                    "blob:",
                    "https://images.unsplash.com",
                    "https://plus.unsplash.com",
                    "https://res.cloudinary.com",
                ],
                fontSrc: [
                    "'self'",
                    "https://cdnjs.cloudflare.com",
                    "https://fonts.gstatic.com",
                ],
                connectSrc: [
                    "'self'",
                    "https://api.mapbox.com",
                    "https://events.mapbox.com",
                ],
                workerSrc: ["'self'", "blob:"],
            },
        },
    })
);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));

const dbURL = process.env.ATLAS_DB;
// const MONGO_URL = "mongodb://localhost:27017/wanderLust";

const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
});


store.on("error", (err) => {
    console.log("Error in Mongo Session Store", err);
});


const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    }
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



main().then(() => {
    console.log("Connection Successful");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbURL);
};


// Middleware to handle flash messages
app.use((req, res, next) => {
    res.locals.successMsg = req.flash('success');
    res.locals.errorMsg = req.flash('error');
    res.locals.currUser = req.user;
    next();
});

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


// 404 Error Handler
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const { status = 500, message = "Something Went Wrong!" } = err;
    console.error(err); // Logs the full error
    res.status(status).render("error.ejs", { message });
});

app.listen(8080, () => {
    console.log(`Server is listening on port 8080`);
});
