const { spawn } = require('child_process');

describe('Terminal Functionality Test', () => {
  const runCommand = (input) => {
    return new Promise((resolve, reject) => {
      const process = spawn('node', ['src/cli.js']); // Ajuste o caminho para o CLI principal
      let output = '';

      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      process.stderr.on('data', (data) => {
        reject(data.toString());
      });

      process.on('close', () => {
        resolve(output);
      });

      process.stdin.write(`${input}\n`);
      process.stdin.end();
    });
  };

  it('should display the welcome message', async () => {
    const output = await runCommand('');
    expect(output).toContain('Welcome to AI Agent');
    expect(output).toContain('Available commands:');
  });

  it('should analyze a file', async () => {
    const output = await runCommand('analyze\n34');
    expect(output).toContain('Análise do Código: src/application/usecases/AnalyzePullRequestUseCase.js');
    expect(output).toContain('Análise Detalhada do Código');
  });

  it('should fetch Jira ticket details', async () => {
    const output = await runCommand('jira\n23842');
    expect(output).toContain('REC-23842 - Dados - Dashboard de dados dos OKRs da Tribo de Consumidor');
    expect(output).toContain('Cenário 1 - OKRs de Consulta');
  });

  it('should fetch open Jira tasks by email', async () => {
    const output = await runCommand('jira\njorge.souza@reclameaqui.com.br\n1');
    expect(output).toContain('REC-23931 - teste');
    expect(output).toContain('A resolução desse ticket "teste" requer mais informações.');
  });

  it('should check deployment status', async () => {
    const output = await runCommand('deploy');
    expect(output).toContain('🚀 **Can I deploy today?**');
    expect(output).toContain('❌ No good plz! What about Monday?');
  });

  it('should fetch documentation command', async () => {
    const output = await runCommand('docs\nqual é o comando helm do iosite');
    expect(output).toContain('helm upgrade --install iosite');
  });

  it('should display help', async () => {
    const output = await runCommand('help');
    expect(output).toContain('AI Agent - Command Guide');
    expect(output).toContain('Analyze a file');
  });

  it('should answer general knowledge questions', async () => {
    const output1 = await runCommand('qual é a capital do Brasil');
    expect(output1).toContain('Brasília');

    const output2 = await runCommand('quem descobriu o brasil');
    expect(output2).toContain('Pedro Álvares Cabral');
  });

  it('should provide a chocolate cake recipe', async () => {
    const output = await runCommand('me de uma receita de bolo de chocolate');
    expect(output).toContain('Bolo de Chocolate Delicioso (e Fácil!)');
    expect(output).toContain('Ingredientes:');
  });

  it('should fetch tasks for a specific sprint', async () => {
    const output = await runCommand('jira\nSprint 42');
    expect(output).toContain('Tasks in Sprint:');
    expect(output).toContain('REC-12345 - Example Task');
  });
});
