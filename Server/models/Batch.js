import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema({
  name: String,         // e.g., "Batch A", "2024-B"
  year: Number,
});

export default mongoose.model('Batch', batchSchema);
