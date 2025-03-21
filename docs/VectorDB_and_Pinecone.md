# VectorDB e Pinecone no AGENT-RAG

## O que é um VectorDB?

Um **VectorDB** (banco de dados vetorial) é uma tecnologia projetada para armazenar e consultar vetores de alta dimensão. Esses vetores geralmente representam embeddings, que são representações numéricas de dados como textos, imagens ou outros tipos de informações. Os embeddings capturam características semânticas dos dados, permitindo buscas mais inteligentes e relevantes.

## O que é o Pinecone?

O **Pinecone** é um serviço de VectorDB que facilita o armazenamento, busca e gerenciamento de embeddings. Ele é otimizado para tarefas como:
- **Busca semântica**: Encontrar documentos ou informações relevantes com base em similaridade semântica.
- **Recomendação de conteúdo**: Sugerir itens relacionados com base em embeddings.
- **RAG (Retrieval-Augmented Generation)**: Recuperar informações relevantes para enriquecer respostas geradas por IA.

## Como o Pinecone é usado no AGENT-RAG?

### 1. **Indexação de Documentos**
O processo de indexação transforma documentos em embeddings e os armazena no Pinecone. No AGENT-RAG, isso é feito para documentos do Confluence.

#### Fluxo de Indexação:
1. **Busca de documentos**:
   - O sistema busca páginas do Confluence usando a API.
2. **Geração de embeddings**:
   - O conteúdo das páginas é processado pelo modelo Gemini para gerar embeddings.
3. **Armazenamento no Pinecone**:
   - Os embeddings são enviados ao Pinecone junto com metadados (como título e texto do documento).

#### Arquivo relacionado:
- `/src/application/indexer/confluenceIndexer.js`

### 2. **Busca Semântica**
Quando o usuário faz uma pergunta, o sistema utiliza o Pinecone para encontrar documentos relevantes.

#### Fluxo de Busca:
1. **Geração de embedding da pergunta**:
   - A pergunta do usuário é convertida em um embedding.
2. **Consulta ao Pinecone**:
   - O Pinecone retorna os documentos mais próximos no espaço vetorial.
3. **Construção do contexto**:
   - Os documentos encontrados são usados para criar um contexto que é enviado ao modelo de IA.
4. **Resposta gerada**:
   - O modelo de IA utiliza o contexto para responder à pergunta do usuário.

#### Arquivo relacionado:
- `/src/application/confluence/confluenceSearch.js`

---

## Funcionamento da Aplicação com Pinecone

### Visão Geral
O Pinecone é usado no AGENT-RAG para armazenar e recuperar embeddings que representam documentos do Confluence. Isso permite que a aplicação forneça respostas relevantes e contextualizadas ao usuário.

### Objetivo
- **Armazenar Embeddings**: Salvar representações vetoriais de documentos no Pinecone.
- **Recuperar Documentos Relevantes**: Buscar documentos mais próximos semanticamente com base na pergunta do usuário.
- **Enriquecer Respostas**: Fornecer contexto adicional ao modelo de IA para melhorar a qualidade das respostas.

### Componentes Envolvidos

#### 1. **Indexação de Documentos**
- **Arquivo**: `/src/application/indexer/confluenceIndexer.js`
- **Descrição**: Este componente busca documentos do Confluence, gera embeddings e os armazena no Pinecone.

#### 2. **Busca de Documentos**
- **Arquivo**: `/src/application/confluence/confluenceSearch.js`
- **Descrição**: Este componente consulta o Pinecone para encontrar documentos relevantes com base na pergunta do usuário.

#### 3. **Geração de Embeddings**
- **Arquivo**: `/src/domain/services/EmbeddingService.js`
- **Descrição**: Este serviço utiliza o modelo Gemini para gerar embeddings de textos.

---

### Fluxo de Funcionamento

1. **Indexação de Documentos**
   - O sistema conecta-se ao Confluence e busca páginas configuradas.
   - O conteúdo das páginas é processado para gerar embeddings.
   - Os embeddings são armazenados no Pinecone junto com metadados.

2. **Busca Semântica**
   - O usuário faz uma pergunta no CLI.
   - A pergunta é convertida em um embedding.
   - O Pinecone é consultado para encontrar os documentos mais relevantes.
   - Os documentos encontrados são usados para criar um contexto que é enviado ao modelo de IA.

3. **Resposta Contextualizada**
   - O modelo de IA utiliza o contexto fornecido pelos documentos para gerar uma resposta mais precisa e relevante.

---

### Configuração Necessária

#### Variáveis de Ambiente
Certifique-se de configurar as seguintes variáveis no arquivo `.env`:
```ini
# Pinecone
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=your_index_name
PINECONE_ENVIRONMENT=your_environment
```

#### Dependências
O projeto utiliza o pacote oficial do Pinecone:
```bash
npm install @pinecone-database/pinecone
```

---

### Benefícios

- **Busca Semântica Avançada**:
  - Permite encontrar documentos relevantes mesmo que as palavras exatas não coincidam.
- **Escalabilidade**:
  - Gerencia grandes volumes de dados e consultas de forma eficiente.
- **Respostas Contextualizadas**:
  - Melhora a qualidade das respostas ao fornecer informações relevantes ao modelo de IA.

---

O uso do Pinecone no AGENT-RAG é essencial para fornecer respostas precisas e relevantes, aproveitando o poder da busca semântica e da geração de respostas contextualizadas.
