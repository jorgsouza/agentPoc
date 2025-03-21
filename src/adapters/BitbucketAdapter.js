import { BaseAdapter } from './BaseAdapter.js';
import axios from 'axios';

export class BitbucketAdapter extends BaseAdapter {
  constructor(config) {
    super(config);
    this.baseUrl = config.baseUrl || 'https://api.bitbucket.org/2.0';
    this.validateConfig();
  }

  validateConfig() {
    if (!this.config.username || !this.config.token) {
      throw new Error('Missing Bitbucket credentials');
    }
  }

  getAuthHeader() {
    const auth = Buffer.from(`${this.config.username}:${this.config.token}`).toString('base64');
    return `Basic ${auth}`;
  }

  async getPullRequest(project, prId) {
    return this.executeRequest(async () => {
      const response = await axios.get(
        `${this.baseUrl}/repositories/${project}/pullrequests/${prId}`,
        {
          headers: {
            'Authorization': this.getAuthHeader(),
            'Accept': 'application/json'
          }
        }
      );
      return response.data;
    });
  }
}
