# 📖 AGENT-RAG - User Manual

Welcome to **AGENT-RAG**, a powerful tool for analyzing files, Jira tickets, and Confluence documentation using artificial intelligence and RAG (Retrieval-Augmented Generation) with Pinecone.

## ⚙️ Installation and Configuration

Before starting, make sure to:
1. Have **Node.js** installed.
2. Create a **`.env`** file with the necessary credentials:
   ```ini
   # Jira
   JIRA_USER=your_email@company.com
   JIRA_TOKEN=your_api_token
   
   # Pinecone
   PINECONE_API_KEY=your_pinecone_key
   PINECONE_INDEX=your_pinecone_index
   
   # Confluence
   CONFLUENCE_BASE_URL=https://reclameaqui.atlassian.net/wiki/rest/api
   CONFLUENCE_PAGE_IDS=2772435196,2804285460
   ```

---

## 🚀 Available Commands

The tool works via **command line interface** (CLI). To start, run:
```bash
node src/interface/cli.js
```
Upon starting, the tool will prompt for an action. See the available options:

### 🔍 **1. Analyze Files**
This command allows you to choose a project file for analysis.
```bash
📝 Command: analyze
```
- Displays a list of available files.
- After selecting a file, its content will be sent to the AI, which will explain the code and suggest improvements.

### 🎫 **2. Analyze Jira Tickets**
To search and understand a Jira ticket:
```bash
📝 Command: jira
🔗 Enter the Jira ticket number (e.g., 23842):
```
- The system will fetch ticket details and ask the AI to explain what needs to be done.

### 📚 **3. Search Confluence Documentation**
To query embedded documentation in the Pinecone vector database:
```bash
📝 Command: confluence
🔎 Enter your question about the documentation: How does the backend deployment flow work?
```
- The system queries the indexed documents and returns the best answer.

---

## 📥 **Document Indexing**
Before querying the documentation, Confluence documents need to be indexed.
To do this, run:
```bash
npm run index-confluence
```
Or with **yarn**:
```bash
yarn index-confluence
```
This will fetch all pages defined in the `.env` and save their embeddings in **Pinecone**.

---

## ❓ **Questions and Help**
If you have questions or need support, check the application logs or update the page IDs in the `.env` if any document is not found.

🚀 **Enjoy AGENT-RAG to optimize your productivity!**

