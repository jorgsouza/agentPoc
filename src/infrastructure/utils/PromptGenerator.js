export class PromptGenerator {
  static generateCodeAnalysisPrompt(content, filePath) {
    const extension = filePath.split('.').pop() || "javascript";
    return `
# Code Analysis: ${filePath}

## Code to be analyzed:

\`\`\`${extension}
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
}
