import { BaseAdapter } from './BaseAdapter.js';
import axios from 'axios';

export class JiraAdapter extends BaseAdapter {
  constructor(config) {
    super(config);
    this.baseUrl = config.baseUrl;
    this.validateConfig();
  }

  validateConfig() {
    if (!this.config.username || !this.config.token || !this.baseUrl) {
      throw new Error('Missing JIRA configuration');
    }
  }

  async getTicket(ticketId) {
    return this.executeRequest(async () => {
      const response = await axios.get(
        `${this.baseUrl}/rest/api/3/issue/${ticketId}`,
        {
          auth: {
            username: this.config.username,
            password: this.config.token
          }
        }
      );
      
      const { fields } = response.data;
      return {
        title: fields.summary,
        description: this.parseDescription(fields.description),
        status: fields.status.name,
        assignee: fields.assignee?.displayName
      };
    });
  }

  parseDescription(description) {
    if (!description?.content) return 'No description.';
    return description.content
      .map(block => block.content?.map(text => text.text).join(' '))
      .filter(Boolean)
      .join('\n');
  }
}
