# Configuration Guide

## 1. Environment Variables

Crie um arquivo `.env` com o seguinte conteúdo:

```ini
# Gemini AI
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash

# Pinecone
PINECONE_API_KEY=your_pinecone_key
PINECONE_INDEX=your_index_name
PINECONE_ENVIRONMENT=your_environment

# Jira
JIRA_USER=your_email@company.com
JIRA_TOKEN=your_api_token
JIRA_BASE_URL=https://your-domain.atlassian.net

# Confluence
CONFLUENCE_BASE_URL=https://your-domain.atlassian.net/wiki/rest/api
CONFLUENCE_PAGE_IDS=comma,separated,page,ids

# Bitbucket
BITBUCKET_USER=your_username
BITBUCKET_TOKEN=your_access_token
```

---

## 2. Configuring External Services

### AI Provider Fallback
- **Purpose**: Alta disponibilidade alternando entre provedores.
- **Setup**: Configure Gemini, OpenAI e outros no `.env`.

### Pinecone
- **Purpose**: Armazenamento e busca de embeddings.
- **Setup**:
  1. Crie um índice no Pinecone.
  2. Adicione a chave de API e o nome do índice no `.env`.

### Jira
- **Purpose**: Busca de tickets.
- **Setup**:
  1. Gere um token de API no Jira.
  2. Adicione o token e o e-mail ao `.env`.

### Confluence
- **Purpose**: Busca de documentos.
- **Setup**:
  1. Obtenha credenciais de API.
  2. Adicione a URL base e IDs de páginas ao `.env`.

### Bitbucket
- **Purpose**: Análise de Pull Requests.
- **Setup**:
  1. Gere um token de acesso no Bitbucket.
  2. Adicione o token ao `.env`.
