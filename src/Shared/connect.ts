import mongoose, { ConnectOptions } from "mongoose";

const clientOptions: ConnectOptions = {
    serverApi: { version: "1", strict: true, deprecationErrors: true },
};

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI || "invalid";

    // Mongoose will automatically try to reconnect.
    // We just need to listen for events.
    mongoose.connection.on("connecting", () => {
        console.log("Connecting to MongoDB...");
    });

    mongoose.connection.on("connected", () => {
        console.log("MongoDB connected successfully.");
    });

    mongoose.connection.on("error", (err) => {
        // Mongoose will automatically try to reconnect, so we don't exit here.
        console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
        console.log("MongoDB disconnected. Attempting to reconnect...");
    });

    try {
        await mongoose.connect(mongoUri, clientOptions);
    } catch (error) {
        console.error("Initial MongoDB connection failed. Exiting.", error);
        process.exit(1);
    }
};

export default connectDB;
