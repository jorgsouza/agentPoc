import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

class BitbucketService {
  constructor() {
    this.apiBaseUrl = process.env.BITBUCKET_BASE_URL || "https://api.bitbucket.org/2.0";
    this.authUser = process.env.BITBUCKET_USER;
    this.authToken = process.env.BITBUCKET_TOKEN;

    if (!this.authUser || !this.authToken) {
      throw new Error("❌ Missing Bitbucket credentials in .env (BITBUCKET_USER and BITBUCKET_TOKEN)");
    }
  }

  static parsePullRequestUrl(url) {
    try {
      // Remove trailing slash if present
      url = url.replace(/\/$/, '');
      
      // Extract parts from URL
      const match = url.match(/bitbucket\.org\/([^\/]+)\/([^\/]+)\/pull-requests\/(\d+)/);
      
      if (!match) {
        throw new Error("Invalid Bitbucket pull request URL format");
      }

      const [, workspace, project, prId] = match;
      return {
        workspace,
        project,
        prId: parseInt(prId, 10)
      };
    } catch (error) {
      throw new Error("❌ Invalid URL format. Expected: https://bitbucket.org/workspace/project/pull-requests/number");
    }
  }

  async getPullRequest(project, prId) {
    try {
      console.log(`🔍 Fetching PR #${prId} from project ${project}...`);
      console.log(`🔑 Authenticating with user: ${this.authUser}`);
      
      // Remove any quotes from token that might have been added in .env
      const cleanToken = this.authToken.replace(/"/g, '');
      
      const response = await axios.get(
        `${this.apiBaseUrl}/repositories/obviobrasil/${project}/pullrequests/${prId}`,
        {
          auth: {
            username: this.authUser,
            password: cleanToken
          },
          headers: {
            'Accept': '*/*',
            'User-Agent': 'curl/7.81.0'
          }
        }
      );

      if (!response.data) {
        throw new Error("No data received from Bitbucket API");
      }

      console.log("✅ Successfully fetched PR details");
      return response.data;
    } catch (error) {
      console.error("❌ API Error Details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });

      if (error.response?.status === 401) {
        console.error("❌ Authentication failed");
        console.error("🔍 Debug Info:");
        console.error(`- API URL: ${this.apiBaseUrl}`);
        console.error(`- User: ${this.authUser}`);
        // Show the actual auth being used
        const authString = Buffer.from(`${this.authUser}:${cleanToken}`).toString('base64');
        console.error(`- Auth Header: Basic ${authString}`);
      }

      throw new Error(`Failed to fetch Pull Request: ${error.message}`);
    }
  }

  async getDiffstat(project, prId) {
    try {
      console.log(`📊 Fetching changes for PR #${prId}...`);
      const cleanToken = this.authToken.replace(/"/g, '');
      
      // First try to get PR details to check permissions
      const prDetails = await this.getPullRequest(project, prId);
      if (!prDetails) {
        throw new Error("Could not access PR details");
      }

      // If PR is merged, try to get changes from merge commit
      if (prDetails.state === 'MERGED' && prDetails.merge_commit) {
        console.log(`🔍 PR is merged, fetching changes from merge commit: ${prDetails.merge_commit.hash}`);
        
        try {
          const mergeCommitResponse = await axios.get(
            `${this.apiBaseUrl}/repositories/obviobrasil/${project}/commit/${prDetails.merge_commit.hash}`,
            {
              auth: {
                username: this.authUser,
                password: cleanToken
              },
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'curl/7.81.0'
              }
            }
          );

          if (mergeCommitResponse.data?.parents?.[0]) {
            return [{
              path: '(Limited Access)',
              type: 'modified',
              linesAdded: '?',
              linesRemoved: '?',
              message: `Changes available only to PR author or administrators. PR was merged by ${prDetails.closed_by?.display_name || 'unknown'}`
            }];
          }
        } catch (error) {
          console.log("⚠️ Could not access merge commit details due to permissions");
        }
      }

      // If we couldn't get changes but have PR details, return limited info
      return [{
        path: '(Access Restricted)',
        type: 'unknown',
        linesAdded: '?',
        linesRemoved: '?',
        message: `Limited access: Only PR author (${prDetails.author.display_name}) and administrators can view changes`
      }];

    } catch (error) {
      const isPermissionIssue = 
        error.response?.status === 404 || 
        error.response?.data?.error?.message?.includes('access');

      if (isPermissionIssue) {
        console.log("ℹ️ Permission restricted: Cannot access detailed changes");
        return [{
          path: '(No Access)',
          type: 'unknown',
          message: 'Access restricted. Changes can only be viewed by PR author or administrators.'
        }];
      }

      console.error("❌ Error fetching changes:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      return [];
    }
  }

  parseDiff(diffContent) {
    // Basic diff parsing to extract changed files
    const files = [];
    const lines = diffContent.split('\n');
    let currentFile = null;

    for (const line of lines) {
      if (line.startsWith('diff --git')) {
        // Extract file path from diff header
        const match = line.match(/diff --git a\/(.*) b\/(.*)/);
        if (match) {
          currentFile = {
            path: match[2],
            type: 'modified'
          };
          files.push(currentFile);
        }
      } else if (line.startsWith('new file')) {
        if (currentFile) currentFile.type = 'added';
      } else if (line.startsWith('deleted file')) {
        if (currentFile) currentFile.type = 'deleted';
      }
    }

    return files;
  }

  async createPullRequest(project, title, sourceBranch, destinationBranch) {
    try {
      const authString = Buffer.from(`${this.authUser}:${this.authToken}`).toString("base64");

      const response = await axios.post(
        `${this.apiBaseUrl}/repositories/obviobrasil/${project}/pullrequests`,
        {
          title,
          source: { branch: { name: sourceBranch } },
          destination: { branch: { name: destinationBranch } }
        },
        {
          headers: { 
            "Authorization": `Basic ${authString}`,
            "Accept": "application/json"
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao criar PR:", error.response?.status, error.response?.data);
      throw new Error("Erro ao criar Pull Request");
    }
  }

  async getFileContent(project, filePath, commitHash) {
    try {
      console.log(`📄 Fetching content for file: ${filePath} at commit ${commitHash}`);
      const cleanToken = this.authToken.replace(/"/g, '');
      
      const response = await axios.get(
        `${this.apiBaseUrl}/repositories/obviobrasil/${project}/src/${commitHash}/${filePath}`,
        {
          auth: {
            username: this.authUser,
            password: cleanToken
          },
          headers: {
            'Accept': '*/*',
            'User-Agent': 'curl/7.81.0'
          },
          // Add responseType to handle both text and binary files
          responseType: 'text',
          validateStatus: (status) => status < 500 // Accept 404s
        }
      );

      if (response.status === 404) {
        console.warn(`⚠️ File ${filePath} not found at commit ${commitHash}`);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching file ${filePath}:`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      return null;
    }
  }
}

export { BitbucketService };
