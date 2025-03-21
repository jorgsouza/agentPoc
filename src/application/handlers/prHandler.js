import { BitbucketService } from "../../infrastructure/bitbucket/bitbucketService.js";
import PullRequestAnalyzer from "../analyzer/pullRequestAnalyzer.js";
import { CodeAnalyzer } from "../analyzer/codeAnalyzer.js";

export async function handlePRCommand(rl) {
  rl.question("🔗 Enter Bitbucket PR URL (e.g., https://bitbucket.org/obviobrasil/project/pull-requests/123): ", async (url) => {
    try {
      const bitbucketService = new BitbucketService();
      const { project, prId } = BitbucketService.parsePullRequestUrl(url);

      console.log(`🔍 Analyzing PR #${prId} from project ${project}...`);
      const pullRequestAnalyzer = new PullRequestAnalyzer(bitbucketService, new CodeAnalyzer());

      const report = await pullRequestAnalyzer.analyzePullRequest(project, prId);

      console.log("\n📋 Pull Request Details:");
      console.log("------------------------");
      console.log(`Title: ${report.title}`);
      console.log(`Author: ${report.author}`);
      console.log(`Status: ${report.state}`);

      if (report.aiAnalysis) {
        console.log("\n🤖 AI Analysis:");
        console.log("-------------");
        console.log(report.aiAnalysis);
      }
    } catch (error) {
      console.log("❌ Error analyzing PR:", error.message);
    }
    rl.prompt();
  });
}
