import mongoose from "mongoose";

const recordingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Recording title is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        fileUrl: {
            type: String,
            required: [true, "Recording URL is required"],
        },
        fileId: {
            type: String,
            required: [true, "Cloudinary file ID is required"],
        },
        thumbnailUrl: {
            type: String,
        },
        duration: {
            type: Number, // Duration in seconds
        },
        subject: {
            type: String,
            required: [true, "Subject is required"],
        },
        batch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Batch",
            required: [true, "Batch is required"],
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Course is required"],
        },
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
        },
        accessExpires: {
            type: Date,
            required: [true, "Access expiration date is required"],
        },
        views: {
            type: Number,
            default: 0,
        },
        viewedBy: [
            {
                student: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Student",
                },
                viewCount: {
                    type: Number,
                    default: 1,
                },
                lastViewed: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Create index for efficient querying
recordingSchema.index({ batch: 1, subject: 1, createdAt: -1 });
recordingSchema.index({ accessExpires: 1 }); // Index for checking expired recordings

// Method to check if access has expired
recordingSchema.methods.isAccessible = function () {
    return new Date() < this.accessExpires;
};

// Static method to find accessible recordings for a batch
recordingSchema.statics.findAccessibleForBatch = function (batchId) {
    return this.find({
        batch: batchId,
        accessExpires: { $gt: new Date() },
        isActive: true,
    }).sort({ createdAt: -1 });
};

// Pre-save hook to set access expiration date if not provided
recordingSchema.pre("save", function (next) {
    if (!this.accessExpires) {
        // Set default expiration to 3 days from now
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 3);
        this.accessExpires = expireDate;
    }
    next();
});

const Recording = mongoose.model("Recording", recordingSchema);

export default Recording;
