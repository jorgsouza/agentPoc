import chalk from 'chalk';
import boxen from 'boxen';

export class TerminalFormatter {
  static formatSection(title, content) {
    return `\n${chalk.bold.blue(`📌 ${title}`)}\n${chalk.white(content)}`;
  }

  static formatSeparator() {
    return chalk.gray('\n' + '─'.repeat(process.stdout.columns || 80) + '\n');
  }

  static formatUserInput(input) {
    return `${chalk.bold.green('👤 You:')} ${chalk.white(input)}`;
  }

  static formatResponse(content, title = '🤖 Agent') {
    return boxen(chalk.white(content), {
      padding: 1,
      margin: 1,
      borderColor: 'blue',
      borderStyle: 'round',
      title: chalk.bold.blue(title),
      titleAlignment: 'center'
    }) + '\n' + this.formatDivider();
  }

  static formatError(message) {
    return boxen(
      `${chalk.bold.red('❌ Error')}\n\n${chalk.white(message)}`,
      {
        padding: 1,
        margin: 1,
        borderColor: 'red',
        borderStyle: 'round'
      }
    );
  }

  static formatList(items, title = '') {
    const list = items.map(item => `  ${chalk.cyan('•')} ${item}`).join('\n');
    return title ? `${chalk.bold(title)}\n${list}` : list;
  }

  static formatCode(code, language = '') {
    return boxen(
      `${chalk.gray(language)}\n${chalk.green(code)}`,
      {
        padding: 1,
        margin: 1,
        borderColor: 'green',
        borderStyle: 'round'
      }
    );
  }

  static formatUserQuery(query) {
    return boxen(
      `${chalk.bold.cyan('👤 Your Question:')}\n\n${chalk.white(query)}`,
      {
        padding: 1,
        margin: 1,
        borderColor: 'cyan',
        borderStyle: 'round'
      }
    );
  }

  static formatAgentResponse(content) {
    return boxen(
      `${chalk.bold.green('🤖 Agent Response:')}\n\n${chalk.white(content)}`,
      {
        padding: 1,
        margin: 1,
        borderColor: 'green',
        borderStyle: 'round'
      }
    );
  }

  static formatDivider() {
    return chalk.gray('━'.repeat(process.stdout.columns || 80));
  }
}
