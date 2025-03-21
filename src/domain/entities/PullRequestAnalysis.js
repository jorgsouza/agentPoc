export class PullRequestAnalysis {
  constructor(pr) {
    this.pr = pr;
    this.jiraReferences = [];
  }

  static extractJiraTickets(text) {
    const matches = text.match(/[A-Z]+-\d+/g) || [];
    return [...new Set(matches)];
  }

  addJiraReference(ticketDetails) {
    this.jiraReferences.push(ticketDetails);
  }

  generateReport() {
    return {
      pullRequest: this.pr,
      jiraReferences: this.jiraReferences,
      recommendations: this.generateRecommendations()
    };
  }

  generateRecommendations() {
    const recommendations = [];
    if (this.pr.description.length < 50) {
      recommendations.push('Consider adding a more detailed description.');
    }
    return recommendations;
  }
}
