export class Conversation {
  constructor(user, context = {}, history = [], createdAt = new Date()) {
    this.user = user;
    this.context = context;
    this.history = history;
    this.createdAt = createdAt;
  }

  addMessage(role, content) {
    this.history.push({ role, content });
  }

  getRecentHistory(limit) {
    return this.history.slice(-limit);
  }

  summarizeHistory(limit) {
    if (this.history.length > limit) {
      const summary = this.history.slice(0, this.history.length - limit).map(msg => msg.content).join(' ');
      this.history = [{ role: 'agent', content: `Resumo: ${summary}` }, ...this.getRecentHistory(limit)];
    }
  }

  isValid() {
    return this.user && Array.isArray(this.history);
  }

  static fromDatabase(record) {
    return new Conversation(record.user, record.context, record.history, record.createdAt);
  }

  toDatabase() {
    return {
      user: this.user,
      context: this.context,
      history: this.history,
      createdAt: this.createdAt,
    };
  }
}
