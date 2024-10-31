const mongoose = require("mongoose");
const mongodb=async ()=>{
    await mongoose.connect("mongodb+srv://mayankkesharwani422:E6HE6e5P5WvIYZKR@shobha.dkyko.mongodb.net/ShobhaPro")
    console.log("db Connected")
}
module.exports = mongodb;
