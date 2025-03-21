import fs from 'fs';
import path from 'path';
import { DomainError } from '../../infrastructure/errors/ErrorHandler.js';
import ignore from 'ignore';
import { loadGitignore } from "../../infrastructure/utils/gitignoreUtils.js";

export class FileService {
  constructor(baseDir = process.cwd()) {
    this.baseDir = baseDir;
    this.ignorePatterns = loadGitignore(this.baseDir);
  }

  async listFiles(directory = this.baseDir) {
    try {
      const files = [];
      const processDir = (dir) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          const relativePath = path.relative(this.baseDir, fullPath);
          
          if (this.ignorePatterns.ignores(relativePath)) continue;
          
          if (entry.isDirectory()) {
            processDir(fullPath);
          } else {
            files.push({
              path: relativePath,
              type: path.extname(entry.name).slice(1) || 'unknown'
            });
          }
        }
      };

      processDir(directory);
      return files;

    } catch (error) {
      throw new DomainError('Error listing files', { directory, error: error.message });
    }
  }

  async readFile(filePath) {
    try {
      const fullPath = path.join(this.baseDir, filePath);
      return fs.readFileSync(fullPath, 'utf-8');
    } catch (error) {
      throw new DomainError('Error reading file', { filePath, error: error.message });
    }
  }
}
