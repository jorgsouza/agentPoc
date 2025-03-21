import { CodeAnalysis } from "../../domain/entities/CodeAnalysis.js";
import readline from "readline-sync";
import { askAgent } from "../../config/agent.js";

class CodeAnalyzer {
  constructor() {
    this.codeAnalysis = new CodeAnalysis();
  }

  async analyzeFile() {
    console.log("📂 Lista de arquivos disponíveis:\n");
    const files = this.codeAnalysis.listFiles();
    files.forEach((file, index) => console.log(`${index + 1}. ${file}`));

    const fileChoice = readline.question("\nDigite o nome do arquivo que você deseja analisar: ");
    if (!files.includes(fileChoice)) {
      console.log("❌ Arquivo não encontrado. Tente novamente.");
      return;
    }

    console.log(`📖 Arquivo selecionado: ${fileChoice}`);
    const fileContent = this.codeAnalysis.readFileContent(fileChoice);

    const userQuery = readline.question("\nO que você quer perguntar sobre este arquivo? ");

    const prompt = `
    Arquivo: ${fileChoice}
    \`\`\`javascript
    ${fileContent.slice(0, 500)}... // Exibindo apenas um trecho do código para análise
    \`\`\`

    **Pergunta do usuário:**
    ${userQuery}
    `;

    console.log("\n📌 Enviando análise para Gemini...");
    const response = await askAgent(prompt);
    console.log("\n💡 Agente:");
    console.log(response);
  }
}

export { CodeAnalyzer };
