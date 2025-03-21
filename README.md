# AGENT-RAG 🤖

**AGENT-RAG** é uma ferramenta poderosa baseada em inteligência artificial para análise de arquivos, tickets do Jira, documentação do Confluence e revisões de Pull Requests, utilizando o conceito de RAG (Retrieval-Augmented Generation) com Pinecone.

---

## ✨ **Principais Funcionalidades**
- 📝 **Análise de Código**: Obtenha análises detalhadas de arquivos do projeto.
- 🎫 **Integração com Jira**: Analise e entenda tickets do Jira.
- 📚 **Busca no Confluence**: Consulte sua documentação usando RAG.
- 🔄 **Revisão de Pull Requests**: Análise automatizada de PRs.
- 🚀 **Verificação de Deploy**: Saiba se é seguro realizar deploy hoje.

---

## 📋 **Pré-requisitos**
- **Node.js** (v16 ou superior)
- **Git**
- Acesso ao **Jira** e **Confluence** (para recursos relacionados)
- Acesso ao **Bitbucket** (para análise de PRs)

---

## 🔧 **Instalação**

1. Clone o repositório:
   ```bash
   git clone https://github.com/jorgesouza/agent-rag.git
   cd agent-rag
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo `.env` seguindo as instruções em [Configuration Guide](./docs/Configuration.md).

---

## 📚 **Documentação**

- [Guia Técnico](./docs/TECHNICAL.md)
- [Manual do Usuário](./docs/AGENT-RAG-UserManual.md)
- [Configuração](./docs/Configuration.md)
- [Métricas](./docs/metricas.md)
- [Integração com MongoDB](./docs/MongoDBIntegration.md)
- [Uso do Pinecone](./docs/VectorDB_and_Pinecone.md)

---

## 🤝 **Contribuindo**

1. Faça um fork do repositório.
2. Crie uma branch para sua feature:
   ```bash
   git checkout -b feature/nome-da-feature
   ```
3. Faça commit das alterações:
   ```bash
   git commit -m "feat: descrição da feature"
   ```
4. Envie a branch:
   ```bash
   git push origin feature/nome-da-feature
   ```
5. Abra um Pull Request no GitHub.

---

## 📄 **Licença**

Este projeto está licenciado sob a licença ISC. Consulte o arquivo `LICENSE` para mais detalhes.

---

## 💬 **Suporte**

Para suporte, entre em contato com Jorge Souza.