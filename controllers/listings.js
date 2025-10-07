const Listing = require("../models/listing");



// Index Route
module.exports.index = async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};


// New Route
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


// Show Route
module.exports.showListing = async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
                    .populate({
                        path: "reviews",
                        populate: {
                            path: "author",
                        }
                    })
                    .populate("owner");

    // flash a 'error'(failure) message
    if(!listing){
        req.flash("error", "The listing you requested for does not exist...");
        return res.redirect("/listings");
    };

    console.log(listing);

    res.render("listings/show.ejs", {listing});
};


// Create Route
module.exports.createListing = async(req, res, next) => {
    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send valid data for listing");
    // }


    // Using Joi ( instead of 'if' conditions )
    // let result = listingSchema.validate(req.body);
    // console.log(result);

    // if(result.error){
    //     throw new ExpressError(400, result.error);
    // }
    
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url, "   ..   ", filename);

    const newListing = new Listing(req.body.listing);

    // if(!newListing.title){
    //     throw new ExpressError(400, "Title is missing!");
    // }
    // if(!newListing.description){
    //     throw new ExpressError(400, "Description is missing!");
    // }
    // if(!newListing.location){
    //     throw new ExpressError(400, "Location is missing!");
    // }


    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();

    // Using flash
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};


// Edit Route
module.exports.renderEditForm = async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);

    // flash a 'error'(failure) message
    if(!listing){
        req.flash("error", "Listing you requested to update does not exist...");
        return res.redirect("/listings");
        return res.redirect("/listings");
    };

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

    res.render("listings/edit.ejs", { listing, originalImageUrl });
};


// Update Route
module.exports.updateListing = async(req, res) => {
    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send valid data for listing");
    // }

    let { id } = req.params;
    // let listing = await Listing.findById(id);
    // if(!listing.owner._id.equals(res.locals.currUser._id)) {
    //     req.flash("error", "You don't have permission to edit");
    //     return res.redirect(`/listings/${id}`);
    // }

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    
    req.flash("success", "Listing Updated!");

    res.redirect(`/listings/${id}`);
};


// Delete Route
module.exports.destroyListing = async(req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};