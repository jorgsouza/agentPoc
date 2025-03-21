import { fetchTicketDetails, buscarTasksPorEmail, buscarTasksPorSprint } from "../../infrastructure/services/jira/jiraService.js";
import { askAgent } from "../../config/agent.js";
import chalk from "chalk"; // Biblioteca para colorir o terminal

/**
 * Analyzes a Jira ticket and asks for an explanation from Agent.
 * @param {string} ticketId - Ticket code (e.g., REC-23842)
 * @param {object} rl - The readline interface.
 */
export async function analyzeJiraTicket(ticketId, rl) {
  console.log(chalk.gray(`\n🔍 Fetching ticket details...`));
  const ticket = await fetchTicketDetails(ticketId);

  if (!ticket) {
    console.log("❌ Could not retrieve ticket details.");
    rl.prompt();
    return;
  }

  console.log(`\n📌 Ticket: ${ticketId} - ${ticket.title}`);
  console.log(chalk.blueBright(`\n📝 Description:\n`) + `\n${ticket.description}`);

  console.log(chalk.gray(`\n🤖 Sending to Agent...`));
  const prompt = `
    Here are the details of a Jira ticket:

    **Title:** ${ticket.title}
    **Description:** ${ticket.description}

    Based on these details, explain what needs to be done to resolve this ticket and suggest an action plan.
    Respond objectively and in Brazilian Portuguese.
  `;

  const response = await askAgent(prompt);
  console.log(`\n💡 ${chalk.green('Agent')} >_ \n\n${response}`);
  console.log(chalk.gray("━".repeat(80))); // Separador
  rl.prompt();
}

/**
 * Lists open tasks assigned to a user by email and allows the user to select one for analysis.
 * @param {string} email - The email of the user.
 * @param {object} rl - The readline interface.
 */
export async function analyzeTasksByEmail(email, rl) {
  console.log(`🔍 Fetching open tasks for email: ${email}...`);
  const tasks = await buscarTasksPorEmail(email);

  if (!tasks || tasks.length === 0) {
    console.log("⚠️ No open tasks found for this email.");
    rl.prompt();
    return;
  }

  console.log("\n📋 Open Tasks:");
  tasks.forEach((task, index) => {
    console.log(
      `${index + 1}. ${task.key} - ${task.summary} ${chalk.gray(`-- StartDate: ${task.startDate}`)} | ${formatarTempoAberto(task.daysOpen)}`
    );
  });

  rl.question("\nEnter the number of the task to analyze: ", async (choice) => {
    const taskIndex = parseInt(choice) - 1;

    if (isNaN(taskIndex) || taskIndex < 0 || taskIndex >= tasks.length) {
      console.log("❌ Invalid choice. Please try again.");
      rl.prompt();
      return;
    }

    const selectedTask = tasks[taskIndex];
    console.log(`\n🔍 Selected Task: ${selectedTask.key} - ${selectedTask.summary}`);

    console.log(chalk.gray(`\n🤖 Sending to Agent...`));
    const prompt = `
      Here are the details of a Jira ticket:

      **Title:** ${selectedTask.summary}
      **Description:** ${selectedTask.description}
      **Start Date:** ${selectedTask.startDate}
      **Days Open:** ${selectedTask.daysOpen}

      Based on these details, explain what needs to be done to resolve this ticket and suggest an action plan.
      Respond objectively and in Brazilian Portuguese.
    `;

    const response = await askAgent(prompt);
    console.log(`\n💡 ${chalk.green('Agent')} >_ \n\n${response}`);
    console.log(chalk.gray("━".repeat(80))); // Separador
    rl.prompt();    
  });
}

/**
 * Formata a exibição do tempo em dias com cores.
 * @param {number} daysOpen - Dias que a tarefa está aberta.
 * @returns {string} - Texto formatado com cores.
 */
function formatarTempoAberto(daysOpen) {
  return daysOpen > 15
    ? chalk.red(`${daysOpen} dias`)
    : chalk.green(`${daysOpen} dias`);
}

/**
 * Lists tasks in a sprint and allows the user to select one for analysis.
 * @param {string} sprintName - The name of the sprint.
 * @param {object} rl - The readline interface.
 */
export async function analyzeTasksBySprint(sprintName, rl) {
  console.log(`🔍 Fetching tasks for sprint: ${sprintName}...`);
  const tasks = await buscarTasksPorSprint(sprintName);

  if (!tasks || tasks.length === 0) {
    console.log("⚠️ No tasks found for this sprint.");
    rl.prompt();
    return;
  }

  console.log(`\n📋 Tasks in Sprint: ${chalk.blue(`${sprintName}...`)}`);
  tasks.forEach((task, index) => {
    console.log(
      `${index + 1}. ${task.key} - ${task.summary} ${chalk.blue(`\n${task.assignee}`)} | ${chalk.gray(`StartDate: ${task.startDate}`)} | ${formatarTempoAberto(task.daysOpen)}`
    );
  });

  rl.question("\nEnter the number of the task to analyze: ", async (choice) => {
    const taskIndex = parseInt(choice) - 1;
    if (isNaN(taskIndex) || taskIndex < 0 || taskIndex >= tasks.length) {
      console.log("❌ Invalid choice. Please try again.");
      rl.prompt();
      return;
    }

    const selectedTask = tasks[taskIndex];
    console.log(`\n🔍 Analyzing task: ${selectedTask.key} - ${selectedTask.summary}`);
    const prompt = `
      Task: ${selectedTask.key} - ${selectedTask.summary}
      Assignee: ${selectedTask.assignee}
      Description: ${selectedTask.description}
      Start Date: ${selectedTask.startDate}
      End Date: ${selectedTask.endDate}
      Days Open: ${selectedTask.daysOpen}

      Based on these details, explain what needs to be done to resolve this task and suggest an action plan.
      Respond objectively and in Brazilian Portuguese.
    `;

    const response = await askAgent(prompt);
    console.log(`\n💡 ${chalk.green('Agent')} >_ \n\n${response}`);
    console.log(chalk.gray("━".repeat(80))); // Separator
    rl.prompt();
  });
}
