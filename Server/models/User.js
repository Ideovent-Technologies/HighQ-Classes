import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        mobile: {
            type: String,
            trim: true,
        },

        role: {
            type: String,
            enum: ["admin", "teacher", "student"],
            default: "student",
        },

        profilePicture: {
            type: String, // URL
            default: "",  // Can be empty if not set
        },
    },
    {
        timestamps: true, // adds createdAt and updatedAt automatically
    }
);

const User = mongoose.model("User", userSchema);
export default User;
