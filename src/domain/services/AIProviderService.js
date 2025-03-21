export class AIProviderService {
  constructor(providers) {
    this.providers = providers; // Lista de provedores em ordem de prioridade
  }

  async generateEmbedding(text) {
    for (const provider of this.providers) {
      try {
        return await provider.generateEmbedding(text);
      } catch (error) {
        console.warn(`⚠️ Provider ${provider.name} failed: ${error.message}`);
      }
    }
    throw new Error('All AI providers failed to generate embedding.');
  }
}
