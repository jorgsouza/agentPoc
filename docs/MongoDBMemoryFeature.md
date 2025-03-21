# Funcionalidade de Memória Contextual com MongoDB

## Visão Geral

A funcionalidade de memória contextual permite que a aplicação armazene e recupere interações anteriores do usuário, utilizando o MongoDB como banco de dados. Isso possibilita que o agente forneça respostas mais relevantes e contextualizadas, considerando o histórico de conversas.

---

## Objetivo

- **Persistência de Interações**: Salvar perguntas e respostas no MongoDB para manter um histórico.
- **Recuperação de Histórico**: Recuperar interações anteriores para fornecer contexto às respostas futuras.
- **Escalabilidade**: Suporte a múltiplos usuários, identificados por `user_id`.

---

## Componentes Envolvidos

### 1. **Schema do MongoDB**
O schema está definido no arquivo `/src/infrastructure/db/interactionSchema.js` e contém os seguintes campos:
- `user_id` (string): Identifica o usuário.
- `timestamp` (date): Data e hora da interação.
- `message` (string): Pergunta feita pelo usuário.
- `response` (string): Resposta gerada pelo agente.

### 2. **Conexão com o MongoDB**
O arquivo `/src/infrastructure/db/mongoConnection.js` gerencia a conexão com o MongoDB. Ele utiliza a URI configurada no arquivo `.env` para se conectar ao banco de dados.

### 3. **Serviços de Interação**
O arquivo `/src/infrastructure/db/interactionService.js` fornece funções para:
- **Salvar interações**: `saveInteraction(user_id, message, response)` salva uma interação no banco.
- **Recuperar interações**: `getInteractions(user_id)` recupera as últimas 10 interações de um usuário.

### 4. **Contexto da Conversação**
O arquivo `/src/infrastructure/conversationContext.js` utiliza os serviços de interação para:
- **Adicionar ao histórico**: `addToHistory(user_id, question, answer)` salva a interação no MongoDB e mantém um histórico local limitado a 10 interações.
- **Recuperar o histórico**: `getHistoryContext(user_id)` retorna o histórico formatado para ser usado como contexto em novas perguntas.

---

## Fluxo de Funcionamento

1. **Conexão com o MongoDB**
   - Quando a aplicação é iniciada (`/src/cli.js`), ela se conecta ao MongoDB utilizando a função `connectToMongo()`.

2. **Armazenamento de Interações**
   - Sempre que o usuário faz uma pergunta, a função `addToHistory()` é chamada.
   - A interação (pergunta e resposta) é salva no MongoDB através da função `saveInteraction()`.

3. **Recuperação de Histórico**
   - Antes de responder a uma nova pergunta, a função `getHistoryContext()` é chamada.
   - Ela recupera as últimas 10 interações do MongoDB usando `getInteractions()` e formata o histórico para ser usado como contexto.

4. **Resposta Contextual**
   - O histórico recuperado é incluído no prompt enviado ao agente, permitindo que ele considere interações anteriores ao gerar uma nova resposta.

---

## Configuração Necessária

### 1. **Arquivo `.env`**
Certifique-se de que o arquivo `.env` contém a seguinte configuração para o MongoDB:
```ini
# MongoDB
MONGO_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/agent-rag
MONGO_DB_NAME=agent_rag
```

### 2. **Banco de Dados MongoDB**
- O banco deve estar acessível e configurado para aceitar conexões da aplicação.
- Adicione o IP da máquina na whitelist do MongoDB Atlas ou use `0.0.0.0/0` para permitir conexões de qualquer lugar (temporariamente).

---

## Benefícios

- **Memória Persistente**: O histórico de interações é armazenado de forma persistente no MongoDB.
- **Respostas Contextualizadas**: O agente pode fornecer respostas mais relevantes ao considerar interações anteriores.
- **Escalabilidade**: A arquitetura permite que o histórico seja expandido para múltiplos usuários.

---

## Exemplo de Uso

1. **Usuário faz uma pergunta**:
   ```bash
   > Qual é o status do projeto?
   ```

2. **Interação é salva no MongoDB**:
   - Pergunta: "Qual é o status do projeto?"
   - Resposta: "O projeto está em andamento e será concluído em breve."

3. **Nova pergunta com contexto**:
   ```bash
   > E quanto ao prazo?
   ```

4. **Histórico é recuperado e usado como contexto**:
   - O agente considera a interação anterior para responder: "O prazo estimado é de 2 semanas."

---

## Arquivos Relacionados

- `/src/infrastructure/db/interactionSchema.js`: Define o schema do MongoDB.
- `/src/infrastructure/db/mongoConnection.js`: Gerencia a conexão com o MongoDB.
- `/src/infrastructure/db/interactionService.js`: Fornece funções para salvar e recuperar interações.
- `/src/infrastructure/conversationContext.js`: Gerencia o histórico de conversação.

---

Se precisar de mais informações ou ajustes, consulte os arquivos mencionados ou entre em contato com o responsável pelo projeto.
