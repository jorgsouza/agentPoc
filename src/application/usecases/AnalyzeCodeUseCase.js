import { askAgent } from "../../config/agent.js";

class AnalyzeCodeUseCase {
  constructor(codeAnalysis) {
    this.codeAnalysis = codeAnalysis;
  }

  async execute(fileName, userQuery) {
    const fileContent = this.codeAnalysis.readFileContent(fileName);
    const prompt = `
    Arquivo: ${fileName}
    \`\`\`javascript
    ${fileContent.slice(0, 500)}... // Exibindo apenas um trecho do código para análise
    \`\`\`

    **Pergunta do usuário:**
    ${userQuery}
    `;

    return await askAgent(prompt);
  }
}

export { AnalyzeCodeUseCase };
