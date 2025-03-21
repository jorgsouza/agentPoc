import { PullRequestAnalysis } from "../entities/PullRequestAnalysis.js";
import { Ticket } from "../valueObjects/Ticket.js";

export class PullRequestAnalysisAggregate {
  constructor(prDetails, jiraTickets = []) {
    this.pullRequestAnalysis = new PullRequestAnalysis(prDetails);
    this.jiraTickets = jiraTickets.map(ticket => new Ticket(ticket));
  }

  addJiraTicket(ticketDetails) {
    const ticket = new Ticket(ticketDetails);
    this.jiraTickets.push(ticket);
    this.pullRequestAnalysis.addJiraReference(ticket);
  }

  generateFullReport() {
    return {
      ...this.pullRequestAnalysis.generateReport(),
      jiraTickets: this.jiraTickets.map(ticket => ticket.toString())
    };
  }
}
