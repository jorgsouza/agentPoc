import { ConversationModel } from './conversationSchema.js';
import { Conversation } from '../../../domain/entities/Conversation.js';

export class ConversationRepository {
  async findActiveConversation(user) {
    const record = await ConversationModel.findOne({ user }).sort({ createdAt: -1 });
    return record ? Conversation.fromDatabase(record) : null;
  }

  async saveConversation(conversation) {
    const data = conversation.toDatabase();
    await ConversationModel.updateOne(
      { user: data.user },
      data,
      { upsert: true }
    );
  }

  async findConversationsByCriteria(criteria) {
    return await ConversationModel.find(criteria).sort({ createdAt: -1 });
  }

  async deleteOldConversations(days) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    await ConversationModel.deleteMany({ createdAt: { $lt: cutoffDate } });
  }
}
