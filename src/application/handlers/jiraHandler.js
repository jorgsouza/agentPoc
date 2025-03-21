import { analyzeJiraTicket, analyzeTasksByEmail, analyzeTasksBySprint } from "../analyzer/jiraAnalyzer.js";

export async function handleJiraCommand(args, rl) {
  rl.question("🔗 Enter the Jira ticket number, user email, or sprint name: ", async (input) => {
    try {
      if (/^rec-\d+$/i.test(input) || /^\d+$/.test(input)) {
        // Input is a ticket number (with or without "REC-")
        const ticketId = input.toUpperCase().startsWith("REC-") ? input.toUpperCase() : `REC-${input}`;
        await analyzeJiraTicket(ticketId, rl);
      } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
        // Input is a valid email
        await analyzeTasksByEmail(input, rl);
      } else {
        // Input is treated as a sprint name
        await analyzeTasksBySprint(input, rl);
      }
    } catch (error) {
      console.error("❌ Error processing Jira command:", error.message);
    }
    rl.prompt();
  });
}
