import fs from "fs";
import path from "path";
import { minimatch } from "minimatch";
import { askAgent } from "../config/agent.js";
import ignore from "ignore";
import { CodeAnalysisService } from "../domain/services/CodeAnalysisService.js";
import { FileRepository } from "../domain/repositories/FileRepository.js";

const codeAnalysisService = new CodeAnalysisService(new FileRepository());

/**
 * Load and parse the `.gitignore` file to determine which files/folders should be ignored.
 * @param {string} rootDirectory - The root directory to search for `.gitignore`.
 * @returns {Array<string>} - List of ignored patterns.
 */
function loadGitignore(rootDirectory = ".") {
  const gitignorePath = path.join(rootDirectory, ".gitignore");
  const ignoredPatterns = [];

  if (fs.existsSync(gitignorePath)) {
    const lines = fs.readFileSync(gitignorePath, "utf-8").split("\n");
    lines.forEach((line) => {
      const item = line.trim();
      if (item && !item.startsWith("#")) {
        ignoredPatterns.push(item);
        ignoredPatterns.push(`**/${item}`); // Ensure subdirectories are also ignored
      }
    });
  }

  if (!ignoredPatterns.includes(".git")) ignoredPatterns.push(".git", "**/.git/**");
  if (!ignoredPatterns.includes("node_modules")) ignoredPatterns.push("node_modules", "**/node_modules/**");

  return ignoredPatterns;
}

/**
 * Recursively lists all files and folders in a directory, ignoring those specified in `.gitignore`.
 * @param {string} directory - The directory to list files from.
 * @param {Array<string>} ignoredPatterns - Patterns to ignore.
 * @param {Array<string>} fileList - Accumulator for the list of files.
 * @returns {Array<string>} - List of files and folders.
 */
function listFiles(directory = ".", ig = null, fileList = []) {
  if (!ig) {
    ig = ignore().add(loadGitignore(directory));
  }

  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    const relativePath = path.relative(".", fullPath).replace(/\\/g, "/");

    if (ig.ignores(relativePath)) {
      continue; // Skip ignored files
    }

    if (entry.isDirectory()) {
      listFiles(fullPath, ig, fileList); // Recursively list files
    } else {
      fileList.push(relativePath); // Add file
    }
  }

  return fileList;
}

/**
 * Generates a structured prompt for code analysis
 * @param {string} content - The code to be analyzed
 * @param {string} filePath - Path of the file being analyzed
 * @returns {string} Formatted prompt for analysis
 */
function generateAnalysisPrompt(content, filePath) {
  // Determine the file extension to identify the language
  const extension = path.extname(filePath).substring(1);
  const language = extension || "javascript"; // Use javascript as default if no extension
  
  return `
# Code Analysis: ${filePath}

## Code to be analyzed:

\`\`\`${language}
${content}
\`\`\`

## Instructions:

### 1. Detailed Code Analysis
- Explain the main purpose and functionality of this file
- Provide an explanation of the main parts of the code
- Describe the logic, algorithms, and data structures used

### 2. Identification of Code Smells and Antipatterns
- Identify potential design problems (code smells)
- Point out ineffective or counterproductive patterns
- Examples: duplicated code, long methods, excessive complexity

### 3. Security Analysis
- Check for potential vulnerabilities in the code
- Identify points where sensitive data may be exposed
- Suggest fixes to mitigate security issues found

### 4. Performance Evaluation
- Analyze the performance of the code and point out possible bottlenecks
- Suggest optimizations to improve efficiency
- Consider memory usage, execution time, and algorithmic complexity

### 5. Refactoring Suggestions
- Recommend improvements to increase readability and maintainability
- Suggest improvements in structure, naming, and organization
- Provide concrete examples of how the code could be refactored

### General Guidelines
- Use didactic and accessible language
- Provide practical examples whenever possible
- Prioritize suggestions with the greatest impact on code quality

**IMPORTANT**: Respond ONLY in Brazilian Portuguese.
`;
}

/**
 * Single entry point for file analysis
 */
export async function analyzeFile(rl) {
  try {
    console.log("\n📜 List of available files:");
    const files = codeAnalysisService.listAnalyzableFiles();
    
    if (files.length === 0) {
      console.log("⚠️ No files available for analysis.");
      rl.prompt();
      return;
    }

    files.forEach((file, index) => {
      console.log(`${index + 1}. ${file}`);
    });

    rl.question("\nEnter the number of the file to analyze: ", async (choice) => {
      const result = await codeAnalysisService.analyzeFile(files, choice);
      if (result.error) {
        console.log(`❌ ${result.error}`);
      } else if (!result.analysis) {
        console.log("❌ Failed to get analysis from AI service");
      } else {
        console.log("\n💡 Analysis:", result.analysis);
      }
      rl.prompt();
    });
  } catch (error) {
    console.error("⚠️ Error:", error.message);
    rl.prompt();
  }
}

// Updated logic to use the new modules
function analyze(input) {
    if (isFolder(input)) {
        return analyzeFolder(input);
    } else {
        return processFile(input);
    }
}