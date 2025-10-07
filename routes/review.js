const express = require("express");
const router = express.Router({mergeParams: true});    //express.Router() is a mini Express application that helps you group route handlers for a specific part of your app. Think of it like a sub-app inside your main app.
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");  // single dot (.) kyunki 'app.js' aur 'models' same level pe hain
const Listing = require("../models/listing.js");  // Kyunki ham reviews ko listings ke andar add karte hain
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")

const reviewController = require("../controllers/reviews.js");




// Post Review Route (to create Reviews)
router.post("/", 
    isLoggedIn, 
    validateReview, 
    wrapAsync(reviewController.createReview));


// Delete Review Route (to delete a Review)
router.delete("/:reviewId", 
    isLoggedIn, 
    isReviewAuthor, 
    wrapAsync(reviewController.destroyReview));



module.exports = router;