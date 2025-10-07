const express = require("express");
const router = express.Router();    //express.Router() is a mini Express application that helps you group route handlers for a specific part of your app. Think of it like a sub-app inside your main app.
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");  // single dot (.) kyunki 'app.js' aur 'models' same level pe hain
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require('multer');   // Form ke data(files) ko parse karne ke liye ham 'multer' ka use karenge

const {storage} = require("../cloudConfig.js");
// const upload = multer({dest: 'uploads/'});   // Aur 'multer' form ke data se 'files' ko nikaalega aur unhe automatically ek 'uploads' naam ke folder mein store kar dega: Local Storage
const upload = multer({ storage });   // Storage on Cloud ('multer' hamaari files ko 'cloudinary' ke storage mein jaake save karwayega)






// Using 'router.route(path)' for 'Index' and 'Create' route because they direct to same route (root route: "/")
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,
        validateListing,
        upload.single('listing[image]'),
        wrapAsync(listingController.createListing)
    );

    // .post((req, res) => {
    //     res.send(req.file);
    // });


// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);




// Using 'router.route(path)' for 'Show', 'Update' and 'Delete' route because they direct to same route (root route: "/:id")
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,
        isOwner,    // A middleware to check whether the user is the owner of the listing or not
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(isLoggedIn, 
        isOwner, 
        wrapAsync(listingController.destroyListing)
    );




// // Index Route
// router.get("/", wrapAsync(listingController.index));



// // Show Route
// router.get("/:id", wrapAsync(listingController.showListing));


// // Create Route
// router.post("/",
//     isLoggedIn,
//     validateListing,
//     wrapAsync(listingController.createListing)
// );


// Edit Route
router.get("/:id/edit", 
    isLoggedIn, 
    isOwner, 
    wrapAsync(listingController.renderEditForm)
);


// // Update Route
// router.put("/:id",
//     isLoggedIn,
//     isOwner,    // A middleware to check whether the user is the owner of the listing or not
//     validateListing,
//     wrapAsync(listingController.updateListing)
// );


// // Delete Route
// router.delete("/:id", 
//     isLoggedIn, 
//     isOwner, 
//     wrapAsync(listingController.destroyListing)
// );



module.exports = router;