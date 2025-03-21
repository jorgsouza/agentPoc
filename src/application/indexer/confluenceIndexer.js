import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
import axios from "axios";
import { getEmbedding } from "../../config/agent.js";
import { createVectorDBService } from "../../infrastructure/db/vectorDB/VectorDBFactory.js";

dotenv.config();

// Required environment variables
const CONFLUENCE_BASE_URL = process.env.CONFLUENCE_BASE_URL?.replace(/\/+$/, '').replace(/\/rest\/api$/, '');
const CONFLUENCE_SPACE_KEY = process.env.CONFLUENCE_SPACE_KEY;
const JIRA_USER = process.env.JIRA_USER;
const JIRA_TOKEN = process.env.JIRA_TOKEN;
const PINECONE_INDEX = process.env.PINECONE_INDEX;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;

// Validate required environment variables
function validateEnvVars() {
  const required = {
    CONFLUENCE_BASE_URL,
    CONFLUENCE_SPACE_KEY,
    JIRA_USER,
    JIRA_TOKEN,
    PINECONE_INDEX,
    PINECONE_API_KEY
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    process.exit(1);
  }
}

// Initialize Pinecone
const pinecone = new Pinecone({
  apiKey: PINECONE_API_KEY,
});

const index = pinecone.Index(PINECONE_INDEX);

/**
 * Obtém a lista de todas as páginas dentro de um espaço Confluence.
 * @returns {Promise<string[]>} Lista de IDs de páginas.
 */
async function fetchAllPages() {
  try {
    console.log("📄 Buscando lista de páginas do Confluence...");
    const searchUrl = `${CONFLUENCE_BASE_URL}/wiki/rest/api/content?spaceKey=${CONFLUENCE_SPACE_KEY}&expand=body.storage`;
    console.log(`🔍 Requesting URL: ${searchUrl}`);
    
    const response = await axios.get(searchUrl, {
      auth: {
        username: JIRA_USER,
        password: JIRA_TOKEN,
      },
      headers: {
        'Accept': 'application/json'
      }
    });

    const pages = response.data.results.map((page) => ({
      id: page.id,
      title: page.title,
    }));

    console.log(`✅ ${pages.length} páginas encontradas.`);
    return pages;
  } catch (error) {
    if (error.response?.status === 404) {
      console.error("❌ API endpoint not found. Please check your CONFLUENCE_BASE_URL configuration.");
      console.error(`Current URL: ${CONFLUENCE_BASE_URL}`);
    }
    console.error("❌ Erro ao buscar páginas:", error.response?.data || error.message);
    throw error;
  }
}

/**
 * Obtém o conteúdo de uma página do Confluence.
 * @param {string} pageId - ID da página do Confluence.
 * @returns {Promise<string>} Conteúdo limpo da página.
 */
async function fetchPageContent(pageId) {
  try {
    const contentUrl = `${CONFLUENCE_BASE_URL}/wiki/rest/api/content/${pageId}?expand=body.storage`;
    const response = await axios.get(contentUrl, {
      auth: {
        username: JIRA_USER,
        password: JIRA_TOKEN,
      }
    });

    let content = response.data.body.storage.value;
    content = content.replace(/<[^>]+>/g, ""); // Remove HTML para deixar o texto limpo

    return content;
  } catch (error) {
    console.error(`❌ Erro ao buscar página ${pageId}:`, error.response?.data || error.message);
    return null;
  }
}

/**
 * Indexa documentos do Confluence no Pinecone.
 */
const vectorDBService = createVectorDBService();

async function indexDocuments() {
  console.log("📥 Iniciando indexação de documentos do Confluence...");

  const pages = await fetchAllPages();
  if (pages.length === 0) {
    console.error("⚠️ Nenhuma página encontrada no Confluence.");
    return;
  }

  for (const page of pages) {
    console.log(`🔎 Buscando conteúdo da página: ${page.title} (${page.id})...`);
    const content = await fetchPageContent(page.id);

    if (!content) {
      console.log(`⚠️ Conteúdo não encontrado para ${page.title}`);
      continue;
    }

    console.log(`📊 Gerando embedding para ${page.title}...`);
    const embedding = await getEmbedding(content);

    console.log(`💾 Salvando no banco vetorial...`);
    await vectorDBService.index([
      {
        id: page.id,
        values: embedding,
        metadata: { title: page.title, text: content },
      },
    ]);

    console.log(`✅ Página ${page.title} indexada com sucesso!`);
  }
}

async function main() {
  try {
    validateEnvVars();
    const args = process.argv.slice(2);
    if (args.length === 2) {
      const [spaceKey, pageId] = args;
      await indexSinglePage(pageId, spaceKey);
    } else {
      await indexDocuments();
    }
    console.log('✅ Operação concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante a operação:', error.message);
    process.exit(1);
  }
}

main();

// Exporte a nova função para uso externo
export { indexDocuments };
