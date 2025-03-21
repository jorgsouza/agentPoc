import { askAgent } from "../../config/agent.js";

class PullRequestAnalyzer {
  constructor(bitbucketService, codeAnalyzer) {
    this.bitbucketService = bitbucketService;
    this.codeAnalyzer = codeAnalyzer;
  }

  /**
   * Analyzes a pull request by fetching its details and running a code analysis.
   * @param {string} project - The Bitbucket project name.
   * @param {string} prId - The ID of the pull request.
   * @returns {Promise<object>} - Analysis report.
   */
  async analyzePullRequest(project, prId) {
    try {
      console.log(`🔍 Analyzing PR #${prId} in project ${project}...`);
      
      const prDetails = await this.bitbucketService.getPullRequest(project, prId);
      console.log("📄 PR Details:", {
        title: prDetails.title,
        state: prDetails.state,
        author: prDetails.author.display_name
      });

      // Get list of changed files
      const changedFiles = await this.bitbucketService.getDiffstat(project, prId);
      
      if (changedFiles.length > 0 && changedFiles[0].message) {
        console.log("⚠️ Limited Access:", changedFiles[0].message);
      }

      // Generate and send analysis prompt to Gemini
      console.log("🤖 Requesting AI analysis of the PR...");
      const analysisPrompt = this.generateAnalysisPrompt(prDetails, changedFiles);
      const analysis = await askAgent(analysisPrompt);

      return {
        title: prDetails.title,
        description: prDetails.description || "",
        state: prDetails.state,
        author: prDetails.author.display_name,
        changedFiles,
        accessLevel: changedFiles[0]?.message ? "limited" : "full",
        aiAnalysis: analysis
      };
    } catch (error) {
      console.error("❌ Error during PR analysis:", error.message);
      throw error;
    }
  }

  generateAnalysisPrompt(prDetails, changedFiles) {
    return `
# Pull Request Analysis Request

## PR Details
- Title: ${prDetails.title}
- Author: ${prDetails.author.display_name}
- State: ${prDetails.state}
- Description: ${prDetails.description || "No description provided"}

## Changes Overview
${changedFiles.map(file => `
- File: ${file.path}
- Type: ${file.type}
- Changes: ${file.linesAdded !== '?' ? `Added: ${file.linesAdded}, Removed: ${file.linesRemoved}` : 'Details not accessible'}
${file.message ? `- Note: ${file.message}` : ''}`).join('\n')}

## Analysis Request

Please provide a comprehensive analysis of this Pull Request considering:

1. **Title and Description Analysis**
   - Is the PR title descriptive and following conventional commits?
   - Is the description adequate and clear?

2. **Changes Scope**
   - Are the changes focused and atomic?
   - Is the scope of changes appropriate?

3. **Best Practices Review**
   - Suggest any improvements in the approach
   - Identify potential issues or concerns
   - Comment on the development practices shown

4. **Security and Performance**
   - Identify any security implications
   - Note any performance considerations

5. **Recommendations**
   - Provide specific suggestions for improvement
   - Highlight any areas needing attention

Please provide the analysis in Brazilian Portuguese.
`;
  }
}

export default PullRequestAnalyzer;
