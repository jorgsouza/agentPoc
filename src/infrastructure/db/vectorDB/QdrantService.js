import { VectorDBService } from "../../../domain/services/VectorDBService.js";
import axios from "axios";

export class QdrantService extends VectorDBService {
  constructor(baseUrl) {
    super();
    this.baseUrl = baseUrl;
  }

  async index(documents) {
    await axios.post(`${this.baseUrl}/collections/documents/points`, {
      points: documents.map(doc => ({
        id: doc.id,
        vector: doc.values,
        payload: doc.metadata,
      })),
    });
  }

  async search(queryEmbedding, topK) {
    const response = await axios.post(`${this.baseUrl}/collections/documents/points/search`, {
      vector: queryEmbedding,
      top: topK,
    });
    return response.data.result.map(result => ({
      id: result.id,
      metadata: result.payload,
    }));
  }
}
