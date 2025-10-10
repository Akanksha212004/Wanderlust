if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

// console.log(process.env);
// console.log(process.env.SECRET);



const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");  // single dot (.) kyunki 'app.js' aur 'models' same level pe hain
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema, reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");  // single dot (.) kyunki 'app.js' aur 'models' same level pe hain
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Loads the router you exported from listing.js
const listingRouter = require("./routes/listing.js");

const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


// Connecting with MongoDB
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;


// Calling the main() function
main()
    .then(() => {
        console.log("Connected to DB");
    }).catch((err) => {
        console.log(err);
    });

// Connecting database
async function main() {
    // await mongoose.connect(MONGO_URL);
    await mongoose.connect(dbUrl);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


// Using connect-mongo as a session store
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600
});

//Handling the error
store.on("error", () => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});


// Using Sessions
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
};





app.use(session(sessionOptions));
//Using flash (#NOTE: Always use 'flash' before your routes)
app.use(flash());

//Implementing passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Creating a middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.search = "";    // ✅ initialize 'search' for navbar.ejs
    next();
});


// Root Route
app.get("/", (req, res) => {
    res.redirect("/listings");
});



// Creating a Demo User (to see how Passport actually works)
// app.get("/demouser", async(req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "college-student",    // Hamne bhale hi userSchema mein username ki field nhi banayi hai but still we can give a value to username kyunki Passport-Local Mongoose automatically username ki field create kar deta hai
//     });

//     let registeredUser = await User.register(fakeUser, "helloWorld");
//     res.send(registeredUser);
// });


app.use("/listings", listingRouter);   // For all routes that start with /listings, use this router.

app.use("/listings/:id/reviews", reviewRouter);   // For all routes that start with /listings/:id/reviews, use this router.

app.use("/", userRouter);



// // Test Listing
// app.get("/testListing", async(req, res) => {
//     let sampleListing = new listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Goa",
//         country: "India"
//     });

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successful testing");
// });


// Creating a Standard Error jo ki tab run hoga jab user kisi aise page ki or direct karega jo ki exist hi nhi karta
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});


// Global Error Handler
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong!"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", { message }); 
});



app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});
