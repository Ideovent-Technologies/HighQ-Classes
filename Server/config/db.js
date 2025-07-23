import mongoose from "mongoose";

const connectToDb = async () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        console.error("MONGO_URI is not defined in environment variables.");
        process.exit(1); // Exit the process if URI is missing
    }

    try {
        await mongoose.connect(mongoUri,
            //     {
            //     // useNewUrlParser: true,
            //     // useUnifiedTopology: true,
            //     // Uncomment if needed:
            //     // useCreateIndex: true,
            //     // useFindAndModify: false,
            // }
        );
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Failed to connect to the database:", error.message);
        process.exit(1); // Exit the process on connection failure
    }
};

export default connectToDb;
