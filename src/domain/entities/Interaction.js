import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  message: { type: String, required: true },
  response: { type: String, required: true }
});

const InteractionModel = mongoose.model('Interaction', interactionSchema);

export class Interaction {
  constructor(userId, message, response, timestamp = new Date()) {
    this.userId = userId;
    this.message = message;
    this.response = response || "No response provided.";
    this.timestamp = timestamp;
  }

  static fromDatabase(record) {
    return new Interaction(record.user_id, record.message, record.response, record.timestamp);
  }

  toDatabase() {
    return {
      user_id: this.userId,
      message: this.message,
      response: this.response,
      timestamp: this.timestamp,
    };
  }

  static async save(userId, message, response) {
    const interaction = new Interaction(userId, message, response);
    const InteractionModel = this.getModel();
    await new InteractionModel(interaction.toDatabase()).save();
  }

  static async getRecentInteractions(userId, limit = 10) {
    const InteractionModel = this.getModel();
    const records = await InteractionModel.find({ user_id: userId }).sort({ timestamp: -1 }).limit(limit);
    return records.map(this.fromDatabase);
  }

  static getModel() {
    return InteractionModel;
  }
}
