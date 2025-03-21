import { searchConfluenceDocs } from "../confluence/confluenceSearch.js";
import { addToHistory } from "../../infrastructure/conversationContext.js";
import chalk from "chalk"; // Add this import

export async function handleDocsCommand(rl) {
  rl.question("🔎 Enter your question about the documentation: ", async (question) => {
    try {
      console.log(`\n📚 Searching the knowledge base...`);
      const response = await searchConfluenceDocs(question);
      console.log(`\n💡 ${chalk.green('Agent')} >_ \n\n${response}`);
      addToHistory(question, response);
    } catch (error) {
      console.error("❌ Error processing Docs command:", error.message);
    }
    rl.prompt();
  });
}
