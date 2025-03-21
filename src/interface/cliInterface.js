import readline from "readline";
import { processCommand } from "../application/commandProcessor.js";
import { exibirMensagemInicial, MENSAGENS } from "../config/messages.js";
import ignore from "ignore"; // Import ignore library
import fs from "fs";
import path from "path";
import { loadGitignore } from "../infrastructure/utils/gitignoreUtils.js";
import { HandleConversationUseCase } from '../application/usecases/HandleConversationUseCase.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: MENSAGENS.prompt,
});

const handleConversation = new HandleConversationUseCase();

function listFilteredFiles() {
  const ig = loadGitignore(process.cwd());
  const allFiles = fs.readdirSync(process.cwd(), { withFileTypes: true });
  return allFiles
    .filter((file) => !ig.ignores(file.name) && file.isFile())
    .map((file) => file.name);
}

export function startCLI() {
  exibirMensagemInicial();
  rl.prompt();

  rl.on("line", async (input) => {
    if (input.trim() === "clear conversations") {
      await handleConversation.conversationRepository.deleteOldConversations(30); // Excluir conversas com mais de 30 dias
      console.log("🗑️ Conversas antigas removidas.");
    } else {
      const user = 'jorge'; // Substituir por autenticação real
      const response = await handleConversation.execute(user, input);
      console.log(`\n💡 ${chalk.green('Agent')} >_ \n\n${response}`);
    }
    rl.prompt();
  });

  rl.on("close", () => {
    console.log(MENSAGENS.exit);
    process.exit(0);
  });

  rl.prompt();
}
