process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Optionally suppress the warning:
const originalEmitWarning = process.emitWarning;
process.emitWarning = (warning, ...args) => {
  if (typeof warning === 'string' && warning.includes('NODE_TLS_REJECT_UNAUTHORIZED')) {
    return;
  }
  originalEmitWarning(warning, ...args);
};

import readline from "readline";
import { exibirMensagemInicial, MENSAGENS } from "./config/messages.js";
import { connectToMongo } from './infrastructure/db/mongoDB/mongoConnection.js';
import { CommandProcessor } from "./application/commandProcessor.js";

// Connect to MongoDB
connectToMongo();

// Creating the readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: (line) => {
    const suggestions = CommandProcessor.getCommands().filter((cmd) => cmd.startsWith(line));
    return [suggestions.length ? suggestions : CommandProcessor.getCommands(), line];
  },
  prompt: MENSAGENS.prompt
});

// Display initial messages
exibirMensagemInicial();

// Process user input
rl.on("line", async (line) => {
  await CommandProcessor.process(line.trim(), rl);
  rl.prompt();
});

rl.on("close", () => {
  console.log(MENSAGENS.exit);
  process.exit(0);
});

// Keep the prompt active
rl.prompt();
