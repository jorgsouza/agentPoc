import { VectorDBService } from "../../../domain/services/VectorDBService.js";
import { Pinecone } from "@pinecone-database/pinecone";

export class PineconeService extends VectorDBService {
  constructor(apiKey, indexName) {
    super();
    this.pinecone = new Pinecone({ apiKey });
    this.index = this.pinecone.Index(indexName);
  }

  async index(documents) {
    await this.index.upsert(documents);
  }

  async search(queryEmbedding, topK) {
    const response = await this.index.query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
    });
    return response.matches.map(match => ({
      id: match.id,
      metadata: match.metadata,
    }));
  }
}
