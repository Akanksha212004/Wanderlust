const Listing = require("../models/listing");
const Review = require("../models/review");



module.exports.createReview = async (req, res) => {
    // console.log(req.params.id);

    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    // Har review ka ek author bhi hona chahiye
    newReview.author = req.user._id;
    // console.log(newReview);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    // console.log("New review saved");
    // res.send("New review saved");

    req.flash("success", "New Review Created!");

    res.redirect(`/listings/${listing._id}`);
};


module.exports.destroyReview = async (req, res) => {
    let {id, reviewId} = req.params;

    //To update the 'review' array after removing the deleted reviews from the 'review' array
    await Listing.findByIdAndUpdate(id, {$pull : {reviews: reviewId}});

    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");

    res.redirect(`/listings/${id}`);
};