import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    duration: {
      type: String,
      required: true, // e.g., '3 months', '12 weeks'
    },
    fee: {
      type: Number,
      required: true,
      min: 0,
    },
    // 🔄 Future Option:
    // relatedBatches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }]
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
