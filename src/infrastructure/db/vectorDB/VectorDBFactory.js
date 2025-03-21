import { PineconeService } from "./PineconeService.js";
import { QdrantService } from "./QdrantService.js";

export function createVectorDBService() {
  const provider = process.env.VECTOR_DB_PROVIDER;

  if (provider === "pinecone") {
    return new PineconeService(process.env.PINECONE_API_KEY, process.env.PINECONE_INDEX);
  } else if (provider === "qdrant") {
    return new QdrantService(process.env.QDRANT_BASE_URL);
  } else {
    throw new Error(`Unsupported VECTOR_DB_PROVIDER: ${provider}`);
  }
}
