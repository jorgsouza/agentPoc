import { verificarDeploy } from "../deployChecker.js";

export async function handleDeployCommand(rl) {
  try {
    console.log("🔍 Checking deployment status...");
    await verificarDeploy();
  } catch (error) {
    console.error("❌ Error processing Deploy command:", error.message);
  }
  rl.prompt();
}
