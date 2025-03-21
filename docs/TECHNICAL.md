# Technical Documentation 🔧

## Architecture Overview

### Core Components

1. **AI Service (`AIService.js`)**
   - **Responsibility**: Comunicação com provedores de IA.
   - **Fallback Mechanism**: Alterna entre provedores até obter uma resposta.

2. **File Analysis (`FileAnalysisService.js`)**
   - **Responsibility**: Análise de arquivos do projeto.

3. **Jira Integration (`jiraAnalyzer.js`)**
   - **Responsibility**: Busca e análise de tickets do Jira.

4. **Confluence Search (`confluenceSearch.js`)**
   - **Responsibility**: Busca semântica em documentos do Confluence.

5. **MongoDB Integration**
   - **Responsibility**: Armazena e recupera histórico de interações.

6. **Pull Request Analysis (`pullRequestAnalyzer.js`)**
   - **Responsibility**: Análise de Pull Requests no Bitbucket.

---

## Data Flow

### Code Analysis Flow
1. O usuário seleciona um arquivo no CLI.
2. O conteúdo do arquivo é lido pelo `FileRepository`.
3. Um prompt é gerado e enviado ao `AIService`.
4. O agente retorna uma análise detalhada.

### Documentation Search Flow
1. O usuário faz uma pergunta no CLI.
2. A pergunta é convertida em um embedding pelo `EmbeddingService`.
3. O Pinecone retorna documentos relevantes.
4. O contexto é enviado ao `AIService` para gerar uma resposta.

### PR Analysis Flow
1. O usuário insere a URL de um PR no CLI.
2. O `bitbucketService` busca detalhes do PR.
3. O `pullRequestAnalyzer` gera um prompt com base nas mudanças e metadados.
4. O `AIService` retorna uma análise detalhada.

### AI Provider Fallback
1. **Request**: The `AIProviderService` receives a request for embeddings or analysis.
2. **Fallback**: Tries Gemini, OpenAI, Internal Server, and Docker Local in sequence.
3. **Response**: Returns the first successful result or throws an error if all fail.

### MongoDB Integration
1. **Save Interaction**: User queries and AI responses are saved in MongoDB.
2. **Retrieve History**: The last 10 interactions are fetched and formatted for context.
3. **Contextual Responses**: The history is included in AI prompts for better answers.

---

## Implementation Details

### RAG Implementation
- **Gemini API**: Geração de embeddings.
- **Pinecone**: Armazenamento e busca de embeddings.
- **Prompt Engineering**: Injeção de contexto.

### Security Considerations
1. **API Keys**: Armazenadas no `.env`.
2. **Data Handling**: Análise local de arquivos.

### Performance Optimizations
1. **Caching**: Histórico limitado a 10 interações.
2. **Resource Management**: Processamento em lote.

---

## Function Documentation

### `askAgent` (AIService.js)
- **Descrição**: Envia uma consulta para a API Gemini e retorna a resposta.
- **Parâmetros**:
  - `query` (string): A pergunta ou comando do usuário.
- **Retorno**: Resposta gerada pela API.
- **Interações**:
  - Usa `conversationContext.js` para recuperar o histórico.
  - Envia o prompt para a API Gemini.

### `analyzeFile` (FileAnalysisService.js)
- **Descrição**: Analisa um arquivo selecionado pelo usuário.
- **Parâmetros**:
  - `files` (array): Lista de arquivos disponíveis.
  - `choice` (string): Escolha do usuário.
- **Retorno**: Análise gerada pelo agente.
- **Interações**:
  - Usa `FileRepository.js` para ler o conteúdo do arquivo.
  - Envia o conteúdo para `askAgent`.

### `searchConfluenceDocs` (confluenceSearch.js)
- **Descrição**: Realiza uma busca semântica em documentos do Confluence.
- **Parâmetros**:
  - `query` (string): Pergunta do usuário.
- **Retorno**: Resposta gerada pelo agente.
- **Interações**:
  - Usa `EmbeddingService.js` para gerar embeddings.
  - Consulta o Pinecone para recuperar documentos relevantes.

### `analyzeJiraTicket` (jiraAnalyzer.js)
- **Descrição**: Analisa um ticket do Jira e gera um plano de ação.
- **Parâmetros**:
  - `ticketId` (string): ID do ticket no formato `PROJ-123`.
- **Retorno**: Resposta gerada pelo agente.
- **Interações**:
  - Usa `jiraService.js` para buscar detalhes do ticket.
  - Envia os detalhes para `askAgent`.

### `analyzePullRequest` (pullRequestAnalyzer.js)
- **Descrição**: Analisa um Pull Request no Bitbucket.
- **Parâmetros**:
  - `project` (string): Nome do projeto.
  - `prId` (string): ID do Pull Request.
- **Retorno**: Relatório de análise.
- **Interações**:
  - Usa `bitbucketService.js` para buscar detalhes do PR.
  - Envia um prompt para `askAgent`.

### `verificarDeploy` (deployChecker.js)
- **Descrição**: Verifica se é seguro realizar deploy.
- **Parâmetros**: Nenhum.
- **Retorno**: Mensagem indicando se é seguro ou não.
- **Interações**:
  - Faz requisições à API `shouldideploy.today`.

---

## Development Guidelines

1. Crie arquivos relevantes em:
   ```
   src/
   ├── domain/      # Lógica de negócios
   ├── application/ # Casos de uso
   └── interface/   # CLI
   ```

2. Atualize `commandProcessor.js` para incluir novos comandos.
3. Adicione testes e documentação.
