const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');
const User = require('../models/user.js');

MONGOURL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("Connected to wanderlustDB");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGOURL);
}


const initDB = async()=>{
    await Listing.deleteMany({});
    //This line adds owner to the listing data objects, since the listing schema requires an owner field which is a reference to the user collection. The owner field is set to a fixed user id for all listings in the initData.
    initData.data = initData.data.map((obj)=>({...obj,owner:"69f485f10f8b8976dad5da99"}));
    await Listing.insertMany(initData.data);
    console.log("Database initialized with initData 30");
}

initDB();