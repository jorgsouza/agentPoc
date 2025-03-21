import { PullRequestAnalysisAggregate } from "../../domain/aggregates/PullRequestAnalysisAggregate.js";

export class AnalyzePullRequestUseCase {
  constructor(bitbucketRepository, jiraRepository) {
    this.bitbucketRepository = bitbucketRepository;
    this.jiraRepository = jiraRepository;
  }

  async execute(project, prId) {
    try {
      const prDetails = await this.bitbucketRepository.getPullRequest(project, prId);
      const jiraTickets = PullRequestAnalysisAggregate.extractJiraTickets(prDetails.description);

      const aggregate = new PullRequestAnalysisAggregate(prDetails);

      for (const ticketId of jiraTickets) {
        const ticketDetails = await this.jiraRepository.fetchTicketDetails(ticketId);
        aggregate.addJiraTicket(ticketDetails);
      }

      return aggregate.generateFullReport();
    } catch (error) {
      throw new Error(`Failed to analyze pull request: ${error.message}`);
    }
  }
}
