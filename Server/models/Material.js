import mongoose from "mongoose";
const { Schema } = mongoose;

const materialSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    originalFileName: {
      type: String,
      required: true,
    },

    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    batchIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Batch",
      },
    ],
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    //  NEW FIELD: Track who has viewed the material
    viewedBy: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "Student", // or 'User' if mixed roles
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // createdAt and updatedAt
  }
);

const Material = mongoose.model("Material", materialSchema);
export default Material;
