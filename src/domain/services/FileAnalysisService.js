import { askAgent } from "../../infrastructure/services/AIService.js";
import path from "path";
import { PromptGenerator } from "../../infrastructure/utils/PromptGenerator.js";

export class FileAnalysisService {
  constructor(fileRepository) {
    this.fileRepository = fileRepository;
  }

  listAnalyzableFiles() {
    const files = this.fileRepository.listFiles();
    return files.sort();
  }

  async analyzeFile(files, choice) {
    const index = parseInt(choice) - 1;
    
    if (isNaN(index) || index < 0 || index >= files.length) {
      return { error: "Invalid choice!" };
    }

    const selectedFile = files[index];
    const content = this.fileRepository.readFile(selectedFile);
    const prompt = this.generateAnalysisPrompt(content, selectedFile);
    
    console.log("🔍 Analyzing file...");
    const analysis = await askAgent(prompt);
    
    if (!analysis) {
      return { error: "Failed to analyze file. Please try again." };
    }
    
    return { analysis };
  }

  generateAnalysisPrompt(content, filePath) {
    return PromptGenerator.generateCodeAnalysisPrompt(content, filePath);
  }
}
