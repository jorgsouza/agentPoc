import axios from "axios";
import { exibirResposta } from "../infrastructure/terminalFormatter.js";

export async function verificarDeploy() {
  try {
    console.log("🔍 Querying Deploy API...");
    const response = await axios.get("https://shouldideploy.today/api?tz=UTC");

    if (!response || !response.data) {
      throw new Error("Empty or invalid API response.");
    }

    const { shouldideploy, message } = response.data;

    if (shouldideploy === undefined || !message) {
      throw new Error("Unexpected API response format.");
    }

    // Correctly formatting the response
    const status = shouldideploy ? "✅ Yep!" : "❌ No good plz!";
    const mensagem = `🚀 **Can I deploy today?**\n\n${status} ${message}`;

    exibirResposta(mensagem, "💡 Response");
  } catch (error) {
    console.error("❌ Error checking deploy status:", error.message);
    exibirResposta("⚠️ Could not get a response from the deploy API. Please try again later.", "Error");
  }
}
