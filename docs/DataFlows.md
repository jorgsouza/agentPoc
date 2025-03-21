# Data Flows in AGENT-RAG

## 1. Code Analysis Flow
1. **User Input**: The user selects a file in the CLI.
2. **File Reading**: The `FileRepository` reads the file content.
3. **Prompt Generation**: A prompt is created with the file content.
4. **AI Analysis**: The prompt is sent to the `AIService` for analysis.
5. **Response**: The AI returns a detailed analysis, which is displayed to the user.

---

## 2. Documentation Search Flow
1. **User Query**: The user asks a question in the CLI.
2. **Embedding Generation**: The `EmbeddingService` generates an embedding for the query.
3. **Vector Search**: Pinecone is queried for relevant documents.
4. **Context Construction**: The retrieved documents are used to build a context.
5. **AI Response**: The context and query are sent to the `AIService`, which generates a response.

---

## 3. Jira Ticket Analysis Flow
1. **User Input**: The user provides a Jira ticket ID.
2. **Ticket Retrieval**: The `jiraService` fetches ticket details from Jira.
3. **Prompt Generation**: A prompt is created with the ticket details.
4. **AI Analysis**: The prompt is sent to the `AIService` for analysis.
5. **Response**: The AI returns a detailed explanation and action plan.

---

## 4. Pull Request Analysis Flow
1. **User Input**: The user provides a Bitbucket PR URL.
2. **PR Details Retrieval**: The `bitbucketService` fetches PR details.
3. **Prompt Generation**: A prompt is created with PR metadata and changes.
4. **AI Analysis**: The prompt is sent to the `AIService` for analysis.
5. **Response**: The AI returns a detailed review of the PR.

---

## 5. Deployment Check Flow
1. **User Command**: The user runs the `deploy` command in the CLI.
2. **API Request**: The `deployChecker` queries the `shouldideploy.today` API.
3. **Response**: The API response is displayed to the user, indicating whether it's safe to deploy.

---

## 6. AI Provider Fallback Flow
1. **Request**: A request for embeddings or analysis is sent to the `AIProviderService`.
2. **Fallback**:
   - Tries Gemini first.
   - If Gemini fails, switches to OpenAI.
   - If OpenAI fails, tries the Internal Server.
   - Finally, attempts Docker Local if all others fail.
3. **Response**: Returns the first successful result or throws an error if all providers fail.
