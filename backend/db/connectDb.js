import { mongoose } from "mongoose";

export const connectDb = async() => {
    try {
        console.log(`Please wait... Connecting to Database..`);
        const connection = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDb Connected: ${connection.connection.host}`);
    } catch (error) {
        console.log('Error connecting MongoDb : ', error.message);
        process.exit(1)
    }
}