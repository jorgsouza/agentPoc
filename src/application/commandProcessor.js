import { analyzeFile } from "../interface/fileAnalyzer.js";
import { handleJiraCommand } from "./handlers/jiraHandler.js";
import { handleDocsCommand } from "./handlers/docsHandler.js";
import { handlePRCommand } from "./handlers/prHandler.js";
import { handleDeployCommand } from "./handlers/deployHandler.js";
import { handleSprintsCommand } from "./handlers/sprintsHandler.js";
import { GetPullRequestAnalyticsUseCase } from "./usecases/GetPullRequestAnalyticsUseCase.js";
import { exibirAjuda } from "./help.js";
import { askAgent } from "../config/agent.js";
import { addToHistory, getHistoryContext } from "../infrastructure/conversationContext.js";

export class CommandProcessor {
  static commands = ["analyze", "jira", "docs", "pr", "pr-analytics", "deploy", "help", "exit", "sprints"];

  static getCommands() {
    return this.commands;
  }

  static async process(command, rl) {
    try {
      const [cmd, ...args] = command.split(" ");
      switch (cmd) {
        case "analyze":
          await analyzeFile(rl);
          break;
        case "jira":
          await handleJiraCommand(args, rl);
          break;
        case "docs":
          await handleDocsCommand(rl);
          break;
        case "pr":
          await handlePRCommand(rl);
          break;
        case "pr-analytics":
          await this.handlePRAnalytics(rl); // Add handler for pr-analytics
          break;
        case "deploy":
          await handleDeployCommand(rl);
          break;
        case "sprints":
          await handleSprintsCommand(rl);
          break;
        case "help":
          exibirAjuda();
          break;
        case "exit":
          rl.close();
          break;
        default:
          await this.handleDefault(command, rl);
          break;
      }
    } catch (error) {
      console.error("⚠️ An error occurred:", error.message);
    }
  }

  static async handlePRAnalytics(rl) {
    console.log("📊 Fetching pull request analytics...");
    try {
      const analytics = await GetPullRequestAnalyticsUseCase.execute();

      if (analytics.totalPRs === 0) {
        console.log("\n📋 Pull Request Analytics:");
        console.log("--------------------------");
        console.log("No pull requests found.");
      } else {
        console.log("\n📋 Pull Request Analytics:");
        console.log("--------------------------");
        console.log(`Total PRs: ${analytics.totalPRs}`);
        console.log(`Average Approval Time: ${analytics.averageApprovalTime.toFixed(2)} hours`);
        console.log(`Rejection Rate: ${(analytics.rejectionRate * 100).toFixed(2)}%`);
        console.log("\nPRs by User:");
        Object.entries(analytics.prByUser).forEach(([user, prs]) => {
          console.log(`\n${user}:`);
          prs.forEach(pr => {
            console.log(`- [${pr.id}] ${pr.title} (${pr.state})`);
          });
        });
      }
    } catch (error) {
      console.error("❌ Error fetching pull request analytics:", error.message);
    }
    rl.prompt();
  }

  static async handleDefault(query, rl) {
    const context = getHistoryContext();
    // console.log(`📌 Sending question to Agent: ${query}`);
    const response = await askAgent(`Conversation history:\n${context}\n\nNow, answer the following question considering the previous context:\n${query}`);
    console.log("\n💡 Response:", response);
    addToHistory(query, response);
  }
}
