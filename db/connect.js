import mongoose from 'mongoose';

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
    });
    console.log(
        `Mongo database connected Done .. ${process.env.MONGO_URI}`
    );
};

export default connectDB;