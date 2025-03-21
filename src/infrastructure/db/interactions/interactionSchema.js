import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  message: { type: String, required: true },
  response: { type: String, required: true }
});

export const Interaction = mongoose.model('Interaction', interactionSchema);
