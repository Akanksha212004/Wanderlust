const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");  // double dot (..) kyunki 'models' folder 'index.js' se ek level upar hai 

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Calling the main() function
main()
    .then(() => {
        console.log("Connected to DB");
    }).catch((err) => {
        console.log(err);
    });

// Connecting database
async function main() {
    await mongoose.connect(MONGO_URL);
};

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "68e0232857d709130b15bf68"}));
    const inserted = await Listing.insertMany(initData.data);
    console.log(`${inserted.length} listings inserted`);
    console.log("Data was initialized");
};

initDB();