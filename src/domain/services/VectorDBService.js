export class VectorDBService {
  /**
   * Indexa documentos no banco vetorial.
   * @param {Array<{ id: string, values: number[], metadata: object }>} documents
   */
  async index(documents) {
    throw new Error("Método 'index' não implementado.");
  }

  /**
   * Busca documentos no banco vetorial.
   * @param {number[]} queryEmbedding - Embedding da consulta.
   * @param {number} topK - Número de resultados.
   * @returns {Promise<Array<{ id: string, metadata: object }>>}
   */
  async search(queryEmbedding, topK) {
    throw new Error("Método 'search' não implementado.");
  }
}
