import { DomainError } from '../../infrastructure/errors/ErrorHandler.js';

export class AnalysisRepository {
  constructor(db) {
    this.db = db;
  }

  async saveAnalysis(analysis) {
    try {
      const record = {
        id: `${analysis.pullRequest.id}`,
        timestamp: new Date().toISOString(),
        type: 'pull_request',
        content: JSON.stringify(analysis),
        metadata: {
          project: analysis.pullRequest.project,
          author: analysis.pullRequest.author,
          status: analysis.pullRequest.state
        }
      };

      await this.db.collection('analyses').insertOne(record);
      return record.id;
    } catch (error) {
      throw new DomainError('Failed to save analysis', {
        analysisId: analysis.pullRequest.id,
        error: error.message
      });
    }
  }

  async getAnalysis(id) {
    try {
      const record = await this.db.collection('analyses').findOne({ id });
      return record ? JSON.parse(record.content) : null;
    } catch (error) {
      throw new DomainError('Failed to retrieve analysis', {
        analysisId: id,
        error: error.message
      });
    }
  }
}
