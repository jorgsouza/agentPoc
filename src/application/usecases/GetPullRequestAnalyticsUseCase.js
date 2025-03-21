import { BitbucketRepository } from "../../domain/repositories/BitbucketRepository.js";

export class GetPullRequestAnalyticsUseCase {
  static async execute() {
    try {
      const pullRequests = await BitbucketRepository.getPullRequests();

      if (!pullRequests || pullRequests.length === 0) {
        return {
          totalPRs: 0,
          prByUser: {},
          averageApprovalTime: 0,
          reviewsPerPR: [],
          rejectionRate: 0,
          timeToMerge: [],
        };
      }

      const prByUser = pullRequests.reduce((acc, pr) => {
        const user = pr.author.displayName;
        if (!acc[user]) acc[user] = [];
        acc[user].push({
          id: pr.id,
          title: pr.title,
          state: pr.state,
          createdOn: pr.created_on,
          updatedOn: pr.updated_on,
        });
        return acc;
      }, {});

      const totalPRs = pullRequests.length;
      const averageApprovalTime =
        pullRequests.reduce((sum, pr) => sum + (new Date(pr.updated_on) - new Date(pr.created_on)), 0) /
        totalPRs;

      return {
        totalPRs,
        prByUser,
        averageApprovalTime: averageApprovalTime / (1000 * 60 * 60), // Convert to hours
        reviewsPerPR: pullRequests.map(pr => pr.reviewers.length),
        rejectionRate: pullRequests.filter(pr => pr.state === "DECLINED").length / totalPRs,
        timeToMerge: pullRequests
          .filter(pr => pr.state === "MERGED")
          .map(pr => (new Date(pr.updated_on) - new Date(pr.created_on)) / (1000 * 60 * 60)), // Hours
      };
    } catch (error) {
      console.error("❌ Error fetching pull request analytics:", error.message);
      throw new Error(`Error in GetPullRequestAnalyticsUseCase: ${error.message}`);
    }
  }
}
