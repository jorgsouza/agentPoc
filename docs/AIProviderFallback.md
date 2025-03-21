# Fallback entre Provedores de IA

## Visão Geral

O sistema agora suporta múltiplos provedores de IA com um mecanismo de fallback. Isso significa que, caso o provedor principal (Gemini) falhe, o sistema tentará outros provedores (OpenAI, servidor interno e Docker local) em sequência até obter uma resposta bem-sucedida.

---

## Como Funciona

### 1. **Serviço de Gerenciamento de Provedores**
O arquivo `AIProviderService.js` gerencia a lista de provedores e implementa o mecanismo de fallback. Ele tenta cada provedor na ordem configurada e retorna o resultado do primeiro que funcionar.

### 2. **Provedores de IA**
Cada provedor é implementado como uma classe separada, encapsulando a lógica de integração com a API correspondente:
- **GeminiProvider**: Interage com a API do Gemini.
- **OpenAIProvider**: Interage com a API do OpenAI.
- **InternalServerProvider**: Faz chamadas para um servidor interno configurado.
- **DockerLocalProvider**: Faz chamadas para um serviço local em execução no Docker.

### 3. **Ordem de Prioridade**
A ordem de fallback é configurada no arquivo `gemini.js`:
1. Gemini (principal)
2. OpenAI
3. Servidor interno
4. Docker local

---

## Configuração

### 1. **Variáveis de Ambiente**
Certifique-se de configurar as seguintes variáveis no arquivo `.env`:

```ini
# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# Servidor Interno
INTERNAL_SERVER_URL=http://your-internal-server

# Docker Local
DOCKER_LOCAL_URL=http://localhost:5000
```

### 2. **Dependências**
Certifique-se de que a biblioteca `node-fetch` está instalada:
```bash
npm install node-fetch
```

---

## Fluxo de Execução

1. **Chamada ao Serviço**:
   - A função `generateEmbedding` no arquivo `gemini.js` chama o `AIProviderService` para gerar embeddings.

2. **Tentativa de Provedores**:
   - O `AIProviderService` tenta cada provedor na ordem configurada.
   - Caso um provedor falhe, ele registra um aviso no console e tenta o próximo.

3. **Resultado Final**:
   - Se um provedor retornar um resultado válido, ele é usado.
   - Se todos os provedores falharem, uma exceção é lançada.

---

## Exemplo de Código

### Chamada ao Serviço
```javascript
import { generateEmbedding } from './infrastructure/config/gemini.js';

(async () => {
  try {
    const embedding = await generateEmbedding('Texto para gerar embedding');
    console.log('Embedding gerado:', embedding);
  } catch (error) {
    console.error('Erro ao gerar embedding:', error.message);
  }
})();
```

---

## Benefícios

1. **Alta Disponibilidade**:
   - O sistema continua funcional mesmo que o provedor principal esteja indisponível.

2. **Flexibilidade**:
   - Fácil de adicionar ou remover provedores no futuro.

3. **Manutenção Simplificada**:
   - Cada provedor é encapsulado em sua própria classe, seguindo os princípios de DDD e DRY.

---

## Arquivos Relacionados

- **`/src/domain/services/AIProviderService.js`**:
  - Gerencia o fallback entre os provedores.

- **`/src/infrastructure/providers/GeminiProvider.js`**:
  - Implementa a integração com o Gemini.

- **`/src/infrastructure/providers/OpenAIProvider.js`**:
  - Implementa a integração com o OpenAI.

- **`/src/infrastructure/providers/InternalServerProvider.js`**:
  - Implementa a integração com o servidor interno.

- **`/src/infrastructure/providers/DockerLocalProvider.js`**:
  - Implementa a integração com o serviço local no Docker.

- **`/src/infrastructure/config/gemini.js`**:
  - Configura o serviço de fallback e chama o `AIProviderService`.

---

## Troubleshooting

1. **Erro: "All AI providers failed to generate embedding"**
   - Verifique se as variáveis de ambiente estão configuradas corretamente.
   - Certifique-se de que os serviços externos estão acessíveis.

2. **Erro de Conexão com Docker Local**
   - Verifique se o serviço Docker está em execução na porta configurada (padrão: 5000).

3. **Erro de Autenticação**
   - Confirme que as chaves de API (Gemini e OpenAI) estão corretas e válidas.

---

Com essa implementação, o sistema está preparado para lidar com falhas de provedores de IA de forma robusta e escalável.
