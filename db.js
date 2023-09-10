const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://zad:DpiLg8WGP82gxlpo@cluster0.ylosiqb.mongodb.net/";

const connectDB = ()=>{
    mongoose.connect(mongoURI);
    console.log("connected to mongodb");
}

module.exports = connectDB;

// DpiLg8WGP82gxlpo   zad 