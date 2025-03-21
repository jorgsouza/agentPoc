import { indexSinglePage } from './indexer/confluenceIndexer.js';

const args = process.argv.slice(2); // Captura os argumentos da linha de comando
const [spaceKey, pageId] = args;

if (!spaceKey || !pageId) {
  console.error('❌ Por favor, forneça a chave do espaço e o ID da página como argumentos.');
  console.error('Exemplo de uso: node src/application/indexSinglePageExample.js <spaceKey> <pageId>');
  process.exit(1);
}

(async () => {
  try {
    await indexSinglePage(pageId, spaceKey);
    console.log('✅ Página indexada com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao indexar a página:', error.message);
  }
})();
