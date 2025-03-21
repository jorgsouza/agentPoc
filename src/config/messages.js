import { TerminalFormatter as tf } from '../infrastructure/utils/terminalFormatter.js';

export const MESSAGES = {
  start: tf.formatSection('Welcome to AI Agent', 
    'Your intelligent assistant for code analysis and documentation.\n' +
    'Need help? Type a command below 👇 or ask me anything!\n'
  ),
  commands: [
    '🔍 analyze       - Analyze project files',
    '🎫 jira          - Analyze Jira tickets',
    '📚 docs          - Search documentation',
    '🔄 pr            - Review pull requests',
    '📊 pr-analytics  - Analyze pull request metrics', // Add the pr-analytics command here
    '🚀 deploy        - Check deployment status',
    '📋 sprints       - List the last 5 sprints',
    '❓ help          - Show this help',
    '👋 exit          - Exit the application'
  ],
  prompt: '\n >_ ',
  exit: tf.formatSection('Goodbye', 'Thank you for using AI Agent! See you next time 👋')
};

export const MENSAGENS = MESSAGES;

export function displayInitialMessage() {
  console.log(MESSAGES.start);
  MESSAGES.commands.forEach(msg => console.log(msg));
}

export function exibirMensagemInicial() {
  console.log(MESSAGES.start);
  MESSAGES.commands.forEach(msg => console.log(msg));
}
