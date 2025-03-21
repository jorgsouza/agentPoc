import { saveInteraction, getInteractions } from './db/interactions/interactionService.js';

const history = [];

/**
 * Adiciona uma interação ao histórico.
 * @param {string} question - A pergunta feita pelo usuário.
 * @param {string} answer - A resposta gerada pelo Gemini.
 */
export async function addToHistory(user_id, question, answer) {
  history.push({ question, answer });
  await saveInteraction(user_id, question, answer);

  // 🔹 Mantém o histórico limitado às últimas 10 interações para evitar um prompt muito grande
  if (history.length > 10) {
    history.shift(); // Remove o mais antigo
  }
}

/**
 * Retorna o histórico formatado como um único texto para o contexto do Gemini.
 * @returns {string} - Histórico formatado.
 */
export async function getHistoryContext(user_id) {
  const interactions = await getInteractions(user_id);
  if (interactions.length === 0) return '';
  return interactions.map(entry => 
    `Question:\n${entry.message}\n\nResponse:\n${entry.response}`
  ).join('\n' + '━'.repeat(50) + '\n');
}

/**
 * Limpa o histórico de conversa.
 */
export function clearHistory() {
  history.length = 0;
}
