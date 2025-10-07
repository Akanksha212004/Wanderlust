const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema({
    // Sirf 'email' isliye kyunki Passport-Local Mongoose automatically(by default) username, 'hashed password' aur 'salt value' add kar deta hai
    email: {
        type: String,
        required: true
    },
});


userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);