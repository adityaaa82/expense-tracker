import mongoose from "mongoose";

export const dbConnect = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        if (!connect) {
            console.log("Failed to Connect Database.");
        } else {
            console.log("Connected to Database.");
        }
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}