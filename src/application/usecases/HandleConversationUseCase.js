import { ConversationRepository } from '../../infrastructure/db/conversations/conversationRepository.js';
import { askAgent } from '../../config/agent.js';
import { Conversation } from '../../domain/entities/Conversation.js';

export class HandleConversationUseCase {
  constructor() {
    this.conversationRepository = new ConversationRepository();
    this.tokenLimit = 5; // Limite de turnos no histórico
  }

  async execute(user, question) {
    // Buscar conversa ativa
    let conversation = await this.conversationRepository.findActiveConversation(user);

    if (!conversation) {
      conversation = new Conversation(user);
    }

    if (!conversation.isValid()) {
      throw new Error("Invalid conversation data.");
    }

    // Adicionar pergunta ao histórico
    conversation.addMessage('user', question);
    conversation.summarizeHistory(this.tokenLimit);

    // Preparar histórico para envio
    const recentHistory = conversation.getRecentHistory(this.tokenLimit);
    const context = recentHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n');

    // Enviar para o Gemini
    const response = await askAgent(context);

    // Adicionar resposta ao histórico
    conversation.addMessage('agent', response);

    // Salvar conversa
    await this.conversationRepository.saveConversation(conversation);

    return response;
  }
}
