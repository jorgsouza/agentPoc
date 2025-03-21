import axios from "axios";

export class BitbucketRepository {
  static async getPullRequests() {
    const url = `${process.env.BITBUCKET_BASE_URL}/repositories/${process.env.BITBUCKET_PROJECT_KEY}/${process.env.BITBUCKET_REPO_SLUG}/pullrequests`;
    const auth = { username: process.env.BITBUCKET_USER.trim(), password: process.env.BITBUCKET_TOKEN.trim() };

    try {
      const response = await axios.get(url, { auth });
      return response.data.values;
    } catch (error) {
      throw new Error(`Failed to fetch pull requests: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}
