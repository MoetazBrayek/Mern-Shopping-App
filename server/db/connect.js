const mongoose = require("mongoose");

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
    });
    console.log(
        `Mongo database connected Done .. ${process.env.MONGO_URI}`.cyan.underline.bold
    );
};

module.exports = connectDB;
