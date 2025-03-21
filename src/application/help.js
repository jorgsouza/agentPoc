/**
 * Displays system help in the terminal.
 */
export function exibirAjuda() {
    console.log(`
  🤖 **AI Agent - Command Guide**
  
  1️⃣ **Ask Gemini**:
     - Type your question directly in the terminal and press **Enter**.
  
  2️⃣ **Analyze a file**:
     - Command: \`analyze\`
     - Allows you to select a project file to be analyzed by the AI.
  
  3️⃣ **Analyze a Jira ticket**:
     - Command: \`jira\`
     - Enter the ticket number (e.g., \`23842\`) and the system will fetch and interpret the ticket.

  4️⃣ **Analyze Jira tasks by email**:
     - Command: \`jira-tasks\`
     - Enter the email of the user to list and analyze open tasks.

  5️⃣ **Query Confluence documentation**:
     - Command: \`confluence\`
     - Enter your question and the system will search the indexed knowledge base.
  
  6️⃣ **Display this help**:
     - Command: \`help\`
     - Displays the list of available commands.
  
  🚀 To exit, press **CTRL + C**.
    `);
  }
