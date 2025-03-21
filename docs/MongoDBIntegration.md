# Integração com MongoDB no AGENT-RAG

## Visão Geral

A integração com o MongoDB permite que a aplicação armazene e recupere interações entre o usuário e o agente. Isso inclui perguntas feitas pelo usuário e respostas geradas pelo agente. Essa funcionalidade é essencial para fornecer respostas mais contextuais e relevantes, além de permitir a persistência do histórico de interações.

---

## Fluxo de Funcionamento

### 1. **Execução de Comandos**
- O usuário insere um comando ou pergunta no CLI.
- O comando é processado pela função `processCommand` no arquivo `/src/application/commandProcessor.js`.

### 2. **Interação com o Agente**
- Para comandos como `confluence` ou perguntas gerais, a aplicação envia a entrada do usuário para o agente (via a função `askAgent`).
- O agente gera uma resposta com base na entrada e no contexto fornecido.

### 3. **Armazenamento de Interações**
- Após o agente gerar uma resposta, a interação (pergunta e resposta) é salva no MongoDB usando a função `saveInteraction` do arquivo `/src/infrastructure/db/interactionService.js`.
- A função `saveInteraction` garante que os campos `message` (pergunta) e `response` (resposta) sejam armazenados, com um fallback para respostas ausentes.

### 4. **Recuperação do Histórico**
- Antes de enviar uma consulta ao agente, a aplicação recupera o histórico de interações do usuário no MongoDB usando a função `getInteractions`.
- Esse histórico é formatado e incluído como contexto para o agente, permitindo respostas mais relevantes.

### 5. **Comportamento para Consultas Gerais**
- Quando o usuário insere uma pergunta geral:
  1. A aplicação recupera as últimas 10 interações do usuário no MongoDB.
  2. O histórico é anexado à pergunta e enviado ao agente.
  3. O agente gera uma resposta considerando o contexto fornecido.
  4. A interação (pergunta e resposta) é salva no MongoDB.

---

## Exemplo de Fluxo

1. **Entrada do Usuário**:
   ```
   Qual é o comando Helm para io search?
   ```

2. **Recuperação do Histórico**:
   - A aplicação busca as últimas interações do usuário no MongoDB:
     ```
     Pergunta:
     Qual é o status do projeto?

     Resposta:
     O projeto está em andamento.
     ```

3. **Envio ao Agente**:
   - A consulta é enviada ao agente junto com o histórico:
     ```
     Histórico da conversa:
     Pergunta:
     Qual é o status do projeto?

     Resposta:
     O projeto está em andamento.

     Agora, responda à seguinte pergunta considerando o contexto anterior:
     Qual é o comando Helm para io search?
     ```

4. **Resposta do Agente**:
   - O agente gera a resposta:
     ```
     O comando Helm para io search é: helm upgrade --install ...
     ```

5. **Armazenamento da Interação**:
   - A interação é salva no MongoDB:
     ```json
     {
       "user_id": "default_user",
       "message": "Qual é o comando Helm para io search?",
       "response": "O comando Helm para io search é: helm upgrade --install ..."
     }
     ```

---

## Benefícios da Integração com MongoDB

1. **Respostas Contextuais**:
   - O agente pode gerar respostas mais relevantes ao considerar o histórico de interações do usuário.

2. **Persistência**:
   - As interações são armazenadas de forma persistente, permitindo a retenção de contexto a longo prazo.

3. **Depuração e Análise**:
   - As interações salvas podem ser usadas para depuração, melhoria do agente ou análise do comportamento do usuário.

4. **Escalabilidade**:
   - O MongoDB é flexível e escalável, suportando múltiplos usuários e grandes volumes de interações.

---

## Arquivos Relacionados

- **`/src/infrastructure/db/interactionService.js`**:
  - Gerencia o salvamento e a recuperação de interações no MongoDB.

- **`/src/application/commandProcessor.js`**:
  - Orquestra o fluxo de comandos, incluindo a recuperação do histórico e o salvamento de interações.

- **`/src/infrastructure/db/mongoConnection.js`**:
  - Gerencia a conexão com o MongoDB.

---

Se precisar de mais informações ou ajustes, consulte os arquivos mencionados ou entre em contato com o responsável pelo projeto.
