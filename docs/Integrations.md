# External Integrations

## 1. Gemini AI
- **Purpose**: Generates embeddings and analyzes prompts.
- **Endpoints**:
  - `/v1beta/models/embedding-001:embedContent`
  - `/v1beta/models/gemini-2.0-flash:generateContent`

## 2. Pinecone
- **Purpose**: Stores and retrieves vector embeddings.
- **Endpoints**:
  - `/query`
  - `/upsert`

## 3. Jira
- **Purpose**: Fetches ticket details.
- **Endpoints**:
  - `/rest/api/3/issue/{ticketId}`

## 4. Confluence
- **Purpose**: Fetches and indexes documentation.
- **Endpoints**:
  - `/wiki/rest/api/content`

## 5. Bitbucket
- **Purpose**: Fetches pull request details.
- **Endpoints**:
  - `/repositories/{workspace}/{repo}/pullrequests/{prId}`
