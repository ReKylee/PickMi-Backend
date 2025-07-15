import { configDotenv } from "dotenv";
configDotenv();

import mongoose from "mongoose";
import app from "./Shared/App.js";
import connectDB from "./Shared/Connect.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectDB();

    const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    // Function to handle shutdown
    const gracefulShutdown = async (signal: string) => {
        console.log(`\nReceived ${signal}. Closing server...`);

        server.close(async () => {
            console.log("Server closed.");

            await mongoose.disconnect();
            console.log("MongoDB connection closed.");

            process.exit(0);
        });
    };

    // Listen for termination signals
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
};

startServer();
