import chalk from "chalk";
import boxen from "boxen";
import Table from "cli-table3";

/**
 * Displays a formatted response in the terminal.
 * @param {string} message - The response text to be displayed.
 * @param {string} title - Optional title of the box.
 */
export function displayResponse(message, title = "💡 Response") {
  console.log(
    boxen(`${chalk.bold.blue(title)}\n\n${chalk.white(message)}`, {
      padding: 1,
      margin: 1,
      borderStyle: "round",
    })
  );
}

// Add this export alias for compatibility
export { displayResponse as exibirResposta };

/**
 * Displays a formatted table in the terminal.
 * @param {string} title - The title of the table.
 * @param {Array<{ description: string, link: string }>} data - Data to be displayed.
 */
export function displayTable(title, data) {
  console.log(chalk.bold.green(`\n🔗 ${title} 🔗`));

  const table = new Table({
    head: [chalk.bold.blue("Description"), chalk.bold.blue("Link")],
    colWidths: [40, 60],
  });

  data.forEach((item) => table.push([item.description, chalk.cyan(item.link)]));

  console.log(table.toString());
}

/**
 * Formats code for display in the terminal.
 * @param {string} code - The code to be formatted.
 */
export function formatCode(code) {
  console.log(
    boxen(chalk.green(code), {
      padding: 1,
      margin: 1,
      borderStyle: "round",
    })
  );
}
