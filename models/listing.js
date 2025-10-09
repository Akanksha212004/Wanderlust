const mongoose = require("mongoose");
const Schema = mongoose.Schema;  // using 'Schema' variable to get rid of continuous usage of 'mongoose.Schema'
const Review = require("./review.js");
const { required } = require("joi");


const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        // type: String,

        // // 'default' = (image hai hi nhi... exist hi nhi karti) Runs only when the field is undefined or missing while creating a document. It sets an initial value for the field if you didn’t provide one.
        // default: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",

        // // 'set' = (image hai toh but uska url empty hai) Runs every time you assign a value to the field (even if it’s empty string, null, etc.). Lets you transform or validate the value before saving.
        // set: (v) => 
        //     v === "" 
        //         ? "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
        //         : v,

        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
    category: {
        type: String,
        enum: [
            "Trending",
            "Rooms",
            "Iconic cities",
            "Mountains",
            "Castles",
            "Amazing Pools",
            "Camping",
            "Farms",
            "Arctic",
            "Domes",
            "Boats"
        ],
        required: true,
    },
});


// Creating a 'post' mongoose middleware to ensure the related reviews get deleted on deleting the listings
listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
    await Review.deleteMany({ _id: { $in: listing.reviews } });
}
});



// Creating a model using above schema
const Listing = mongoose.model("Listing", listingSchema);
// "इस फाइल से Listing model को export करो ताकि दूसरी फाइलें इसे require करके use कर सकें।"
module.exports = Listing;

