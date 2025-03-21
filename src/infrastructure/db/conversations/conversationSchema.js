import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  user: { type: String, required: true },
  context: { type: Object, default: {} },
  history: [
    {
      role: { type: String, enum: ['user', 'agent'], required: true },
      content: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export const ConversationModel = mongoose.model('Conversation', conversationSchema);
